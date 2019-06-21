import immer from 'immer'

import { BannerMessage } from '@devhub/core'
import { REHYDRATE } from 'redux-persist'
import { Reducer } from '../types'

export interface State {
  banners: BannerMessage[]
}

const initialState: State = {
  banners: [],
}

export const appReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE as any: {
      const app =
        action.payload && ((action.payload as any).app as State | undefined)

      return {
        ...app,
        banners: ((app && app.banners) || []).map(banner => {
          if (!(banner && banner.id)) return banner

          const updatedBanner = initialState.banners.find(
            b => b.id === banner.id,
          )
          if (updatedBanner) {
            return {
              ...banner,
              href: updatedBanner.href,
              message: updatedBanner.message,
              minLoginCount: updatedBanner.minLoginCount,
              openOnNewTab: updatedBanner.openOnNewTab,
            }
          }

          return banner
        }),
      }
    }

    case 'CLOSE_BANNER_MESSAGE':
      return immer(state, draft => {
        draft.banners = draft.banners || []

        draft.banners.forEach(banner => {
          if (!(banner && banner.id === action.payload)) return

          banner.closedAt = new Date().toISOString()
        })
      })

    default:
      return state
  }
}
