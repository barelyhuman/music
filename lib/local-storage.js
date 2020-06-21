const readerKey = 'tracks'

export const getTracks = () => {
  const string = window.localStorage.getItem(readerKey)
  if (string && string.length) {
    return JSON.parse(string)
  }
  return []
}

export const setTracks = (trackList) => {
  const trackString = JSON.stringify(trackList)
  window.localStorage.setItem(readerKey, trackString)
}
