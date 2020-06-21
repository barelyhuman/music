export const baseUrl = 'https://orion-server.herokuapp.com'

const fetcher = (url) => {
  return fetch(baseUrl + url).then((data) => data.json())
}

export default fetcher
