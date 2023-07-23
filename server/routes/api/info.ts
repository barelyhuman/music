import ytdl from 'ytdl-core'

export default defineEventHandler(async event => {
  const query = getQuery(event)
  if (!(typeof query === 'object' && query.link)) return
  const info = await ytdl.getInfo(query.link as string)
  return {
    title: info.videoDetails.title,
  }
})
