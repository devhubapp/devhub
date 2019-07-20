import HeaderLink from './HeaderLink'

export default function Header() {
  return (
    <header className="container flex flex-row py-4 mb-6 lg:mb-12">
      <HeaderLink href="/" withRightMargin>
        DevHub
      </HeaderLink>

      <div className="flex-1" />

      <HeaderLink href="/pricing" withRightMargin>
        Pricing
      </HeaderLink>

      <HeaderLink href="/pricing" withRightMargin>
        Changelog
      </HeaderLink>

      <HeaderLink href="/download" type="primary">
        Download →
      </HeaderLink>
    </header>
  )
}
