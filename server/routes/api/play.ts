import ytdl, { downloadOptions } from 'ytdl-core'
import rangeParser from 'range-parser'
const { getInfo, chooseFormat, downloadFromInfo } = ytdl

export default defineEventHandler(async event => {
  const query = <{ link: string }>getQuery(event)
  const info = await getInfo(query.link)

  const selectedFormat = chooseFormat(info.formats, {
    quality: 'highestaudio',
  })

  const headers = getHeaders(event)

  const options: downloadOptions = {
    filter: 'audioonly',
    format: selectedFormat,
  }

  const baseStream = downloadFromInfo(info, options)

  if (headers.range) {
    const readableLength = selectedFormat.contentLength
    const range = rangeParser(parseInt(readableLength, 10), headers.range)

    if (range === -1) {
      return baseStream
    }

    if (!(Array.isArray(range) && range.length)) {
      return baseStream
    }

    const start = range[0].start
    const end = range[0].end
    setResponseHeader(event, 'Accept-Ranges', 'bytes')
    setResponseHeader(event, 'Content-Type', 'audio/mp3')
    setResponseStatus(event, 206)
    setResponseHeader(
      event,
      'Content-Range',
      `bytes ${start}-${end}/${readableLength}`
    )
    setResponseHeader(event, 'Content-Length', end - start + 1)
    // setResponseHeader(event, "Connection", "keep-alive");
    return downloadFromInfo(info, {
      ...options,
      range: {
        start: start,
        end: end,
      },
    })
  }

  return baseStream
})
