import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  // static async getInitialProps(ctx) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return { ...initialProps }
  // }

  render() {
    return (
      <Html dir="ltr" lang="en" className="h-full antialiased text-gray-900 scroll-smooth">
        <Head>
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>
        <body className="min-h-screen h-full bg-gray-100 font-sans text-base font-normal tracking-normal">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument