import axios, { AxiosResponse } from 'axios'

import { constants, InstallationResponse } from '..'

export async function fetchInstallationToken(
  params: { owner: string; repo?: string },
  options: { appToken: string },
) {
  const { owner, repo } = params
  const { appToken: token } = options

  const response: AxiosResponse<{
    data: {
      getInstallationToken: InstallationResponse | null
    }
    errors?: any[]
  }> = await axios.post(
    constants.GRAPHQL_ENDPOINT,
    {
      variables: { owner, repo },
      query: `
        query($owner: String!, $repo: String) {
          getInstallationToken(input: { owner: $owner, repo: $repo }) {
            ownerId
            repoId
            installation {
              id
              account {
                id
                nodeId
                login
                avatarURL
                htmlURL
              }
            }
            installationToken
            installationTokenExpiresAt
            installationRepositories {
              id
              nodeId
              ownerName
              repoName
              private
              permissions
              htmlURL
            }
          }
        }
  `,
    },
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    },
  )

  const { data, errors } = response.data

  if (errors && errors.length) {
    throw Object.assign(new Error('GraphQL Error'), { response })
  }

  return data
}
