import NextApp, { AppContext, Container } from 'next/app'
import Head from 'next/head'
import React from 'react'

import './styles/index.css'

import './styles/devices/iphone.css'

import { AppGlobalStyles } from '@devhub/landing/src/components/styles/AppGlobalStyles'
import {
  ThemeConsumer,
  ThemeProvider,
} from '@devhub/landing/src/context/ThemeContext'

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
        <Container className="xxx">
          <Head>
            <title>DevHub | GitHub Management tool</title>
          </Head>

          <ThemeConsumer>
            {({ theme }) => (
              <div className={theme.isDark ? 'dark-theme' : 'light-theme'}>
                <Component {...pageProps} />
              </div>
            )}
          </ThemeConsumer>
          <AppGlobalStyles />
        </Container>
      </ThemeProvider>
    )
  }
}
