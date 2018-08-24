import React from 'react'

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

  getParameterFromURL(parameter: string) {
    const url = new URL(window.location.href)
    return url.searchParams.get(parameter)
  }

  async getGitHubUserDataForToken(accessToken: string) {
    const response = await fetch(
      `https://api.github.com/user?access_token=${accessToken}&timestamp=${Date.now()}`,
    )

    return await response.json()
  }

  updateUser = async () => {
    const accessToken = this.getParameterFromURL('access_token')

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
    const usernameToSee = this.getParameterFromURL('username') || username

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
