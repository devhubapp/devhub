import { useEffect, useState } from 'react'

import {
  GitHubExtractParamsFromMethod,
  GitHubExtractResponseFromMethod,
  LoadState,
} from '@devhub/core'

export function useGitHubAPI<M extends (params?: any, callback?: any) => any>(
  method: M,
  params: GitHubExtractParamsFromMethod<M> | null,
) {
  const [state, setState] = useState({
    data: null as GitHubExtractResponseFromMethod<M>['data'] | null,
    error: null as string | null,
    loadingState: 'not_loaded' as LoadState,
  })

  useEffect(
    () => {
      if (params === null) {
        setState({ data: null, error: null, loadingState: 'not_loaded' })
        return
      }

      ;(async () => {
        setState(s => ({ ...s, loadingState: 'loading' }))

        try {
          const response = (await method(
            params,
          )) as GitHubExtractResponseFromMethod<M>

          const data = response && response.data

          setState(s => ({ ...s, data, loadingState: 'loaded' }))
        } catch (error) {
          setState(s => ({
            ...s,
            data: null,
            error: `${(error && error.message) || error || 'Error'}`,
            loadingState: 'error',
          }))
        }
      })()
    },
    [method, JSON.stringify(params)],
  )

  return state
}
