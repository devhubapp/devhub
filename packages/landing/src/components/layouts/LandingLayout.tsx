import Header from '../common/Header'

export interface LandingLayoutProps {
  children: React.ReactNode
}

export default function LandingLayout(props: LandingLayoutProps) {
  return (
    <section className="container">
      <Header />
      {props.children}
    </section>
  )
}
