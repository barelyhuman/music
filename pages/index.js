import fetcher from 'lib/api'
import Footer from 'lib/components/footer'
import Header from 'lib/components/header'
import {
  done as progressDone,
  start as progressStart,
} from 'lib/components/nprogress'
import PlayerCard from 'lib/components/player-card'
import { usePlayer } from 'lib/components/player-provider'
import PlaylistCard from 'lib/components/playlist-card'
import TrackSearch from 'lib/components/track-search'
import Mousetrap from 'mousetrap'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [playIndex, setPlayIndex] = useState(0)

  const player = usePlayer()

  useEffect(() => {
    checkServer()
  }, [])

  useEffect(() => {
    setupKeybinds()
  }, [player])

  function setupKeybinds() {
    Mousetrap.bind(['space'], () => {
      if (player.isPlaying()) {
        player.pause()
        return
      }

      player.play()

      return false
    })
    Mousetrap.bind(['up'], () => {
      player.increaseVolume()
    })
    Mousetrap.bind(['down'], () => {
      player.decreaseVolume()
    })
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

  if (loading) {
    return <></>
  }

  return (
    <>
      <Header />
      <div className="container-boundaries">
        <TrackSearch />
      </div>
      <div className="container-boundaries mt-1 w-100">
        <PlayerCard />
      </div>
      <div className="container-boundaries mt-1 w-100">
        <PlaylistCard />
      </div>
      <Footer />
    </>
  )
}
