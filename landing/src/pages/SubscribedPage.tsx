import React from 'react'

import { allPlansObj } from '@devhub/core/dist'
import Button from '../components/common/buttons/Button'
import LandingLayout from '../components/layouts/LandingLayout'
import { useAuth } from '../context/AuthContext'

export interface SubscribedPageProps {}

export default function SubscribedPage(_props: SubscribedPageProps) {
  const { authData } = useAuth()

  if (!authData.plan) return null

  const planInfo = allPlansObj[authData.plan.id]
  if (!planInfo) return null

  return (
    <LandingLayout>
      <section id="subscribed" className="container">
        <div className="flex flex-col items-center m-auto text-center">
          <img
            alt="DevHub screenshot"
            className="w-20 h-20 mb-8 bg-primary border-4 border-bg-less-2 rounded-full"
            src="/static/logo.png"
          />

          <h1 className="mb-4 text-2xl sm:text-4xl whitespace-no-wrap">
            You are all set 🎉
          </h1>

          <h2 className="mb-4 text-xl sm:text-2xl">
            You've successfully subscribed to the{' '}
            <strong>{planInfo.label}</strong> plan
          </h2>

          <p className="mb-8 text-default">
            You can now open DevHub or download it below:
          </p>

          <div className="flex flex-row">
            <Button type="primary" href="/download" className="mb-2 mr-2">
              Download the app
            </Button>

            <Button type="neutral" href="/account" className="mb-2">
              Manage subscription
            </Button>
          </div>
        </div>
      </section>
    </LandingLayout>
  )
}

declare global {
  interface Window {
    Stripe?: (apiKey: string) => any
  }
}
