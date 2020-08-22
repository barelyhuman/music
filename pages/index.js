import { useState, useEffect, useReducer, useRef } from 'react'

import Mousetrap from 'mousetrap'

import fetcher, { baseUrl } from 'lib/api'
import Card from 'lib/components/card'
import {
  start as progressStart,
  done as progressDone,
} from 'lib/components/nprogress'

import Spacer from 'lib/components/spacer'
import MusicSearchModal from 'lib/components/music-search-modal'

import { getTracks } from 'lib/local-storage'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [playIndex, setPlayIndex] = useState(0)
  const audioRef = useRef(null)
  const maxVolume = 1.0
  const minVolume = 0.0
  const volumeTicker = 0.1

  useEffect(() => {
    checkServer()
    setupKeybinds()
  }, [])

  useEffect(() => {
    if (audioRef && audioRef.current) {
      playMusic()
    }
  }, [playIndex])

  function setupKeybinds() {
    Mousetrap.bind(['command+k', 'ctrl+k'], () => {
      openListModal()
      return false
    })
    Mousetrap.bind(['space'], () => {
      toggleMusic()
      return false
    })

    Mousetrap.bind(['esc'], () => {
      closeListModal()
      return false
    })

    Mousetrap.bind(['up'], () => {
      increaseVolume()
    })
    Mousetrap.bind(['down'], () => {
      decreaseVolume()
    })
  }

  function increaseVolume() {
    if (audioRef.current.volume + volumeTicker > maxVolume) {
      audioRef.current.volume = maxVolume
      return
    }
    audioRef.current.volume += volumeTicker
  }

  function decreaseVolume() {
    if (audioRef.current.volume - volumeTicker <= minVolume) {
      audioRef.current.volume = minVolume
      return
    }
    audioRef.current.volume -= volumeTicker
  }

  function checkServer() {
    progressStart()
    fetcher('/api/ping')
      .then(() => {
        progressDone()
        setLoading(false)
      })
      .catch((err) => {
        progressDone()
        console.log(err)
        setLoading(false)
      })
  }

  function toggleMusic() {
    if (!audioRef.current.paused) {
      pauseMusic()
    } else {
      playMusic()
    }
  }

  function playMusic() {
    const playlist = getTracks()
    progressStart()
    pauseMusic()
    if (!playlist[playIndex]) {
      return
    }
    audioRef.current.src =
      baseUrl + `/api/play?audioId=${playlist[playIndex].videoId}`
    audioRef.current.play()
    audioRef.current.onplaying = () => progressDone()
    audioRef.current.onended = () => playByDirection(1)
    setPlaying(true)
  }

  function pauseMusic() {
    audioRef.current.pause()
    setPlaying(false)
  }

  function openListModal() {
    setModalOpen(true)
  }

  function closeListModal() {
    setModalOpen(false)
  }

  function toggleListModal() {
    debugger
    if (modalOpen) {
      closeListModal()
    } else {
      openListModal()
    }
  }

  function playSelected(trackItem) {
    const playlist = getTracks()
    playlist.forEach((track, idx) => {
      if (track.videoId == trackItem.videoId) {
        setPlayIndex(idx)
      }
    })
  }

  function getTrackName() {
    const playlist = getTracks()
    return (playlist[playIndex] && playlist[playIndex].title) || '-'
  }

  function playByDirection(dir) {
    const playlist = getTracks()

    if (playIndex === 0 && playIndex + dir > playlist.length - 1) {
      playMusic()
      return
    }

    setPlayIndex((oldState) => {
      if (oldState + dir >= playlist.length) {
        return 0
      }
      if (oldState + dir < 0) {
        return playlist.length - 1
      }
      return oldState + dir
    })
  }

  if (loading) {
    return <></>
  }

  function refreshList(removed = false) {
    if (removed) {
      playMusic()
    }
  }

  return (
    <div>
      <div className="music-card ">
        <div className="flex flex-col just-center align-center">
          <div className="track-title">{getTrackName()}</div>
          <Spacer y={3} />
          <div className="flex just-center align-center">
            <Card>
              <div className="track-buttons">
                <div
                  className="cursor-pointer music-key"
                  onClick={openListModal}
                >
                  <i className="gg-play-list" />
                </div>
                <div
                  className="cursor-pointer"
                  onClick={(e) => playByDirection(-1)}
                >
                  <i className="gg-play-track-prev" />
                </div>
                {playing ? (
                  <div onClick={pauseMusic} className="cursor-pointer">
                    <i className="gg-play-pause" />
                  </div>
                ) : (
                  <div onClick={playMusic} className="cursor-pointer">
                    <i className="gg-play-button" />
                  </div>
                )}
                <div
                  className="cursor-pointer"
                  onClick={(e) => playByDirection(1)}
                >
                  <i className="gg-play-track-next" />
                </div>
              </div>
            </Card>
          </div>
          <Spacer y={1} />
          <div className="secondary-text">
            [ ⌘/ctrl + k ] - search | playlist
          </div>
          <Spacer y={1} />
          <div className="secondary-text">[ space ] - play | pause</div>
          <Spacer y={1} />
          <div className="secondary-text">[ &uarr;/&darr; ] - volume</div>
        </div>
      </div>

      {modalOpen ? (
        <MusicSearchModal
          onSelect={playSelected}
          open={modalOpen}
          refresh={refreshList}
          onClose={closeListModal}
        />
      ) : null}
      <audio ref={audioRef} />

      <style jsx>
        {`
          .music-card {
            height: 100vh;
            width: 100vw;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .track-buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .track-buttons > div {
            height: 25px;
            width: 50px;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .music-key {
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
          }

          .track-title {
            max-width: 350px;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .secondary-text {
            color: #999;
            font-size: 12px;
          }
        `}
      </style>
    </div>
  )
}
