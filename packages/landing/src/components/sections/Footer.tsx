import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="container flex flex-col sm:flex-row sm:justify-center py-4 mb-10">
      <div className="flex-1 flex flex-col items-start mb-4 sm:mr-3">
        <div className="font-semibold mb-2">Product</div>

        <Link href="/download">
          <a className="mb-1 hover:underline">Download</a>
        </Link>

        <Link href="/features">
          <a className="mb-1 hover:underline">Features</a>
        </Link>

        <Link href="/pricing">
          <a className="mb-1 hover:underline">Pricing</a>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-start mb-4 sm:mr-3">
        <div className="font-semibold mb-2">Community</div>

        <a
          href="https://github.com/devhubapp/devhub"
          target="_blank"
          className="mb-1 hover:underline"
        >
          GitHub
        </a>

        <a
          href="https://twitter.com/devhub_app"
          target="_blank"
          className="mb-1 hover:underline"
        >
          Twitter
        </a>

        <a
          href="https://slack.devhubapp.com/"
          target="_blank"
          className="mb-1 hover:underline"
        >
          Slack
        </a>
      </div>

      <div className="flex-1 flex flex-col items-start mb-4 sm:mr-3">
        <div className="font-semibold mb-2">Resources</div>

        <Link href="/terms">
          <a className="mb-1 hover:underline">Terms</a>
        </Link>

        <Link href="/privacy">
          <a className="mb-1 hover:underline">Privacy</a>
        </Link>
      </div>

      <div className="flex flex-col items-start">
        <div className="font-semibold mb-2">Contact a human</div>

        <a
          href="https://twitter.com/brunolemos"
          target="_blank"
          className="mb-1 hover:underline"
        >
          @brunolemos
        </a>

        <span className="mb-1">
          bruno<span>@</span>devhubapp.com
        </span>
      </div>
    </footer>
  )
}
