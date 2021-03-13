import fetcher from 'lib/api'
import { setTracks } from 'lib/local-storage'
import { success } from 'lib/toast'
import { useState } from 'react'

export default function Import() {
  const [urlValue, setURLValue] = useState('')

  const handleImport = async () => {
    const response = await fetcher(`/api/import?url=${urlValue}`)
    if (!response && !response.data) {
      return error('Nothing to import')
    }
    setTracks(response.data)
    success('Imported tracks')
  }

  return (
    <>
      <input
        type="text"
        value={urlValue}
        onChange={(e) => setURLValue(e.target.value)}
      />
      <button type="submit" onClick={handleImport}>
        Import
      </button>
    </>
  )
}
