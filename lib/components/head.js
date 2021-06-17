import NextHead from 'next/head'

export default function Head(props) {
  return (
    <>
      <NextHead>
        <link href="https://unpkg.com/css.gg/icons/all.css" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600&display=swap"
          rel="stylesheet"
        ></link>
        <link
          rel="stylesheet"
          href="https://unpkg.com/open-color@1.8.0/open-color.css"
        />
        <title>Music</title>
      </NextHead>
    </>
  )
}
