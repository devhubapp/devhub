import NextDocument, { Head, Main, NextScript } from 'next/document'
import React from 'react'

const shortDescriptionTitle = 'GitHub Management Tool'
const shortDescriptionContent =
  "Take back control of your GitHub workflow. Manage notifications, apply filters, save custom searches and don't miss anything important."
const fullDescription = `${shortDescriptionTitle}. ${shortDescriptionContent}`
const screenshot =
  'https://user-images.githubusercontent.com/619186/60048043-9bd77300-96a1-11e9-96c3-ad4ebd33e550.jpg'

export default class Document extends NextDocument {
  render() {
    return (
      <html>
        <Head>
          <meta charSet="utf-8" />
          <base target="_top" />

          <meta name="description" content={fullDescription} />

          {/* Google / Search Engine Tags */}
          <meta itemProp="name" content={shortDescriptionTitle} />
          <meta itemProp="description" content={shortDescriptionContent} />
          <meta itemProp="image" content={screenshot} />

          {/* Facebook Meta Tags */}
          <meta property="og:url" content="https://devhubapp.com" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={shortDescriptionTitle} />
          <meta property="og:description" content={shortDescriptionContent} />
          <meta property="og:image" content={screenshot} />

          {/* Twitter Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={shortDescriptionTitle} />
          <meta name="twitter:description" content={shortDescriptionContent} />
          <meta name="twitter:image" content={screenshot} />
          <meta
            name="twitter:image:alt"
            content="Screenshot of the DevHub web app, showing 4 columns with GitHub activities on them."
          />
          <meta name="twitter:creator" content="@brunolemos" />
          <meta name="twitter:site" content="@brunolemos" />

          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="DevHub" />
          <meta name="apple-mobile-web-app-title" content="DevHub" />
          <meta name="theme-color" content="#1F2229" />
          <meta name="msapplication-navbutton-color" content="#1F2229" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta
            name="msapplication-starturl"
            content="https://devhubapp.com/"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
          />

          <link
            rel="apple-touch-icon"
            type="image/png"
            sizes="100x100"
            href="/static/logo.png"
          />
          <link
            rel="apple-touch-icon"
            type="image/png"
            sizes="200x200"
            href="/static/logo@2x.png"
          />
          <link
            rel="apple-touch-icon"
            type="image/png"
            sizes="300x300"
            href="/static/logo@3x.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="100x100"
            href="/static/logo.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="200x200"
            href="/static/logo@2x.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="300x300"
            href="/static/logo@3x.png"
          />

          <link rel="shortcut icon" href="/favicon.ico" />

          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-52350759-6"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-52350759-6');
          `,
            }}
          />
        </Head>

        <body
          style={{
            ...(process.env.NODE_ENV === 'development' && { color: 'red' }),
          }}
        >
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
