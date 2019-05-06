import { RootState } from '../types'

const s = (state: RootState) => state.app || {}

export const allBannerMessagesSelector = (state: RootState) =>
  s(state).banners || []

export const bannerMessageSelector = (state: RootState) =>
  allBannerMessagesSelector(state).filter(
    banner => !!(banner && banner.id && banner.message && !banner.closedAt),
  )[0]
