import LandingLayout from '../components/layouts/LandingLayout'

export interface ChangelogPageProps {}

export default function ChangelogPage(_props: ChangelogPageProps) {
  return (
    <LandingLayout>
      <section id="changelog" className="container">
        <h1>Changelog</h1>
      </section>
    </LandingLayout>
  )
}
