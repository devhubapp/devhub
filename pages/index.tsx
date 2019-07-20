import fetch from 'isomorphic-unfetch'
import { NextPage, NextPageContext } from 'next'

import LandingLayout from '@devhub/landing/src/components/layouts/LandingLayout'
import { aspectRatioToStyle } from './helpers'

export interface IndexProps {
  appToken: string | undefined
  hasOverridenRender: boolean
}

const Index: NextPage<IndexProps> = props => {
  const { appToken: _appToken, hasOverridenRender } = props

  const appToken = _appToken || getUserAppToken()

  if (appToken) {
    if (!hasOverridenRender) renderLoggedInApp({})
    return <>{null}</>
  }

  return (
    <LandingLayout>
      <div className="container flex flex-col lg:flex-row mb-16">
        <div className="lg:w-5/12 lg:mr-12">
          <h1>Beautifully simple and reliable uptime monitoring</h1>
          <h2>
            Receive alerts when your website is down through emails, Slack or
            SMS, integrated with real time data and insights
          </h2>
        </div>

        <div className="lg:w-7/12">
          <div
            className="bg-gray-200 rounded-lg"
            style={aspectRatioToStyle(3 / 5)}
          />
        </div>
      </div>

      <section id="trusted-by" className="bg-gray-200 p-6 mb-16">
        <div className="container text-center">
          <h3 className="uppercase">Trusted by</h3>
          <h4>Developers and Managers from these companies:</h4>

          <div className="flex flex-row justify-center mt-3">
            <div className="w-32">
              <div className="bg-gray-400" style={aspectRatioToStyle(1 / 3)} />
            </div>
            <div className="w-32 ml-1 lg:ml-3">
              <div className="bg-gray-400" style={aspectRatioToStyle(1 / 3)} />
            </div>
            <div className="w-32 ml-1 lg:ml-3">
              <div className="bg-gray-400" style={aspectRatioToStyle(1 / 3)} />
            </div>
            <div className="w-32 ml-1 lg:ml-3">
              <div className="bg-gray-400" style={aspectRatioToStyle(1 / 3)} />
            </div>
            <div className="w-32 ml-1 lg:ml-3">
              <div className="bg-gray-400" style={aspectRatioToStyle(1 / 3)} />
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  )
}

Index.getInitialProps = async ctx => {
  const appToken = getUserAppToken()
  const hasOverridenRender = appToken ? await renderLoggedInApp(ctx) : false

  return { appToken, hasOverridenRender }
}

function getUserAppToken() {
  let appToken: string

  try {
    if (typeof localStorage !== 'undefined') {
      const auth = JSON.parse(
        JSON.parse(localStorage.getItem('persist:root') || '{}').auth,
      ) || { appToken: '' }
      appToken = auth.appToken

      return appToken
    }
  } catch (error) {
    console.error('Failed to get appToken from localStorage', error)
  }

  // TODO: Get token from server as well, using cookies
  //  const { appToken } = nextCookie(ctx)

  return undefined
}

async function renderLoggedInApp(
  ctx: Pick<NextPageContext, 'req' | 'res'>,
): Promise<boolean> {
  const { req, res } = ctx

  const appBaseURL =
    (req &&
      ((req.headers['x-forwarded-host'] &&
        `${(req.headers['x-forwarded-proto'] &&
          `${req.headers['x-forwarded-proto']}:`) ||
          ''}//${req.headers['x-forwarded-host']}`) ||
        (req.headers.host && `//${req.headers.host}`))) ||
    (typeof window !== 'undefined' && window.location.origin)

  if (!appBaseURL) return false

  try {
    const url = `${appBaseURL}/index.html`
    const htmlResponse = await fetch(url)

    if (
      !(
        htmlResponse &&
        (htmlResponse.status >= 200 && htmlResponse.status < 300)
      )
    ) {
      throw new Error(`Failed to fetch ${url}. Status: ${htmlResponse.status}`)
    }

    const html = await htmlResponse.text()
    // html.replace(/href="[.+]?"/, `href="${appBaseURL}"`)

    if (res) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(html)

      return true
    }

    if (typeof window !== 'undefined') {
      const page = document.open('text/html', 'replace')
      page.write(html)
      page.close()

      return true
    }
  } catch (error) {
    console.error(error)
  }

  return false
}

export default Index
