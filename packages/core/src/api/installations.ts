import axios, { AxiosResponse } from 'axios'

import { constants, InstallationsConnection } from '..'

export interface FetchInstallationsOptions {
  appToken: string
  includeInstallationRepositories: boolean
  includeInstallationToken: boolean
}

export async function fetchInstallations(options: FetchInstallationsOptions) {
  const {
    appToken,
    includeInstallationRepositories,
    includeInstallationToken,
  } = options

  const response: AxiosResponse<{
    data: {
      getInstallationsConnection: InstallationsConnection | null
    }
    errors?: any[]
  }> = await axios.post(
    constants.GRAPHQL_ENDPOINT,
    {
      query: `
        query {
          getInstallationsConnection {
            totalCount
            nodes {
              id
              account {
                id
                nodeId
                login
                avatarURL
                htmlURL
              }
              ${
                includeInstallationRepositories
                  ? `
                    repositoriesConnection {
                      totalCount
                      nodes {
                        id
                        nodeId
                        ownerName
                        repoName
                        private
                        permissions
                        htmlURL
                      }
                    }
                    `
                  : ''
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

  if ((errors && errors.length) || !(data && data.getInstallationsConnection)) {
    throw Object.assign(new Error('GraphQL Error'), { response })
  }

  return data.getInstallationsConnection
}
