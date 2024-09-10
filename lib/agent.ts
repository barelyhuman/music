import LRUCache from 'mnemonist/lru-cache'

const instances = [
  'https://pipedapi.in.projectsegfau.lt',
  'https://pipedapi.kavin.rocks',
  'https://api.piped.yt',
]

type TrimmedData = {
  title: string
  audio: Array<ReturnType<typeof trimAudio>>
}

const cache = new LRUCache<string, TrimmedData>(100)

function trimAudio(json: any) {
  return {
    url: json.url,
    format: json.format,
    mimeType: json.mimeType,
    videoOnly: json.videoOnly,
  }
}

function trimData(json: any): TrimmedData {
  return {
    title: json.title,
    audio: (json.audioStreams ?? []).map(trimAudio),
  }
}

export async function getDetails(link: string): Promise<TrimmedData> {
  const url = new URL(link)
  const videoId = url.searchParams.get('v')

  if (!videoId) {
    throw new Error('invalid video id')
  }

  if (cache.has(videoId)) {
    return cache.get(videoId)!
  }

  const resolutions = await Promise.allSettled(
    instances.map(async link => {
      const url = new URL(`/streams/${videoId}`, link)
      const response = await fetch(url.href, {
        signal: AbortSignal.timeout(2000),
      })
      if (response.ok) {
        return response.json()
      }
      throw new Error(await response.json())
    })
  )

  const workingInstance = resolutions.find(d => d.status === 'fulfilled')
  if (!(workingInstance && workingInstance.status === 'fulfilled')) {
    throw new Error("We don't have a working proxy")
  }
  const trimmedData = trimData(workingInstance.value)
  cache.set(videoId, trimmedData)
  return trimmedData
}

export async function getStreamableLinks(link: string) {
  const details = await getDetails(link)
  return details?.audio
    .filter(d => !d.videoOnly)
    .find(d => d.mimeType === 'audio/mp4')
}
