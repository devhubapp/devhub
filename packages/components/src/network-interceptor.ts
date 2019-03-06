import axios from 'axios'
import _ from 'lodash'
import { StatusBar } from 'react-native'

import { octokit } from './libs/github'
import { Platform } from './libs/platform'

let axiosRequestsCount = 0
let octokitRequestsCount = 0
let isNetworkActivityIndicatorVisible = false

const setNetworkActivityIndicatorVisible = Platform.select({
  default: () => undefined,
  ios: StatusBar.setNetworkActivityIndicatorVisible,
})

const debounceSetNetworkActivityIndicatorVisible = _.debounce(
  setNetworkActivityIndicatorVisible,
  500,
)

export function enableAxiosNetworkInterceptor() {
  axios.interceptors.request.use(
    config => {
      axiosRequestsCount = axiosRequestsCount + 1
      updateActivityLoadingIndicator()

      return config
    },
    error => {
      axiosRequestsCount = axiosRequestsCount - 1
      updateActivityLoadingIndicator()

      return Promise.reject(error)
    },
  )

  axios.interceptors.response.use(
    response => {
      axiosRequestsCount = axiosRequestsCount - 1
      updateActivityLoadingIndicator()

      return response
    },
    error => {
      axiosRequestsCount = axiosRequestsCount - 1
      updateActivityLoadingIndicator()

      return Promise.reject(error)
    },
  )
}

export function enableOctokitNetworkInterceptor() {
  octokit.hook.before('request', () => {
    octokitRequestsCount = octokitRequestsCount + 1
    updateActivityLoadingIndicator()
  })

  octokit.hook.after('request', () => {
    octokitRequestsCount = octokitRequestsCount - 1
    updateActivityLoadingIndicator()
  })

  octokit.hook.error('request', async error => {
    octokitRequestsCount = octokitRequestsCount - 1
    updateActivityLoadingIndicator()

    throw error
  })
}

export function enableNetworkInterceptors() {
  enableAxiosNetworkInterceptor()
  enableOctokitNetworkInterceptor()
}

function updateActivityLoadingIndicator() {
  const shouldBeVisible = axiosRequestsCount >= 1 || octokitRequestsCount >= 1
  if (isNetworkActivityIndicatorVisible === shouldBeVisible) return

  debounceSetNetworkActivityIndicatorVisible(shouldBeVisible)
  isNetworkActivityIndicatorVisible = shouldBeVisible
}
