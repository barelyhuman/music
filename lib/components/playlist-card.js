import React from 'react'
import styles from 'styles/playlist.module.css'
import { usePlayer } from './player-provider'

export default function PlaylistCard() {
  const player = usePlayer()
  const queue = player.trackList
  const currentIndex = player.currentTrackIndex

  const playSelectedTrack = (track) => {
    const queue = player.trackList
    let index = 0
    queue.find((item, innerIndex) => {
      if (item.videoId === track.videoId) {
        index = innerIndex
        return true
      }
    })
    player.setPlaylistIndex(index)
    player.play()
  }

  return (
    <>
      <div className={styles.playerQueue}>
        <h4>Queue</h4>
        <ul className={styles.playerList}>
          {queue.map((item, index) => {
            return (
              <React.Fragment key={`queue-${item.videoId}-${index}`}>
                <li
                  className={`list-item ${styles.queueListItem} ${
                    currentIndex == index ? 'active' : ''
                  }`}
                  onClick={(e) => playSelectedTrack(item)}
                >
                  {item.title}
                </li>
              </React.Fragment>
            )
          })}
        </ul>
      </div>
    </>
  )
}
