import { getStreamableLinks } from '~/lib/agent'
import { Readable } from 'stream'

export default defineEventHandler(async event => {
  const query = <{ link: string }>getQuery(event)
  const streamable = await getStreamableLinks(query.link)
  if (!streamable) {
    throw new Error('Invalid url')
  }
  const sourceStream = await fetch(streamable?.url)
  setResponseHeader(event, 'Accept-Ranges', 'bytes')
  setResponseHeader(event, 'Content-Type', 'audio/mpeg')
  setResponseStatus(event, 206)
  if (sourceStream.body) {
    // @ts-expect-error streams fine
    return sendStream(event, Readable.fromWeb(sourceStream.body))
  }
  return streamable?.url
})
