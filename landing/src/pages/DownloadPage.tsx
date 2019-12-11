import { PlatformCategory } from '@brunolemos/devhub-core'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

import Button from '../components/common/buttons/Button'
import { LogoHead } from '../components/common/LogoHead'
import { Select } from '../components/common/Select'
import LandingLayout from '../components/layouts/LandingLayout'
import { useSystem } from '../hooks/use-system'

export interface DownloadPageProps {}

const categories: PlatformCategory[] = ['desktop', 'mobile', 'web']

const swClasses = {
  description: 'sm:w-100 m-auto leading-relaxed text-muted-65 mb-4',
  buttonsContainer: 'flex flex-row flex-wrap justify-center mb-3',
  button: 'my-1 mx-1',
}

export default function DownloadPage(_props: DownloadPageProps) {
  const autostartRef = useRef<HTMLAnchorElement>()

  const Router = useRouter()
  const autostart = 'autostart' in Router.query
  const categoryFromRouter: PlatformCategory | undefined =
    Router.query.category === 'web' ||
    Router.query.category === 'mobile' ||
    Router.query.category === 'desktop'
      ? Router.query.category
      : undefined

  const system = useSystem()
  const [_category, setCategory] = useState<PlatformCategory | undefined>(
    categoryFromRouter,
  )

  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    Router.replace(Router.route, Router.pathname, { shallow: true })
  }, [])

  useEffect(() => {
    if (!categoryFromRouter) return
    setCategory(categoryFromRouter)
  }, [categoryFromRouter])

  useEffect(() => {
    if (!autostart) return

    setIsDownloading(true)

    setTimeout(() => {
      if (!autostartRef.current) return
      autostartRef.current.click()

      setTimeout(() => {
        setIsDownloading(false)
      }, 5000)
    }, 100)
  }, [autostart])

  const category = _category || system.category || 'web'
  const { os } = system

  const version = '0.99.1'
  const releaseDate = '2019-12-11'

  return (
    <LandingLayout>
      <section id="download" className="container">
        <LogoHead />

        <div className="flex flex-col items-center m-auto text-center">
          <h1 className="text-3xl sm:text-4xl whitespace-no-wrap">
            {isDownloading ? (
              autostartRef &&
              autostartRef.current &&
              autostartRef.current.hasAttribute('download') ? (
                'Downloading...'
              ) : (
                'Redirecting...'
              )
            ) : (
              <>
                DevHub for{' '}
                <Select<PlatformCategory>
                  onChange={option => setCategory(option)}
                >
                  {categories.map(c => (
                    <Select.Option
                      key={`download-category-${c}`}
                      id={c}
                      selected={c === category}
                    >
                      {c}
                    </Select.Option>
                  ))}
                </Select>
              </>
            )}
          </h1>

          {category === 'desktop' && (
            <>
              <p className={swClasses.description}>
                Download DevHub desktop app for a more complete experience with
                menubar and push notifications.
              </p>

              <div className={swClasses.buttonsContainer}>
                <Button
                  ref={os === 'macos' ? autostartRef : (undefined as any)}
                  type={os === 'macos' ? 'primary' : 'neutral'}
                  className={swClasses.button}
                  download
                  href={`https://github.com/devhubapp/devhub/releases/download/v${version}/DevHub-${version}.dmg`}
                >
                  Download for macOS
                </Button>

                <Button
                  ref={os === 'windows' ? autostartRef : (undefined as any)}
                  type={os === 'windows' ? 'primary' : 'neutral'}
                  className={swClasses.button}
                  download
                  href={`https://github.com/devhubapp/devhub/releases/download/v${version}/DevHub-Setup-${version}.exe`}
                >
                  Download for Windows
                </Button>

                <Button
                  ref={os === 'linux' ? autostartRef : (undefined as any)}
                  type={os === 'linux' ? 'primary' : 'neutral'}
                  className={swClasses.button}
                  download
                  href={`https://github.com/devhubapp/devhub/releases/download/v${version}/DevHub-${version}.AppImage`}
                >
                  Download for Linux
                </Button>
              </div>
            </>
          )}

          {category === 'mobile' && (
            <>
              <p className={swClasses.description}>
                Download DevHub mobile app to get the native experience on your
                phone and stay productive on the go.
              </p>

              <div className={swClasses.buttonsContainer}>
                <Button
                  ref={os === 'ios' ? autostartRef : (undefined as any)}
                  type={os === 'ios' ? 'primary' : 'neutral'}
                  className={swClasses.button}
                  href="https://itunes.apple.com/us/app/devhub-for-github/id1191864199?l=en&mt=8&utm_source=devhub_landing_download"
                  target={category === 'mobile' ? '_top' : '_blank'}
                >
                  Download for iOS
                </Button>

                <Button
                  ref={os === 'android' ? autostartRef : (undefined as any)}
                  type={os === 'android' ? 'primary' : 'neutral'}
                  className={swClasses.button}
                  href="https://play.google.com/store/apps/details?id=com.devhubapp&utm_source=devhub_landing_download"
                  target={category === 'mobile' ? '_top' : '_blank'}
                >
                  Download for Android
                </Button>
              </div>
            </>
          )}

          {category === 'web' && (
            <>
              <p className={swClasses.description}>
                We recommend downloading DevHub apps to get the full experience,
                but you can also use our web version.
              </p>

              <div className={swClasses.buttonsContainer}>
                <Button
                  type="primary"
                  className={swClasses.button}
                  href="https://app.devhubapp.com/"
                  target="_top"
                >
                  Open web version
                </Button>
              </div>
            </>
          )}

          {!!version && (
            <small className="text-muted-65 mb-8">{`v${version}${
              releaseDate ? ` · ${releaseDate}` : ''
            }`}</small>
          )}
        </div>
      </section>
    </LandingLayout>
  )
}
