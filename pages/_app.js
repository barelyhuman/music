import Head from 'lib/components/head'
import Nprogress from 'lib/components/nprogress'
import 'toastify-js/src/toastify.css'
import 'styles/global.css'
import PlayerProvider from 'lib/components/player-provider'

function App({ Component, pageProps }) {
  return (
    <>
      <Head />
      <Nprogress />
      <PlayerProvider>
        <Component {...pageProps} />
      </PlayerProvider>
    </>
  )
}

export default App
