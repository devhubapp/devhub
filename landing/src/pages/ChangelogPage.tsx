import LandingLayout from '../components/layouts/LandingLayout'
import GetStartedBlock from '../components/sections/GetStartedBlock'

export interface ChangelogPageProps {}

export default function ChangelogPage(_props: ChangelogPageProps) {
  return (
    <LandingLayout>
      <section id="changelog">
        <div className="container">
          <h1>Changelog</h1>
        </div>

        <div className="pb-16" />

        <GetStartedBlock />
      </section>
    </LandingLayout>
  )
}
