import React from 'react'
import { AsyncStorage } from 'react-native'

import * as github from '../../libs/github'
import { GitHubUser } from '../../types'

export interface UserProviderProps {
  children?: React.ReactNode
}

export interface UserProviderState {
  accessToken: string | null
  hasLoadedFromCache: boolean
  refetchUser: () => Promise<GitHubUser | null>
  setAccessToken: (accessToken: string | null) => Promise<void>
  user?: GitHubUser | null
}

const defaultState = {
  accessToken: null,
  hasLoadedFromCache: false,
  refetchUser: async () => {
    throw new Error('Not implemented')
  },
  setAccessToken: async () => {
    throw new Error('Not implemented')
  },
}

const UserContext = React.createContext<UserProviderState>(defaultState)

export class UserProvider extends React.PureComponent<
  UserProviderProps,
  UserProviderState
> {
  constructor(props: any) {
    super(props)
    this.state = {
      ...defaultState,
      refetchUser: this.refetchUser,
      setAccessToken: this.setAccessToken,
    }

    this.updateFromCache()
  }

  updateFromCache = async () => {
    const accessToken = await this.getAccessToken()
    const user = await this.getUser()

    github.authenticate(accessToken || '')

    await new Promise(resolve =>
      this.setState({ accessToken, hasLoadedFromCache: true, user }, resolve),
    )
  }

  async getGitHubUser() {
    const response = await github.octokit.users.get({})
    return response.data as GitHubUser
  }

  getUser = async () => {
    if (this.state.user) return this.state.user

    try {
      const user = await AsyncStorage.getItem('user')
      return user ? JSON.parse(user) : null
    } catch (e) {
      return null
    }
  }

  setAccessToken = async (accessToken: string | null) => {
    await AsyncStorage.setItem('access_token', accessToken || '')
    github.authenticate(accessToken || '')
    await new Promise(resolve =>
      this.setState(
        state => ({
          accessToken,
          user: accessToken === state.accessToken ? state.user : null,
        }),
        resolve,
      ),
    )
  }

  refetchUser = async () => {
    const accessToken = await this.getAccessToken()

    if (!accessToken) {
      throw new Error('Not authenticated.')
    }

    let userData

    try {
      userData = await this.getGitHubUser()
      if (!(userData && userData.login)) throw new Error('Invalid response.')
    } catch (e) {
      if (e.code === 401) {
        this.setAccessToken(null)
        return null
      }

      alert('Failed to load user. Please try logging in again.')
      return null
    }

    const user: GitHubUser = {
      id: userData.id,
      avatar_url: userData.avatar_url,
      display_login: userData.display_login,
      gravatar_id: userData.gravatar_id,
      login: userData.login,
      name: userData.name,
      url: userData.url,
      html_url: userData.html_url,
    }

    await this.setUser(user)

    return user
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    )
  }

  private getAccessToken = async () => {
    if (this.state.accessToken) return this.state.accessToken

    return (await AsyncStorage.getItem('access_token')) || null
  }

  private setUser = async (user: GitHubUser) => {
    await AsyncStorage.setItem('user', JSON.stringify(user))
    await new Promise(resolve => this.setState({ user }, resolve))
  }
}

export const UserConsumer = UserContext.Consumer
