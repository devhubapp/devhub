import React from 'react'

import { GitHubAppType } from '@devhub/core/dist'
import { useAuth } from '../../../context/AuthContext'
import { useOAuth } from '../../../hooks/use-oauth'
import Button from '../../common/buttons/Button'

export interface GitHubLoginButtonProps {
  method?: GitHubAppType | 'both'
}

export default function GitHubLoginButton(props: GitHubLoginButtonProps) {
  const { method = 'both' } = props

  const { isExecutingOAuth, startOAuth } = useOAuth()
  const { isLoggingIn } = useAuth()

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
