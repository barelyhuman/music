import Model from 'lib/components/modal'
import Input from 'lib/components/input'
import fetcher from 'lib/api'
import { useEffect, useState } from 'react'
import Spacer from './spacer'
import Toast from 'lib/toast'
import { getTracks, setTracks } from 'lib/local-storage'

const readerKey = 'tracks'

export default ({ open, onClose, onSelect }) => {
  const [trackList, setTrackList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    readExistingTracks()
  }, [])

  useEffect(() => {
    searchTracks()
  }, [searchTerm])

  function readExistingTracks() {
    setTrackList(getTracks())
  }

  function searchTracks() {
    let _searchTerm = searchTerm

    if (!_searchTerm) {
      readExistingTracks()
    }

    if (_searchTerm.length < 3) {
      return
    }

    fetcher(`/api/search?searchTerm=${_searchTerm}`)
      .then((data) => {
        if (searchTerm.trim() === _searchTerm.trim()) {
          setTrackList(data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function addTrack(trackItem) {
    if (!searchTerm) {
      onSelect(trackItem)
      Toast.success('Playing Track')
    } else {
      const existingTracksString = window.localStorage.getItem(readerKey)
      const existingTracks = JSON.parse(existingTracksString) || []
      const tracks = [].concat(existingTracks, trackItem)
      window.localStorage.setItem('tracks', JSON.stringify(tracks))
      Toast.success('Added Track')
    }
    onClose()
  }

  function removeTrack(trackItem, idx) {
    const playlist = getTracks()
    const newList = playlist.filter(
      (item, itemIndex) =>
        item.videoId !== trackItem.videoId && itemIndex !== idx
    )
    setTracks(newList)
    readExistingTracks()
    Toast.success('Removed Track')
  }

  return (
    <Model open={open} large title="Add/Search for music" onClose={onClose}>
      <div className="flex flex-col">
        <div>
          <Input autoFocus onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Spacer y={1} />
        <div className="list-container">
          {trackList.map((trackItem, idx) => {
            return (
              <React.Fragment key={trackItem.videoId + '-' + idx}>
                <div className="flex">
                  <div
                    className="track-item cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      addTrack(trackItem)
                    }}
                  >
                    <div>{trackItem.title}</div>
                    {searchTerm ? (
                      <div
                        className="action-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          addTrack(trackItem)
                        }}
                      >
                        <i className="gg-math-plus" />
                      </div>
                    ) : (
                      <div
                        className="action-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeTrack(trackItem, idx)
                        }}
                      >
                        <i className="gg-close" />
                      </div>
                    )}
                  </div>
                </div>
                <Spacer y={2} />
              </React.Fragment>
            )
          })}
        </div>
      </div>
      <style jsx>
        {`
          .track-item {
            flex: 1;
            height: 40px;
            display: flex;
            line-height: 25px;
            font-weight: 200;
            align-items: center;
            padding: 8px;
          }

          .list-container {
            padding-bottom: 40px;
            height: 300px;
            overflow-y: auto;
          }

          .action-button {
            height: 25px;
            width: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #999;
            margin-left: auto;
            margin-right: 10px;
          }

          .action-button:hover {
            color: #000;
          }
        `}
      </style>
    </Model>
  )
}
