import axios, { AxiosResponse } from 'axios'

import { constants, Installation } from '..'

export interface FetchInstallationsOptions {
  appToken: string
  // includeInstallationRepositories: boolean
  includeInstallationToken: boolean
}

export async function refreshUserInstallations(
  options: FetchInstallationsOptions,
) {
  const {
    appToken,
    // includeInstallationRepositories,
    includeInstallationToken,
  } = options

  const response: AxiosResponse<{
    data: {
      refreshUserInstallations: Installation[] | null
    }
    errors?: any[]
  }> = await axios.post(
    constants.GRAPHQL_ENDPOINT,
    {
      query: `
        mutation {
          refreshUserInstallations {
            id
            account {
              id
              nodeId
              login
              avatarUrl
              htmlUrl
            }
            ${
              ''
              /*
              includeInstallationRepositories
                ? `
                  repositories {
                    id
                    nodeId
                    ownerName
                    repoName
                    private
                    permissions
                    htmlUrl
                  }
                  `
                : ''
                */
            }
            ${
              includeInstallationToken
                ? `
                  tokenDetails {
                    token
                    expiresAt
                  }
                `
                : ''
            }
          }
        }
      `,
    },
    {
      headers: {
        Authorization: `bearer ${appToken}`,
      },
    },
  )

  const { data, errors } = response.data

  if ((errors && errors.length) || !(data && data.refreshUserInstallations)) {
    throw Object.assign(new Error('GraphQL Error'), { response })
  }

  return data.refreshUserInstallations
}
