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

  if (plan.paddleProductId) {
    const paddlePrice = getProductPrice(plan.paddleProductId, options.quantity)

    if (paddlePrice && paddlePrice.gross) {
      return options.includeInterval
        ? `${paddlePrice.gross}${formatInterval(plan, options)}`
        : paddlePrice.gross
    }
  }

  return options.includeInterval
    ? formatPriceAndInterval(priceInCents, plan, options)
    : formatPrice(priceInCents, plan, options)
}
