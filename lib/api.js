import {
  start as progressStart,
  done as progressDone,
} from 'lib/components/nprogress'
import { error } from 'lib/toast'

export const baseUrl = 'https://orion-server.herokuapp.com'
// export const baseUrl = 'http://localhost:3001'

const fetcher = (url, options) => {
  progressStart()
  return fetch(baseUrl + url, options)
    .then((data) => {
      if (!data.ok) {
        throw data
      }
      progressDone()
      return data.json()
    })
    .catch((err) => {
      console.error(err)
      error('Oops! Something went wrong...')
      progressDone()
    })
}

export default fetcher
