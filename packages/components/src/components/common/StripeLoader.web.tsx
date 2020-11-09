import React, { useEffect, useState } from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'

import { AppState, InteractionManager } from 'react-native'
import { STRIPE_PUBLIC_KEY, StripeLoaderProps } from './StripeLoader.shared'

export function StripeLoader(props: StripeLoaderProps) {
  const { children } = props

  const [stripe, setStripe] = useState<stripe.Stripe | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('Stripe not loaded. No window or document global object.')
      return
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = ' https://js.stripe.com/v3/'

    let isMounted = true
    script.onload = () => {
      if (!(isMounted && window.Stripe)) return

      if (AppState.currentState === 'active') {
        void InteractionManager.runAfterInteractions(() => {
          setStripe(window.Stripe(STRIPE_PUBLIC_KEY))
        })
      } else {
        setStripe(window.Stripe(STRIPE_PUBLIC_KEY))
      }
    }

    document.head.appendChild(script)

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <StripeProvider stripe={stripe}>
      <Elements>{children}</Elements>
    </StripeProvider>
  )
}

declare global {
  interface Window {
    Stripe?: (apiKey: string) => stripe.Stripe
  }
}
