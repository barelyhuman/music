import LRUCache from 'mnemonist/lru-cache.js'
import { raceToSuccess } from './promises'

const instances = [
  'https://api.piped.private.coffee',
  'https://pipedapi.kavin.rocks',
  'https://pipedapi-libre.kavin.rocks',
  'https://piped-api.privacy.com.de',
  'https://pipedapi.ducks.party',
  'https://pipedapi.drgns.space',
  'https://pipedapi.reallyaweso.me',
  'https://piped-api.codespace.cz',
  'https://pipedapi.owo.si',
  'https://pipedapi.adminforge.de',
  'https://pipedapi.leptons.xyz',
  'https://pipedapi.nosebs.ru',
  'https://pipedapi.orangenet.cc',
  'https://pipedapi.darkness.services',
  'https://api.piped.yt',
]

type PipedStream = {
  url: string
  format: string
  mimeType: string
  bitrate: number
  quality: string
  videoOnly: boolean
}

type PipedStreamsResponse = {
  title: string
  duration: number
  thumbnailUrl: string
  uploader: string
  livestream: boolean
  hls: string | null
  audioStreams?: PipedStream[]
  videoStreams?: PipedStream[]
  error?: string
  message?: string
}

type TrimmedData = {
  title: string
  duration: number
  thumbnailUrl: string
  uploader: string
  audio: PipedStream[]
  video: PipedStream[]
}

const cache = new LRUCache<string, TrimmedData>(100)

function extractVideoId(link: string) {
  let url: URL
  try {
    url = new URL(link)
  } catch {
    throw new Error('invalid video id')
  }
  const host = url.hostname.replace(/^www\./, '')
  if (host === 'youtu.be') {
    return url.pathname.split('/')[1] ?? null
  }
  if (host.endsWith('youtube.com')) {
    const videoId = url.searchParams.get('v')
    if (videoId) return videoId
    const matched = url.pathname.match(/^\/(?:shorts|embed|live|v)\/([\w-]+)/)
    if (matched) return matched[1]
  }
  return null
}

function trimStreams(streams: PipedStream[] = []) {
  return streams.map(stream => ({
    url: stream.url,
    format: stream.format,
    mimeType: stream.mimeType,
    bitrate: stream.bitrate,
    quality: stream.quality,
    videoOnly: stream.videoOnly,
  }))
}

function trimData(json: PipedStreamsResponse): TrimmedData {
  return {
    title: json.title,
    duration: json.duration,
    thumbnailUrl: json.thumbnailUrl,
    uploader: json.uploader,
    audio: trimStreams(json.audioStreams),
    video: trimStreams(json.videoStreams),
  }
}

function reasonMessage(reason: unknown) {
  const message = reason instanceof Error ? reason.message : String(reason)
  return message.replace(/\s+/g, ' ').slice(0, 140)
}

function summarizeReasons(reasons: unknown[]) {
  const counts = new Map<string, number>()
  reasons.forEach(reason => {
    const message = reasonMessage(reason)
    counts.set(message, (counts.get(message) ?? 0) + 1)
  })
  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1])
  if (entries.length === 1) {
    return entries[0][0]
  }
  return entries
    .slice(0, 3)
    .map(([message, count]) => `${count}x ${message}`)
    .join('; ')
}

export async function getDetails(
  link: string,
  opts: { fresh?: boolean } = {}
): Promise<TrimmedData> {
  const videoId = extractVideoId(link)

  if (!videoId) {
    throw new Error('invalid video id')
  }

  if (!opts.fresh && cache.has(videoId)) {
    return cache.get(videoId)!
  }

  const controller = new AbortController()
  const tasks = instances.map(async instance => {
    const url = new URL(`/streams/${videoId}`, instance)
    const response = await fetch(url.href, {
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]),
    })
    const data: PipedStreamsResponse = await response.json().catch(() => {
      throw new Error('instance returned a non-json response')
    })
    if (data.error) {
      throw new Error(data.message ?? data.error)
    }
    if (!response.ok) {
      throw new Error(`instance responded with HTTP ${response.status}`)
    }
    if (typeof data.title !== 'string') {
      throw new Error('instance returned no stream data')
    }
    return data
  })

  let data: PipedStreamsResponse
  try {
    data = await raceToSuccess(tasks, () => controller.abort())
  } catch (error) {
    cache.clear()
    const reasons = error instanceof AggregateError ? error.errors : [error]
    reasons.forEach(reason => console.error(reason))
    const summary = summarizeReasons(reasons)
    const messages = new Set(reasons.map(reasonMessage))
    if (messages.size === 1) {
      throw new Error(summary)
    }
    throw new Error(
      `We don't have a working proxy (${reasons.length} failed: ${summary})`
    )
  }

  const trimmedData = trimData(data)
  cache.set(videoId, trimmedData)
  return trimmedData
}

export async function getStreamableLinks(
  link: string,
  opts: { fresh?: boolean } = {}
) {
  const details = await getDetails(link, opts)
  const audio = details.audio.filter(stream => !stream.videoOnly)
  return (
    audio.find(stream => stream.mimeType === 'audio/mp4') ??
    audio[0] ??
    details.video.find(stream => !stream.videoOnly)
  )
}
