import { getDetails } from '~/lib/agent'

export default defineEventHandler(async event => {
  const query = getQuery(event)
  if (!(typeof query === 'object' && query.link)) return
  return getDetails(query.link as string)
})
