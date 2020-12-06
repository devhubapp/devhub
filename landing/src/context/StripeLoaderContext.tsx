import React, { useContext, useEffect, useState, useMemo } from 'react'

import { useIsMountedRef } from '../hooks/use-is-mounted-ref'

export interface StripeLoaderProps {
  children: React.ReactNode
}

export interface StripeLoaderState {
  Stripe: stripe.Stripe | null
}

export const StripeLoaderContext = React.createContext<StripeLoaderState>({
  Stripe: null,
})
StripeLoaderContext.displayName = 'StripeLoaderContext'

export function StripeLoaderProvider(props: StripeLoaderProps) {
  const isMountedRef = useIsMountedRef()

  const [Stripe, setStripe] = useState<StripeLoaderState['Stripe']>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('Stripe not loaded. No window or document global object.')
      return
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://js.stripe.com/v3/'

    script.onload = () => {
      if (!(isMountedRef.current && window.Stripe)) return
      setStripe(window.Stripe(process.env.STRIPE_PUBLIC_KEY!))
    }

    document.head.appendChild(script)
  }, [])

  const value = useMemo<StripeLoaderState>(() => ({ Stripe }), [Stripe])

  return (
    <StripeLoaderContext.Provider value={value}>
      {props.children}
    </StripeLoaderContext.Provider>
  )
}

export const StripeLoaderConsumer = StripeLoaderContext.Consumer

export function useStripeLoader() {
  return useContext(StripeLoaderContext)
}

declare global {
  interface Window {
    Stripe?: (apiKey: string) => stripe.Stripe
  }
}
