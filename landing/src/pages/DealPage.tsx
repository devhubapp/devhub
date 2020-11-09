import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import Button from '../components/common/buttons/Button'
import { LogoHead } from '../components/common/LogoHead'
import { TextInput } from '../components/common/TextInput'
import LandingLayout from '../components/layouts/LandingLayout'
import GitHubLoginButton from '../components/sections/login/GitHubLoginButton'
import { useAuth } from '../context/AuthContext'
import { usePlans } from '../context/PlansContext'

export interface DealPageProps {}

const swClasses = {
  description: 'sm:w-100 m-auto leading-relaxed text-muted-65 mb-8',
  buttonsContainer: 'flex flex-row flex-wrap justify-center mb-3',
  button: 'my-1 mx-1',
}

export default function DealPage(_props: DealPageProps) {
  const Router = useRouter()

  const { authData } = useAuth()

  const { dealCode, errorMessage, loadingState, trySetDealCode } = usePlans()

  const [code, setCode] = useState<string>(dealCode || '')
  const [submitionResultCount, setSubmitionResultCount] = useState(0)

  useEffect(() => {
    if (submitionResultCount) {
      Router.push('/pricing')
    }
  }, [dealCode, submitionResultCount])

  function submit(_code: string | null) {
    trySetDealCode(_code)
      .then(() => {
        setSubmitionResultCount((v) => v + 1)
      })
      .catch(() => {
        //
      })
  }

  function renderContent() {
    if (!(authData.appToken && authData.github && authData.github.login)) {
      return <GitHubLoginButton />
    }

    return (
      <form
        className="flex flex-col items-center w-full md:w-2/3 lg:w-150 m-auto text-center"
        onSubmit={(e) => {
          e.preventDefault()
          submit(code)
        }}
      >
        <h1 className="text-3xl sm:text-4xl whitespace-no-wrap">
          Special deal
        </h1>

        <p className={swClasses.description}>
          If you received a special deal code, you can apply it here. Please
          note special deals are private and made only for a specific person or
          team, unless otherwise specified.
        </p>

        <TextInput
          autoFocus
          className="mb-4 w-full text-center text-2xl font-thin uppercase"
          onChange={(e) => {
            setCode(e.target.value)
          }}
          placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
          style={{ minWidth: 250 }}
          value={code}
        />

        <div className="flex flex-row">
          {!!dealCode && (
            <Button
              className="mb-4 mx-1"
              type="neutral"
              disabled={loadingState === 'loading'}
              onClick={() => {
                setCode('')
                submit(null)
              }}
            >
              Remove current deal
            </Button>
          )}

          <Button
            className="mb-4 mx-1"
            type="primary"
            disabled={!code /* || code === dealCode*/}
            loading={loadingState === 'loading'}
            onClick={() => {
              submit(code)
            }}
          >
            Apply deal code
          </Button>
        </div>

        {loadingState === 'error' && (
          <p className="mb-4 text-sm text-red italic">
            {`Failed to apply deal${errorMessage ? `: ${errorMessage}` : ''}`}
          </p>
        )}
      </form>
    )
  }

  return (
    <LandingLayout>
      <section id="deal" className="container">
        <div className="flex flex-col items-center m-auto text-center">
          <LogoHead />

          {renderContent()}
        </div>
      </section>
    </LandingLayout>
  )
}
