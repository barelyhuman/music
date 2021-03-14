import { baseUrl } from 'lib/api'
import { getTracks } from 'lib/local-storage'
import React, { useEffect, useRef } from 'react'
import styles from 'styles/player.module.css'
import { usePlayer } from './player-provider'

import { Play, Pause, SkipForward, SkipBack } from 'react-feather'

export default function PlayerCard() {
  const player = usePlayer()

  const playTrack = () => {
    player.play()
  }

  const pauseTrack = () => {
    player.pause()
  }

  const nextTrack = () => {
    player.nextTrack()
  }

  const prevTrack = () => {
    player.prevTrack()
  }

  return (
    <>
      <div className={styles.playerCard}>
        <div className="mb-2">
          <marquee behavior="sliding" direction="left">
            {player.getCurrentTrack() && player.getCurrentTrack().title}
          </marquee>
        </div>
        <div className="flex flex-center">
          <button className="pointer no-border icon" onClick={prevTrack}>
            <SkipBack height="16" width="16" fill="currentColor" />
          </button>
          {player.isPlaying() ? (
            <button
              onClick={pauseTrack}
              className="ml-2 pointer no-border icon"
            >
              <Pause height="16" width="16" fill="currentColor" />
            </button>
          ) : (
            <button onClick={playTrack} className="ml-2 pointer no-border icon">
              <Play height="16" width="16" fill="currentColor" />
            </button>
          )}
          <button className="ml-2 pointer no-border icon" onClick={nextTrack}>
            <SkipForward height="16" width="16" fill="currentColor" />
          </button>
        </div>
      </div>
    </>
  )
}
