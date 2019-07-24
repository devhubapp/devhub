import Link from 'next/link'

const twClasses = {
  footerLink: 'mb-1 text-sm text-default hover:underline',
  footerText: 'mb-1 text-sm text-default',
  footerTitle: 'font-semibold text-default mb-2',
}

export default function Footer() {
  return (
    <footer className="container flex flex-col sm:flex-row sm:justify-center py-4 mb-10">
      <div className="flex-1 flex flex-col items-start mb-4 sm:mr-3">
        <div className={twClasses.footerTitle}>Product</div>

        <Link href="/download">
          <a className={twClasses.footerLink}>Download</a>
        </Link>

        <Link href="/features">
          <a className={twClasses.footerLink}>Features</a>
        </Link>

        <Link href="/pricing">
          <a className={twClasses.footerLink}>Pricing</a>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-start mb-4 sm:mr-3">
        <div className={twClasses.footerTitle}>Community</div>

        <a
          href="https://github.com/devhubapp/devhub"
          target="_blank"
          className={twClasses.footerLink}
        >
          GitHub
        </a>

        <a
          href="https://twitter.com/devhub_app"
          target="_blank"
          className={twClasses.footerLink}
        >
          Twitter
        </a>

        <a
          href="https://slack.devhubapp.com/"
          target="_blank"
          className={twClasses.footerLink}
        >
          Slack
        </a>
      </div>

      <div className="flex-1 flex flex-col items-start mb-4 sm:mr-3">
        <div className={twClasses.footerTitle}>Resources</div>

        <Link href="/terms">
          <a className={twClasses.footerLink}>Terms</a>
        </Link>

        <Link href="/privacy">
          <a className={twClasses.footerLink}>Privacy</a>
        </Link>
      </div>

      <div className="flex flex-col items-start">
        <div className={twClasses.footerTitle}>Contact a human</div>

        <a
          href="https://twitter.com/brunolemos"
          target="_blank"
          className={twClasses.footerLink}
        >
          @brunolemos
        </a>

        <span className={twClasses.footerText}>
          bruno<span>@</span>devhubapp.com
        </span>
      </div>
    </footer>
  )
}
