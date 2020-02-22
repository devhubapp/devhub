import { Plan } from '@devhub/core'

import { usePaddleLoader } from '../context/PaddleLoaderContext'

export function useLocalizedPlanDetails<P extends Plan | undefined>(
  plan: P | undefined,
  { quantity = 1 }: { quantity?: number } = {},
): P | undefined {
  const { getProductPrice } = usePaddleLoader()

  if (plan && plan.paddleProductId) {
    const paddlePrice = getProductPrice(plan.paddleProductId, quantity)

    if (paddlePrice && paddlePrice.net) {
      return {
        ...plan,
        amount: Math.floor(
          parseFloat(paddlePrice.net.replace(/[^0-9]+/, '')) * 100,
        ),
        currency: paddlePrice.net.match(/[^0-9]+/)![0],
        // interval: undefined, // TODO
        // intervalCount: 1, // TODO,
        type: plan.type,
      }
    }
  }

  return plan
}
