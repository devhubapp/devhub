import Link from 'next/link'

const twClasses = {
  footerLink: 'mb-1 text-sm text-default hover:underline',
  footerText: 'mb-1 text-sm text-default',
  footerTitle: 'font-semibold text-default mb-2',
}

export default function Footer() {
  // const { authData } = useAuth()

  return (
    <footer className="container flex flex-row flex-wrap sm:justify-between md:justify-around py-4 mb-10">
      <div className="flex flex-col items-start w-1/2 sm:w-auto mb-4 sm:mr-3">
        <div className={twClasses.footerTitle}>Product</div>

        <Link href="/download">
          <a className={twClasses.footerLink}>Download</a>
        </Link>

        <Link href="/#features">
          <a className={twClasses.footerLink}>Features</a>
        </Link>

        {/* <Link href="/changelog">
          <a className={twClasses.footerLink}>Changelog</a>
        </Link> */}

        <Link href="/pricing">
          <a className={twClasses.footerLink}>Pricing</a>
        </Link>

        {/* <Link href="/account">
          <a className={twClasses.footerLink}>
            {authData &&
            authData.plan &&
            authData.plan.amount &&
            authData.plan.interval
              ? 'Manage subscription'
              : 'My account'}
          </a>
        </Link> */}
      </div>

      <div className="flex flex-col items-start w-1/2 sm:w-auto mb-4 sm:mr-3">
        <div className={twClasses.footerTitle}>Community</div>

        <a
          className={twClasses.footerLink}
          href="https://twitter.com/devhub_app"
          target="_blank"
          rel="noopener"
        >
          Twitter
        </a>

        <a
          className={twClasses.footerLink}
          href="https://github.com/devhubapp/devhub"
          target="_blank"
          rel="noopener"
        >
          GitHub
        </a>

        <a
          className={twClasses.footerLink}
          href="https://slack.devhubapp.com/"
          target="_blank"
          rel="noopener"
        >
          Slack
        </a>
      </div>

      {/* <div className="flex flex-col items-start w-1/2 sm:w-auto mb-4 sm:mr-3">
        <div className={twClasses.footerTitle}>Resources</div>

        <Link href="/terms">
          <a className={twClasses.footerLink}>Terms</a>
        </Link>

        <Link href="/privacy">
          <a className={twClasses.footerLink}>Privacy</a>
        </Link>
      </div> */}

      <div className="flex flex-col items-start w-1/2 sm:w-auto">
        <div className={twClasses.footerTitle}>Contact a human</div>

        <a
          className={twClasses.footerLink}
          href="https://twitter.com/messages/compose?recipient_id=1013342195087224832"
          target="_blank"
          rel="noopener"
        >
          @devhub_app
        </a>

        <a
          className={twClasses.footerLink}
          href="https://twitter.com/brunolemos"
          target="_blank"
          rel="noopener"
        >
          @brunolemos
        </a>

        <span className={twClasses.footerText}>
          bruno<span className="text-default">@</span>devhubapp.com
        </span>
      </div>
    </footer>
  )
}
