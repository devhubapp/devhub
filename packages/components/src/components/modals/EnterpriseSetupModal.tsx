import _ from 'lodash'
import React, { useState } from 'react'
import { Clipboard, View } from 'react-native'

export interface EnterpriseSetupModalProps {
  showBackButton: boolean
}

import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { ModalColumn } from '../columns/ModalColumn'
import { Button } from '../common/Button'
import { H3 } from '../common/H3'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'
import { ThemedText } from '../themed/ThemedText'

export function EnterpriseSetupModal(props: EnterpriseSetupModalProps) {
  const { showBackButton } = props

  const [copied, setCopied] = useState(false)

  const userId = useReduxState(selectors.currentUserIdSelector)
  const username = useReduxState(selectors.currentGitHubUsernameSelector)

  const email = `enterprise${'@'}devhubapp.com`

  return (
    <ModalColumn
      iconName="plus"
      name="SETUP_GITHUB_ENTERPRISE"
      showBackButton={showBackButton}
      title="GitHub Enterprise"
    >
      <View style={[sharedStyles.flex, { padding: contentPadding }]}>
        <Spacer height={contentPadding} />

        <ThemedText color="foregroundColor" style={{ lineHeight: 16 }}>
          To enable DevHub on your GitHub Enterprise, contact us via e-mail
          below:{' '}
        </ThemedText>

        <Spacer height={contentPadding} />

        <View style={[sharedStyles.horizontal, sharedStyles.alignItemsCenter]}>
          <H3>E-mail: </H3>

          <Link
            analyticsLabel={`mailto:${email}`}
            href={`mailto:${email}`}
            openOnNewTab={false}
            textProps={{ color: 'foregroundColor' }}
          >
            {email}
          </Link>
        </View>

        <Spacer height={contentPadding} />

        <Button
          analyticsCategory="enterprise"
          analyticsAction="copy_email"
          analyticsLabel={username}
          analyticsPayload={{ user_id: userId }}
          onPress={async () => {
            Clipboard.setString(email)
            setCopied(true)
          }}
        >
          {copied ? 'Copied!' : 'Copy e-mail'}
        </Button>
      </View>
    </ModalColumn>
  )
}
