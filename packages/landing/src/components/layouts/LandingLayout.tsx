import Footer from '../sections/Footer'
import GetStartedBlock from '../sections/GetStartedBlock'
import Header from '../sections/header/Header'

export interface LandingLayoutProps {
  children: React.ReactNode
}

export default function LandingLayout(props: LandingLayoutProps) {
  return (
    <section id="landing-page">
      <Header />

      {props.children}

      <GetStartedBlock />

      <Footer />
    </section>
  )
}
