import React from 'react'
import { Linking, Platform } from 'react-native'

export interface User {
  accessToken: string
  username: string
  usernameToSee: string
}

export interface UserProviderProps {
  children?: React.ReactNode
}

export interface UserProviderState {
  user?: User
}

const UserContext = React.createContext<UserProviderState>({})

export class UserProvider extends React.PureComponent<
  UserProviderProps,
  UserProviderState
> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  async getParameterFromURL(parameter: string) {
    const initialURL = await Linking.getInitialURL()
    if (!initialURL && parameter === 'username') return 'brunolemos'
    if (!initialURL && parameter === 'access_token')
      return '6ffd13a5c28199fe1737b999a62ab15fd469c62b'
    if (!initialURL) return ''

    const url = new URL(initialURL)
    return url.searchParams.get(parameter)
  }

  async getGitHubUserDataForToken(accessToken: string) {
    const response = await fetch(
      `https://api.github.com/user?access_token=${accessToken}&timestamp=${Date.now()}`,
    )

    return await response.json()
  }

  updateUser = async () => {
    const accessToken = await this.getParameterFromURL('access_token')

    if (!accessToken) {
      alert(
        'Please set the access_token parameter URL. You can also optionally set an username parameter.',
      )
      return
    }

    const userData = await this.getGitHubUserDataForToken(accessToken!)

    if (!(userData && userData.login)) {
      alert('Failed to load user. Please confirm the provided token is valid.')
      return
    }

    const username = userData.login
    const usernameToSee =
      (await this.getParameterFromURL('username')) || username

    const user: User = {
      accessToken,
      username,
      usernameToSee,
    }

    this.setState({ user })
  }

  componentDidMount() {
    this.updateUser()
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export const UserConsumer = UserContext.Consumer
