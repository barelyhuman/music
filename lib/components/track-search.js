import fetcher from 'lib/api'
import useDebounce from 'lib/hooks/use-debounce'
import { getTracks, setTracks } from 'lib/local-storage'
import { success } from 'lib/toast'
import React, { useEffect, useRef, useState } from 'react'
import { usePlayer } from './player-provider'

export default function TrackSearch() {
  const player = usePlayer()
  const [trackList, setTrackList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 250)

  useEffect(() => {}, [])

  useEffect(() => {
    searchTracks()
  }, [debouncedSearchTerm])

  function searchTracks() {
    let _searchTerm = debouncedSearchTerm

    if (_searchTerm.length < 3) {
      setTrackList([])
      return
    }

    fetcher(`/api/search?searchTerm=${_searchTerm}`)
      .then((data) => {
        if (debouncedSearchTerm === _searchTerm) {
          setTrackList(data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const addToQueue = (track) => {
    const queue = player.trackList.slice()
    player.setQueueList([...queue, track])
    setTracks([...queue, track])
    setSearchTerm('')
    success('Added to queue')
  }

  return (
    <>
      <input
        className="large w-100"
        type="text"
        placeholder="Search any track"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div style={{ maxHeight: '250px', overflow: 'auto' }}>
        <ul className="list">
          {trackList.map((item) => {
            return (
              <React.Fragment key={`track-${item.videoId}`}>
                <li className="list-item" onClick={(e) => addToQueue(item)}>
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
