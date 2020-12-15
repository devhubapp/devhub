import qs from 'qs'

import { constants } from '@devhub/core'

import * as selectors from '../selectors'
import { allowChangePlansOnThisApp } from '../../components/modals/PricingModal'
import { Browser } from '../../libs/browser'
import { Middleware } from '../types'

export const devhubMiddleware: Middleware = (store) => {
  return (next) => (action) => {
    switch (action?.type) {
      case 'PUSH_MODAL': {
        switch (action.payload.name) {
          case 'PRICING': {
            if (!allowChangePlansOnThisApp) {
              const state = store.getState()
              const appToken = selectors.appTokenSelector(state)
              Browser.openURLOnNewTab(
                `${constants.DEVHUB_LINKS.PRICING_PAGE}?${qs.stringify({
                  appToken,
                  plan: action.payload.params?.initialSelectedPlanId,
                  feature: action.payload.params?.highlightFeature,
                })}`,
              )
              return
            }
          }

          default: {
            break
          }
        }
      }

      default: {
        next(action)
        break
      }
    }
  }
}
