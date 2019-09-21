import React, { useEffect, useState } from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'

import { STRIPE_PUBLIC_KEY, StripeLoaderProps } from './StripeLoader.shared'

export function StripeLoader(props: StripeLoaderProps) {
  const { children } = props

  const [stripe, setStripe] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // tslint:disable-next-line no-console
      console.warn('Stripe not loaded. No window or document global object.')
      return
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = ' https://js.stripe.com/v3/'

    let isMounted = true
    script.onload = () => {
      if (!(isMounted && window.Stripe)) return
      setStripe(window.Stripe(STRIPE_PUBLIC_KEY))
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
    Stripe?: (apiKey: string) => any
  }
}
