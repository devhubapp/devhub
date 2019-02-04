import axios from 'axios'
import _ from 'lodash'
import { StatusBar } from 'react-native'

let axiosRequestsCount = 0
let isNetworkActivityIndicatorVisible = false

const debounceSetNetworkActivityIndicatorVisible = _.debounce(
  StatusBar.setNetworkActivityIndicatorVisible,
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

function updateActivityLoadingIndicator() {
  const shouldBeVisible = axiosRequestsCount >= 1
  if (isNetworkActivityIndicatorVisible === shouldBeVisible) return

  debounceSetNetworkActivityIndicatorVisible(shouldBeVisible)
  isNetworkActivityIndicatorVisible = shouldBeVisible
}
