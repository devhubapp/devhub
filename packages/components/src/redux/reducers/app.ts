import immer from 'immer'

import { BannerMessage, constants } from '@devhub/core'
import { Reducer } from '../types'

export interface State {
  banners: BannerMessage[]
}

const initialState: State = {
  banners: [
    {
      id: 'join_our_slack',
      message:
        'Join our brand new Slack Community and get exclusive access to new features in beta :rocket:',
      href: constants.SLACK_INVITE_LINK,
      openOnNewTab: true,
      closedAt: undefined,
      createdAt: '2019-05-02T08:00:00.000Z',
    },
  ],
}

export const appReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
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
