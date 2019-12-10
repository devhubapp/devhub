import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { useForceRerender } from '../hooks/use-force-rerender'
import { useIsMountedRef } from '../hooks/use-is-mounted-ref'

export interface PaddleLoaderProps {
  children: React.ReactNode
}

export interface PaddlePrice {
  gross: string
  net: string
  tax: string
  tax_included: false
}

export interface PaddleSubscription {
  length: number
  trial_days: number
  type: 'day' | 'week' | 'month' | 'year'
}

export type PaddlePriceResult =
  | {
      country: string
      price: PaddlePrice
      quantity: number
      recurring?: {
        price: PaddlePrice
        subscription: PaddleSubscription
      }
    }
  | {
      success: false
      error: { code: number; message: string }
    }

export interface PaddleLoaderState {
  Paddle: Record<string, any> | null
  cachedPricesByProductIdAndQuantity: Record<
    number,
    Record<number, PaddlePrice | undefined>
  >
  getProductPrice(productId: number, quantity?: number): PaddlePrice | undefined
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

        cachedPricesByProductIdAndQuantityRef.current[productId] =
          cachedPricesByProductIdAndQuantityRef.current[productId] || {}

        if (!Paddle) return undefined

        if (
          cachedPricesByProductIdAndQuantityRef.current[productId] &&
          !(
            quantity in cachedPricesByProductIdAndQuantityRef.current[productId]
          )
        ) {
          cachedPricesByProductIdAndQuantityRef.current[productId][
            quantity
          ] = undefined

          Paddle.Product.Prices(
            productId,
            quantity,
            (result: PaddlePriceResult) => {
              const price =
                result &&
                (('recurring' in result &&
                  result.recurring &&
                  result.recurring.price) ||
                  ('price' in result && result.price))
              if (!price) return

              cachedPricesByProductIdAndQuantityRef.current = {
                ...cachedPricesByProductIdAndQuantityRef.current,
                [productId]: {
                  ...(cachedPricesByProductIdAndQuantityRef.current || {})[
                    productId
                  ],
                  [quantity]: {
                    ...price,
                    gross: getPriceLabelTweaked(price.gross),
                    net: getPriceLabelTweaked(price.net),
                    tax: getPriceLabelTweaked(price.tax),
                    tax_included: price.tax_included,
                  },
                },
              }

              forceRerender()
            },
          )
        }

        if (
          quantity > 1 &&
          (cachedPricesByProductIdAndQuantityRef.current[productId][1] &&
            cachedPricesByProductIdAndQuantityRef.current[productId][1]!.net)
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

const _floatFormatter = new Intl.NumberFormat(undefined, {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
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

    const newAmountFormatted = getPriceLabelTweaked(
      _floatFormatter.format(newAmount),
    )

    return `${currency}${newAmountFormatted}`
  } catch (error) {
    console.error(error)
    return priceLabelForQuantity1
  }
}

function getPriceLabelTweaked(priceLabel: string) {
  if (!priceLabel) return priceLabel
  return (priceLabel.endsWith('.00')
    ? priceLabel.slice(0, -3)
    : priceLabel
  ).replace('US$', '$')
}
