import Head from 'lib/components/head'
import Nprogress from 'lib/components/nprogress'
import 'toastify-js/src/toastify.css'

function App({ Component, pageProps }) {
  return (
    <>
      <Head />
      <Nprogress />
      <Component {...pageProps} />
      <style jsx global>
        {`
          body {
            font-family: 'Inter', sans-serif;
          }

          .cursor-pointer {
            cursor: pointer;
          }

          .flex {
            display: flex;
          }
          .just-center {
            justify-content: center;
          }
          .align-center {
            align-items: center;
          }
          .flex-col {
            flex-direction: column;
          }

          .just-between {
            justify-content: space-between;
          }
        `}
      </style>
    </>
  )
}

export default App
