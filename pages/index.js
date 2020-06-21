import { useState, useEffect, useReducer, useRef } from 'react'
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

  useEffect(() => {
    checkServer()
  }, [])

  useEffect(() => {
    if (audioRef && audioRef.current) {
      playMusic()
    }
  }, [playIndex])

  function checkServer() {
    progressStart()
    fetcher('/ping')
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

  return (
    <div>
      <div className="music-card ">
        <div class="flex flex-col just-center align-center">
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
        </div>
      </div>

      {modalOpen ? (
        <MusicSearchModal
          onSelect={playSelected}
          open={modalOpen}
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
        `}
      </style>
    </div>
  )
}
