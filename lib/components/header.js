import { useEffect } from 'react'
import Themer from '@barelyreaper/themer'

export default function Header() {
  useEffect(() => {
    initThemer()
  }, [])

  function initThemer() {
    new Themer({ trigger: darkModeToggle })
  }

  return (
    <>
      <header className="container-boundaries sticky sticky-header bg-default">
        <div className="flex flex-center">
          <div>
            <h3>
              Music
              <br />
              <small className="fw-normal no-wrap">
                A Minimalist's Music Player
              </small>
            </h3>
            <p></p>
          </div>
          <div className="ml-auto">
            <button id="darkModeToggle" className="no-border icon"></button>
          </div>
        </div>
      </header>
    </>
  )
}
