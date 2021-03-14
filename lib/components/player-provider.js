import { baseUrl } from 'lib/api'
import {
  done as progressDone,
  start as progressStart,
} from 'lib/components/nprogress'
import { getTracks } from 'lib/local-storage'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

const contextDefaults = {
  trackList: [],
  currentTrackIndex: 0,
  playing: false,
  source: null,
  volume: 1,
  setTracklist: () => {},
  play: () => {},
  pause: () => {},
  isPlaying: () => {},
  setPlaying: () => {},
  setQueueList: () => {},
  getCurrentTrack: () => {},
  setPlaylistIndex: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  increaseVolume: () => {},
  decreaseVolume: () => {},
}

export const PlayerContext = createContext(contextDefaults)

export const usePlayer = () => useContext(PlayerContext)

export default function PlayerProvider({ children }) {
  const [trackList, setTracklist] = useState(() => {
    if (typeof window === 'undefined') return []
    return getTracks()
  })
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef(null)
  const maxVolume = 1.0
  const minVolume = 0.0
  const volumeTicker = 0.1

  const setQueueList = (list) => {
    setTracklist(list)
  }

  const getCurrentTrack = () => {
    const queue = trackList
    const index = currentTrackIndex
    return queue[index]
  }

  const setPlaylistIndex = (index) => {
    setCurrentTrackIndex(index)
  }

  const nextTrack = () => {
    const totalLen = trackList.length
    const currentIndex = currentTrackIndex
    let index = currentIndex + 1
    if (currentIndex + 1 > totalLen - 1) {
      index = 0
    }
    setPlaylistIndex(index)
    play()
  }

  const prevTrack = () => {
    const totalLen = trackList.length
    const currentIndex = currentTrackIndex
    let index = currentIndex - 1
    if (currentIndex - 1 < 0) {
      index = totalLen - 1
    }
    setPlaylistIndex(index)
    play()
    return
  }

  const isPlaying = useCallback(() => {
    return playing
  }, [playing])

  const _setPlaying = (value) => {
    if (typeof value !== 'boolean') {
      throw new Error('Invalid Value for setPlaying, expected a boolean')
    }
    setPlaying(value)
  }

  const play = () => {
    progressStart()
    const currentTrack = getCurrentTrack()
    if (!currentTrack) {
      return
    }
    audioRef.current.src = baseUrl + `/api/play?audioId=${currentTrack.videoId}`
    audioRef.current.play()
    audioRef.current.onplaying = () => {
      progressDone()
      _setPlaying(true)
    }
    audioRef.current.onended = () => {
      _setPlaying(false)
      nextTrack()
      play()
    }
  }

  const pause = () => {
    _setPlaying(false)
    audioRef.current.pause()
  }

  const increaseVolume = () => {
    if (audioRef.current.volume + volumeTicker > maxVolume) {
      audioRef.current.volume = maxVolume
      return
    }
    audioRef.current.volume += volumeTicker
  }

  const decreaseVolume = () => {
    if (audioRef.current.volume - volumeTicker <= minVolume) {
      audioRef.current.volume = minVolume
      return
    }
    audioRef.current.volume -= volumeTicker
  }

  return (
    <>
      <PlayerContext.Provider
        value={{
          trackList,
          currentTrackIndex,
          playing,
          source: audioRef.current,
          setTracklist,
          play,
          pause,
          isPlaying,
          setPlaying: _setPlaying,
          setQueueList,
          getCurrentTrack,
          setPlaylistIndex,
          nextTrack,
          increaseVolume,
          decreaseVolume,
          prevTrack,
        }}
      >
        {children}
        <audio ref={audioRef} />
      </PlayerContext.Provider>
    </>
  )
}
