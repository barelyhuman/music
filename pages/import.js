import fetcher from 'lib/api'
import Header from 'lib/components/header'
import PlayerCard from 'lib/components/player-card'
import { usePlayer } from 'lib/components/player-provider'
import { getTracks, setTracks } from 'lib/local-storage'
import { success } from 'lib/toast'
import { useState } from 'react'

export default function Import() {
  const [urlValue, setURLValue] = useState('')
  const player = usePlayer()

  const handleReplaceQueue = async () => {
    const response = await fetcher(`/api/import?url=${urlValue}`)
    if (!response && !response.data) {
      return error('Nothing to import')
    }
    setTracks(response.data)
    success('Imported tracks')
    player.setTracklist(getTracks())
  }

  const addToQueue = async () => {
    const response = await fetcher(`/api/import?url=${urlValue}`)
    if (!response && !response.data) {
      return error('Nothing to import')
    }
    const tracks = getTracks()
    setTracks([...tracks, response.data])
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
            <button class="mr-2" type="submit" onClick={handleReplaceQueue}>
              Replace Queue
            </button>
            <button type="submit" onClick={addToQueue}>
              Add To Queue
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
