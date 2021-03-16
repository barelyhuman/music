import fetcher from 'lib/api'
import Header from 'lib/components/header'
import PlayerCard from 'lib/components/player-card'
import { usePlayer } from 'lib/components/player-provider'
import { getTracks, setTracks } from 'lib/local-storage'
import { error, success } from 'lib/toast'
import { useState } from 'react'
import conch from '@barelyreaper/conch'

export default function Import() {
  const [urlValue, setURLValue] = useState('')
  const [count, setCount] = useState(0)
  const [complete, setComplete] = useState(false)
  const [allTracks, setAllTracks] = useState([])
  const [resolvedTracks, setResolvedTracks] = useState([])
  const player = usePlayer()

  const getAllTracks = async () => {
    const response = await fetcher(`/api/import-tracks?url=${urlValue}`)
    if (!response && !response.data) {
      return error('Nothing to import')
    }
    setAllTracks(response.data)
    success('Got all tracks to import, listing them for you...')
  }

  const startImport = async () => {
    try {
      const limit = 10
      setCount(0)
      success('Started importing')
      const chunkSize = 10
      const chunks = []
      const totalChunks = Math.ceil(allTracks.length / chunkSize)
      for (let i = 0; i < totalChunks; i += 1) {
        chunks.push(allTracks.slice(i * chunkSize, (i + 1) * chunkSize))
      }

      const doneTracks = await conch(
        chunks,
        (tracks) => {
          return fetcher(`/api/import`, {
            method: 'POST',
            body: JSON.stringify({ tracks: tracks }),
          }).then((data) => {
            setCount((prevCount) => {
              if (data && data.data) {
                return parseInt(prevCount, 10) + parseInt(data.data.length, 10)
              }
              return prevCount
            })
            return data
          })
        },
        {
          limit,
        }
      )

      const flatten = doneTracks.reduce(
        (acc, item) => acc.concat(item.data),
        []
      )

      success('Import Complete')
      setComplete(true)
      setResolvedTracks(flatten)
    } catch (err) {
      console.error(err)
      error('Oops! Something went wrong')
    }
  }

  const handleReplaceQueue = async () => {
    setTracks(resolvedTracks)
    success('Imported tracks')
    player.setTracklist(getTracks())
  }

  const addToQueue = async () => {
    const tracks = getTracks()
    setTracks([...tracks, resolvedTracks])
    player.setTracklist(getTracks())
    success('Added tracks')
  }

  return (
    <>
      <Header />
      <div className="container-boundaries">
        <PlayerCard />
      </div>
      <div className="container-boundaries">
        <div className="flex flex-col flex-center">
          <input
            type="text"
            className="mb-2 large w-100"
            value={urlValue}
            placeholder="Enter spotify url"
            onChange={(e) => setURLValue(e.target.value)}
          />
          <div>
            {!allTracks.length ? (
              <button class="mr-2" onClick={getAllTracks}>
                Get Tracks
              </button>
            ) : (
              <>
                <button class="mr-2" onClick={startImport}>
                  Start Import
                </button>
              </>
            )}
          </div>
          {allTracks.length ? (
            <div className="mt-1">
              <p class="text-center">
                Imported ({count}/{allTracks.length})
              </p>
            </div>
          ) : null}
        </div>
        <div>
          {complete ? (
            <>
              <button class="mr-2" type="submit" onClick={handleReplaceQueue}>
                Replace Queue
              </button>
              <button type="submit" onClick={addToQueue}>
                Add To Queue
              </button>
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}
