import NextApp, { Container } from 'next/app'
import Head from 'next/head'
import React from 'react'

import './styles/tailwind.css'

import './styles/index.css'

import './styles/devices/iphone.css'

import { AppGlobalStyles } from '../src/components/styles/AppGlobalStyles'
import { AuthProvider } from '../src/context/AuthContext'
import { PaddleLoaderProvider } from '../src/context/PaddleLoaderContext'
import { StripeLoaderProvider } from '../src/context/StripeLoaderContext'
import { ThemeConsumer, ThemeProvider } from '../src/context/ThemeContext'

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
      <StripeLoaderProvider>
        <PaddleLoaderProvider>
          <ThemeProvider>
            <AuthProvider>
              <Container>
                <Head>
                  <title>DevHub | TweetDeck for GitHub</title>
                </Head>

                <ThemeConsumer>
                  {({ theme }) => (
                    <div
                      className={theme.isDark ? 'dark-theme' : 'light-theme'}
                    >
                      <Component {...pageProps} />
                    </div>
                  )}
                </ThemeConsumer>
                <AppGlobalStyles />
              </Container>
            </AuthProvider>
          </ThemeProvider>
        </PaddleLoaderProvider>
      </StripeLoaderProvider>
    )
  }
}
