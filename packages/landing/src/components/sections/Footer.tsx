import Link from 'next/link'

const twClasses = {
  FooterLink__rightMargin: 'mr-6 md:mr-12',
}

export default function Footer() {
  return (
    <footer className="container flex flex-col sm:flex-row sm:justify-center py-4 mb-10">
      <div className="flex-1 flex flex-col mb-4 sm:mr-3">
        <div className="font-semibold mb-2">Product</div>

        <Link href="/pricing">
          <a className="mb-1">Pricing</a>
        </Link>

        <Link href="/download">
          <a className="mb-1">Download</a>
        </Link>
      </div>

      <div className="flex-1 flex flex-col mb-4 sm:mr-3">
        <div className="font-semibold mb-2">Community</div>

        <a
          href="https://github.com/devhubapp/devhub"
          target="_blank"
          className="mb-1"
        >
          GitHub
        </a>

        <a
          href="https://twitter.com/devhub_app"
          target="_blank"
          className="mb-1"
        >
          Twitter
        </a>

        <a href="https://slack.devhubapp.com/" target="_blank" className="mb-1">
          Slack
        </a>
      </div>

      <div className="flex-1 flex flex-col mb-4 sm:mr-3">
        <div className="font-semibold mb-2">Resources</div>

        <Link href="/terms">
          <a className="mb-1">Terms</a>
        </Link>

        <Link href="/privacy">
          <a className="mb-1">Privacy</a>
        </Link>
      </div>

      <div className="flex flex-col">
        <div className="font-semibold mb-2">Contact a human</div>

        <a
          href="https://twitter.com/brunolemos"
          target="_blank"
          className="mb-1"
        >
          @brunolemos
        </a>

        <span className="mb-1">bruno@devhubapp.com</span>
      </div>
    </footer>
  )
}
