import { NextPage } from 'next'

import { LogoHead } from '../src/components/common/LogoHead'
import LandingLayout from '../src/components/layouts/LandingLayout'

export interface ErrorPageProps {}

const Error: NextPage<ErrorPageProps> = () => {
  return (
    <LandingLayout>
      <section id="error" className="container">
        <LogoHead />

        <div className="flex flex-col items-center m-auto text-center">
          <h1 className="text-3xl sm:text-4xl whitespace-no-wrap">
            Oops, try another page
          </h1>
        </div>
      </section>
    </LandingLayout>
  )
}

export default Error
