import {
  start as progressStart,
  done as progressDone,
} from 'lib/components/nprogress'
import { error } from 'lib/toast'

export const baseUrl = 'https://orion-server.herokuapp.com'

const fetcher = (url) => {
  progressStart()
  return fetch(baseUrl + url)
    .then((data) => {
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
