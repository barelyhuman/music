import { setTracks } from 'lib/local-storage'
import React from 'react'
import styles from 'styles/playlist.module.css'
import { usePlayer } from './player-provider'
import feather from 'feather-icons'

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

  const removeSelectedTrack = (index) => {
    const queue = player.trackList.filter((_, trackIndex) => {
      return index !== trackIndex
    })
    player.setQueueList(queue)
    setTracks(queue)
  }

  return (
    <>
      <div className={styles.playerQueue}>
        <h4 className="m-0 p-0">Queue</h4>
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
                  <div className="w-100 flex flex-center">
                    <p className="w-50 trim-text">{item.title}</p>
                    <button
                      onClick={() => removeSelectedTrack(index)}
                      className="ml-auto no-border icon"
                    >
                      <i
                        dangerouslySetInnerHTML={{
                          __html: feather.icons['x-circle'].toSvg({
                            height: 16,
                            width: 16,
                          }),
                        }}
                      ></i>
                    </button>
                  </div>
                </li>
              </React.Fragment>
            )
          })}
        </ul>
      </div>
      <style jsx>
        {`
          ul::-webkit-scrollbar {
            width: 10px;
          }

          /* Track */
          ul::-webkit-scrollbar-track {
            background: var(--bg);
            border-radius: 8px;
          }

          /* Handle */
          ::-webkit-scrollbar-thumb {
            background: var(--fg-lighter);
            border-radius: 8px;
          }
        `}
      </style>
    </>
  )
}
