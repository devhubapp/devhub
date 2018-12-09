import _ from 'lodash'
import React from 'react'
import { Animated, Linking, View } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { contentPadding } from '../../styles/variables'
import { ModalColumn } from '../columns/ModalColumn'
import { Button } from '../common/Button'
import { H2 } from '../common/H2'
import { H3 } from '../common/H3'
import { Spacer } from '../common/Spacer'

export function EnterpriseSetupModal() {
  const theme = useAnimatedTheme()

  return (
    <ModalColumn
      columnId="enterprise-setup-modal"
      iconName="plus"
      title="GitHub Enterprise"
    >
      <View style={{ flex: 1, padding: contentPadding }}>
        <H2>Are you interested?</H2>

        <Spacer height={contentPadding} />

        <Animated.Text style={{ color: theme.foregroundColor }}>
          If you are interested in GitHub Enterprise support, please let us
          know!{' '}
        </Animated.Text>

        <Spacer height={contentPadding} />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <H3>E-mail: </H3>
          <Animated.Text style={{ color: theme.foregroundColor }}>
            {`enterprise${'@'}devhubapp.com`}
          </Animated.Text>
        </View>

        <Spacer height={contentPadding} />

        <Button
          onPress={() =>
            Linking.openURL(`mailto:enterprise${'@'}devhubapp.com`)
          }
        >
          Contact us
        </Button>
      </View>
    </ModalColumn>
  )
}
