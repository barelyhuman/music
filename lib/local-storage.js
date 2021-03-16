const readerKey = 'tracks'

export const getTracks = () => {
  const string = window.localStorage.getItem(readerKey)
  try {
    if (string && string.length) {
      return JSON.parse(string)
    }
    return []
  } catch (err) {
    window.localStorage.removeItem(readerKey)
  }
}

export const setTracks = (trackList) => {
  const trackString = JSON.stringify(trackList)
  window.localStorage.setItem(readerKey, trackString)
}
