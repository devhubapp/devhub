import {
  formatInterval,
  formatPrice,
  formatPriceAndInterval,
} from '@brunolemos/devhub-core'

import { usePaddleLoader } from '../context/PaddleLoaderContext'

export function useFormattedPlanPrice(
  priceInCents: number | undefined,
  plan: Parameters<typeof formatPriceAndInterval>[1] | undefined,
  options: Parameters<typeof formatPriceAndInterval>[2] & {
    includeInterval?: boolean
  } = {},
) {
  const { getProductPrice } = usePaddleLoader()

  if (!(typeof priceInCents === 'number' && plan)) return ''

  if (plan.paddleId) {
    const paddlePrice = getProductPrice(plan.paddleId, options.quantity)

    if (paddlePrice && paddlePrice.price && paddlePrice.price.gross) {
      return options.includeInterval
        ? `${paddlePrice.price.gross}${formatInterval(plan, options)}`
        : paddlePrice.price.gross
    }
  }

  return options.includeInterval
    ? formatPriceAndInterval(priceInCents, plan, options)
    : formatPrice(priceInCents, plan, options)
}
