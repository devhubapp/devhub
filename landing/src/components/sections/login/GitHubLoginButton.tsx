import { GitHubAppType } from '@brunolemos/devhub-core'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { useEffect } from 'react'

import { useAuth } from '../../../context/AuthContext'
import { useDynamicRef } from '../../../hooks/use-dynamic-ref'
import { useOAuth } from '../../../hooks/use-oauth'
import Button from '../../common/buttons/Button'

export interface GitHubLoginButtonProps {
  method?: GitHubAppType | 'both'
}

export default function GitHubLoginButton(props: GitHubLoginButtonProps) {
  const { method = 'oauth' } = props

  const Router = useRouter()
  const { isExecutingOAuth, startOAuth } = useOAuth()
  const { authData, isLoggingIn } = useAuth()

  const isAlreadyLoggedRef = useDynamicRef(!!(authData && authData.appToken))
  const autologin = 'autologin' in Router.query
  useEffect(() => {
    if (!autologin) return

    Router.replace(
      `${Router.pathname}${qs.stringify(
        { ...Router.query, autologin: undefined },
        { addQueryPrefix: true },
      )}`,
    )

    if (isAlreadyLoggedRef.current) return
    startOAuth('oauth')
  }, [autologin])

  function login() {
    startOAuth(method)
  }

  return (
    <Button
      type="primary"
      onClick={login}
      loading={isExecutingOAuth || isLoggingIn}
    >
      Login with GitHub
    </Button>
  )
}
