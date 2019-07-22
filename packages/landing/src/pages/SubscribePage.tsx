import { useRouter } from 'next/router'

import LandingLayout from '../components/layouts/LandingLayout'

export interface SubscribePageProps {}

export default function SubscribePage(_props: SubscribePageProps) {
  const router = useRouter()

  return (
    <LandingLayout>
      <section id="subscribe" className="container">
        <h1>Subscribe</h1>
        <h2>{`Selected plan: ${router.query.plan || 'none'}`}</h2>
      </section>
    </LandingLayout>
  )
}
