import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex flex-row py-4 mb-12">
      <Link href="/">
        <a>DevHub</a>
      </Link>

      <div className="flex-1" />

      <Link href="/pricing">
        <a className="ml-8">Pricing</a>
      </Link>

      <Link href="/login">
        <a className="ml-8">Login with GitHub</a>
      </Link>

      <style jsx global>{`
        header a {
          font-size: 16px;
        }
      `}</style>
    </header>
  )
}
