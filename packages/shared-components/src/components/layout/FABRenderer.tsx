import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { ViewStyle } from 'react-native'
import { ExtractPropsFromConnector } from 'shared-core/dist/types'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { FAB } from '../common/FAB'
import { LayoutConsumer } from '../context/LayoutContext'

const connectToStore = connect(
  (state: any) => ({
    currentOpenedModal: selectors.currentOpenedModal(state),
  }),
  {
    closeAllModals: actions.closeAllModals,
    replaceModal: actions.replaceModal,
  },
)

class FABRendererComponent extends PureComponent<
  ExtractPropsFromConnector<typeof connectToStore>
> {
  renderContent() {
    const { currentOpenedModal, closeAllModals, replaceModal } = this.props

    const fabStyle: ViewStyle = {
      position: 'absolute',
      bottom: contentPadding / 2,
      right: contentPadding,
      zIndex: 101,
    }

    if (!currentOpenedModal) {
      return (
        <FAB
          iconName="plus"
          onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
          style={fabStyle}
          useBrandColor
        />
      )
    }

    switch (currentOpenedModal.name) {
      case 'ADD_COLUMN':
      case 'ADD_COLUMN_DETAILS': {
        return (
          <FAB iconName="x" onPress={() => closeAllModals()} style={fabStyle} />
        )
      }

      default:
        return null
    }
  }

  render() {
    return (
      <LayoutConsumer>
        {({ sizename }) => {
          if (sizename !== '1-small') return null
          return this.renderContent()
        }}
      </LayoutConsumer>
    )
  }
}

export const FABRenderer = connectToStore(FABRendererComponent)

hoistNonReactStatics(FABRenderer, FABRendererComponent as any)
