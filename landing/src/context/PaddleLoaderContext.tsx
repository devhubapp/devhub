import immer from 'immer'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { useForceRerender } from '../hooks/use-force-rerender'
import { useIsMountedRef } from '../hooks/use-is-mounted-ref'

export interface PaddleLoaderProps {
  children: React.ReactNode
}

export interface PaddleProductPrice {
  gross: string
  net: string
  tax: string
  tax_included: false
}

export type PaddleProductPriceResult =
  | {
      country: string
      price: PaddleProductPrice
      quantity: number
    }
  | {
      success: false
      error: { code: number; message: string }
    }

export interface PaddleLoaderState {
  Paddle: Record<string, any> | null
  cachedPricesByProductIdAndQuantity: Record<
    number,
    Record<number, PaddleProductPrice | undefined>
  >
  getProductPrice(
    productId: number,
    quantity?: number,
  ): PaddleProductPrice | undefined
}

export const PaddleLoaderContext = React.createContext<PaddleLoaderState>({
  Paddle: null,
  cachedPricesByProductIdAndQuantity: {},
  getProductPrice() {
    throw new Error('[PaddleLoaderContext][getProductPrice] Not initialized.')
  },
})
PaddleLoaderContext.displayName = 'PaddleLoaderContext'

export function PaddleLoaderProvider(props: PaddleLoaderProps) {
  const isMountedRef = useIsMountedRef()

  const [Paddle, setPaddle] = useState<PaddleLoaderState['Paddle']>(null)
  const forceRerender = useForceRerender()

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // tslint:disable-next-line no-console
      console.warn('Paddle not loaded. No window or document global object.')
      return
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://cdn.paddle.com/paddle/paddle.js'

    script.onload = () => {
      if (!(isMountedRef.current && window.Paddle)) return
      window.Paddle.Setup({ vendor: process.env.PADDLE_VENDOR_ID })
      setPaddle(window.Paddle)
    }

    document.head.appendChild(script)
  }, [])

  const cachedPricesByProductIdAndQuantityRef = useRef<
    PaddleLoaderState['cachedPricesByProductIdAndQuantity']
  >({})

  const value = useMemo<PaddleLoaderState>(() => {
    return {
      Paddle,
      cachedPricesByProductIdAndQuantity:
        cachedPricesByProductIdAndQuantityRef.current,
      getProductPrice(productId, quantity = 1) {
        if (
          cachedPricesByProductIdAndQuantityRef.current[productId] &&
          cachedPricesByProductIdAndQuantityRef.current[productId][quantity]
        )
          return cachedPricesByProductIdAndQuantityRef.current[productId][
            quantity
          ]

        if (
          cachedPricesByProductIdAndQuantityRef.current[productId] &&
          quantity in cachedPricesByProductIdAndQuantityRef.current[productId]
        )
          return undefined

        cachedPricesByProductIdAndQuantityRef.current[productId] =
          cachedPricesByProductIdAndQuantityRef.current[productId] || {}

        if (!Paddle) return undefined

        cachedPricesByProductIdAndQuantityRef.current[productId][
          quantity
        ] = undefined

        Paddle.Product.Prices(
          productId,
          quantity,
          (result: PaddleProductPriceResult) => {
            if (!('price' in result && result.price)) return

            cachedPricesByProductIdAndQuantityRef.current = immer(
              cachedPricesByProductIdAndQuantityRef.current,
              draft => {
                draft[productId] = draft[productId] || {}
                draft[productId][quantity] = result.price
              },
            )

            forceRerender()
          },
        )

        if (
          quantity > 1 &&
          cachedPricesByProductIdAndQuantityRef.current[productId][1] &&
          cachedPricesByProductIdAndQuantityRef.current[productId][1]
        ) {
          return {
            gross: estimatePriceForQuantity(
              cachedPricesByProductIdAndQuantityRef.current[productId][1]!
                .gross,
              quantity,
            ),
            net: estimatePriceForQuantity(
              cachedPricesByProductIdAndQuantityRef.current[productId][1]!.net,
              quantity,
            ),
            tax: estimatePriceForQuantity(
              cachedPricesByProductIdAndQuantityRef.current[productId][1]!.tax,
              quantity,
            ),
            tax_included: cachedPricesByProductIdAndQuantityRef.current[
              productId
            ][1]!.tax_included,
          }
        }

        return cachedPricesByProductIdAndQuantityRef.current[productId][
          quantity
        ]
      },
    }
  }, [Paddle, cachedPricesByProductIdAndQuantityRef.current])

  return (
    <PaddleLoaderContext.Provider value={value}>
      {props.children}
    </PaddleLoaderContext.Provider>
  )
}

export const PaddleLoaderConsumer = PaddleLoaderContext.Consumer
;(PaddleLoaderConsumer as any).displayName = 'PaddleLoaderConsumer'

export function usePaddleLoader() {
  return useContext(PaddleLoaderContext)
}

declare global {
  interface Window {
    Paddle?: Record<string, any>
  }
}

function estimatePriceForQuantity(
  priceLabelForQuantity1: string,
  quantity = 1,
) {
  if (!(quantity && quantity > 1)) return priceLabelForQuantity1

  try {
    const currency = priceLabelForQuantity1.match(/[^0-9]+/)![0]
    const amount = priceLabelForQuantity1.replace(/[^0-9]+/, '')

    const newAmount = parseFloat(amount) * quantity
    if (isNaN(newAmount)) throw new Error('Failed to parse amount')

    return `${currency}${newAmount.toFixed(2)}`
  } catch (error) {
    console.error(error)
    return priceLabelForQuantity1
  }
}
