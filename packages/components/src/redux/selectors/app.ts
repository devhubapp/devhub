import { getLayoutConsumerState } from '../../components/context/LayoutContext'
import { RootState } from '../types'
import { countersSelector } from './counters'

const s = (state: RootState) => state.app || {}

export const allBannerMessagesSelector = (state: RootState) =>
  s(state).banners || []

export const bannerMessageSelector = (state: RootState) => {
  const banners = allBannerMessagesSelector(state)
  const loginCount = countersSelector(state).loginSuccess

  const { sizename } = getLayoutConsumerState()

  const filteredBanners = banners.filter(
    banner =>
      !!(
        banner &&
        banner.id &&
        banner.message &&
        (!banner.minLoginCount || loginCount >= banner.minLoginCount) &&
        (!banner.disableOnSmallScreens || sizename !== '1-small') &&
        !banner.closedAt
      ),
  )

  return filteredBanners[0]
}
