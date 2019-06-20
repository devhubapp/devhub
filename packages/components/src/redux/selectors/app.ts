import { RootState } from '../types'
import { loginCountSelector } from './counters'

const s = (state: RootState) => state.app || {}

export const allBannerMessagesSelector = (state: RootState) =>
  s(state).banners || []

export const bannerMessageSelector = (state: RootState) => {
  const banners = allBannerMessagesSelector(state)
  const loginCount = loginCountSelector(state)

  const filteredBanners = banners.filter(
    banner =>
      !!(
        banner &&
        banner.id &&
        banner.message &&
        (!banner.minLoginCount || loginCount >= banner.minLoginCount) &&
        !banner.closedAt
      ),
  )

  return filteredBanners[0]
}
