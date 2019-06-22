import immer from 'immer'
import _ from 'lodash'

import { BannerMessage, constants } from '@devhub/core'
import { REHYDRATE } from 'redux-persist'
import { Reducer } from '../types'

export interface State {
  banners: BannerMessage[]
}

const initialState: State = {
  banners: [
    {
      id: 'new_layout_mode',
      message:
        ':sparkles: New! You can now switch between "Multi-column" and "Single-column" layouts! Tap to try it out.',
      href: `${constants.APP_DEEP_LINK_URLS.redux_action}/TOGGLE_APP_VIEW_MODE`,
      openOnNewTab: true,
      disableOnSmallScreens: true,
      minLoginCount: undefined,
      closedAt: undefined,
      createdAt: '2019-06-21T00:00:00.000Z',
    },
  ],
}

export const appReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE as any: {
      const app =
        action.payload && ((action.payload as any).app as State | undefined)

      return {
        ...app,
        banners: _.uniqBy(
          ((app && app.banners) || [])
            .concat(initialState.banners)
            .map(banner => {
              if (!(banner && banner.id)) return banner
              if (banner.id === 'join_our_slack') return

              const updatedBanner = initialState.banners.find(
                b => b.id === banner.id,
              )
              if (updatedBanner) {
                return {
                  ...banner,
                  ..._.omit(updatedBanner, ['closedAt', 'createdAt']),
                }
              }

              return banner
            })
            .filter(Boolean) as State['banners'],
          'id',
        ),
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
