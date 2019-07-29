import NextApp, { Container } from 'next/app'
import Head from 'next/head'
import React from 'react'

import './styles/tailwind.css'

import './styles/index.css'

import './styles/devices/iphone.css'

import { AppGlobalStyles } from '@devhub/landing/src/components/styles/AppGlobalStyles'
import {
  ThemeConsumer,
  ThemeProvider,
} from '@devhub/landing/src/context/ThemeContext'

export default class App extends NextApp {
  onLoad() {
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        document.body.className = `${document.body.className} loaded`.trim()
      })
    }, 1000)
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', this.onLoad)
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('load', this.onLoad)
    }
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
