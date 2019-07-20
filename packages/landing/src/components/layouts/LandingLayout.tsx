import Header from '../common/Header'

export interface LandingLayoutProps {
  children: React.ReactNode
}

export default function LandingLayout(props: LandingLayoutProps) {
  return (
    <section id="landing-page">
      <Header />
      {props.children}
    </section>
  )
}
