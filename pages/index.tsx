import fetch from 'isomorphic-unfetch'
import { NextPage, NextPageContext } from 'next'

import HomePage from '@devhub/landing/src/pages/HomePage'

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

  return <HomePage />
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

export default HomePage
