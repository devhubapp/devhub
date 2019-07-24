import NextApp, { AppContext, Container } from 'next/app'
import Head from 'next/head'
import React from 'react'

import './index.css'

import { AppGlobalStyles } from '@devhub/landing/src/components/styles/AppGlobalStyles'
import { ThemeProvider } from '@devhub/landing/src/context/ThemeContext'

export default class App extends NextApp {
  static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <ThemeProvider>
        <Container>
          <Head>
            <title>DevHub | GitHub Management tool</title>
          </Head>

          <Component {...pageProps} />
          <AppGlobalStyles />
        </Container>
      </ThemeProvider>
    )
  }
}
