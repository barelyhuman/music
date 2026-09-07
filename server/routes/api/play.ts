import { getStreamableLinks } from '~/lib/agent'
import { Readable } from 'stream'

const totals = new Map<string, number>()

function parseRange(header: string | undefined) {
  if (!header) return null
  const matched = header.match(/^bytes=(\d+)-(\d+)?$/)
  if (!matched) return null
  const start = Number(matched[1])
  const end = matched[2] === undefined ? null : Number(matched[2])
  if (!Number.isInteger(start) || start < 0) return null
  if (end !== null && (!Number.isInteger(end) || end < start)) return null
  return { start, end }
}

function totalLengthOf(url: string) {
  const total = Number(new URL(url).searchParams.get('clen'))
  return Number.isFinite(total) && total > 0 ? total : null
}

export default defineEventHandler(async event => {
  const query = <{ link: string }>getQuery(event)
  const range = parseRange(getHeader(event, 'range'))
  const headers = range
    ? { Range: `bytes=${range.start}-${range.end ?? ''}` }
    : undefined
  const startedAt = Date.now()
  let raceError: Error | null = null
  let streamable = await getStreamableLinks(query.link).catch(reason => {
    console.error(reason)
    raceError = reason instanceof Error ? reason : new Error(String(reason))
    return undefined
  })
  let sourceStream = streamable
    ? await fetch(streamable.url, { headers })
    : null

  if (!sourceStream?.ok) {
    const fastFailure = Date.now() - startedAt < 3000
    if (streamable || fastFailure) {
      streamable = await getStreamableLinks(query.link, { fresh: true })
      sourceStream = streamable
        ? await fetch(streamable.url, { headers })
        : null
    }
  }

  if (!streamable || !sourceStream?.ok) {
    throw (
      raceError ??
      new Error(
        sourceStream
          ? `upstream responded with HTTP ${sourceStream.status}`
          : 'Invalid url'
      )
    )
  }
  setResponseHeader(event, 'Accept-Ranges', 'bytes')
  setResponseHeader(event, 'Content-Type', streamable.mimeType)

  const upstreamLength = Number(sourceStream.headers.get('content-length'))
  const hasLength = Number.isFinite(upstreamLength) && upstreamLength > 0

  let total = totalLengthOf(streamable.url)
  if (total === null) total = totals.get(streamable.url) ?? null
  if (total === null && hasLength) {
    if (sourceStream.status === 200) {
      total = upstreamLength
    } else if (sourceStream.status === 206 && range && range.end === null) {
      total = range.start + upstreamLength
    }
  }
  if (total !== null) {
    if (totals.size >= 500) totals.clear()
    totals.set(streamable.url, total)
  }

  if (range && total !== null && sourceStream.status === 206) {
    if (range.end === null) {
      setResponseHeader(
        event,
        'Content-Range',
        `bytes ${range.start}-${total - 1}/${total}`
      )
    } else {
      setResponseHeader(
        event,
        'Content-Range',
        `bytes ${range.start}-${range.end}/${total}`
      )
    }
  } else {
    const contentRange = sourceStream.headers.get('content-range')
    if (contentRange) {
      setResponseHeader(event, 'Content-Range', contentRange)
    }
  }
  if (hasLength) {
    setResponseHeader(event, 'Content-Length', String(upstreamLength))
  }
  setResponseStatus(event, sourceStream.status)
  if (sourceStream.body) {
    // @ts-expect-error streams fine
    return sendStream(event, Readable.fromWeb(sourceStream.body))
  }
  return streamable.url
})
