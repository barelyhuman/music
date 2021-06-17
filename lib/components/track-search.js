import fetcher from 'lib/api'
import useDebounce from 'lib/hooks/use-debounce'
import { setTracks } from 'lib/local-storage'
import { success } from 'lib/toast'
import React, { useEffect, useState } from 'react'
import { usePlayer } from './player-provider'

export default function TrackSearch() {
  const player = usePlayer()
  const [trackList, setTrackList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const debouncedSearch = useDebounce(searchTerm, 550)

  useEffect(() => {
    searchTracks(debouncedSearch)
  }, [debouncedSearch])

  function searchTracks(toSearch) {
    if (!toSearch) {
      setTrackList([])
      return
    }

    fetcher(`/api/search?searchTerm=${toSearch}`)
      .then((data) => {
        if (toSearch === searchTerm) {
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

  const handleSearchChange = (e) => {
    if (!e.target.value) {
      setTrackList([])
    }
    setSearchTerm(e.target.value)
  }

  return (
    <>
      <input
        className="large w-100"
        type="text"
        placeholder="Search any track"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div style={{ maxHeight: '250px', overflow: 'auto' }}>
        <ul className="list">
          {(trackList || []).map((item) => {
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
