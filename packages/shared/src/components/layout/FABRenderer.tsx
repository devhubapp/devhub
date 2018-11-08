import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { ViewStyle } from 'react-native'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { ExtractPropsFromConnector } from '../../types'
import { FAB } from '../common/FAB'
import { DimensionsConsumer } from '../context/DimensionsContext'

const connectToStore = connect(
  (state: any) => ({
    currentOpenedModal: selectors.currentOpenedModal(state),
  }),
  {
    popModal: actions.popModal,
    replaceModal: actions.replaceModal,
  },
)

class FABRendererComponent extends PureComponent<
  ExtractPropsFromConnector<typeof connectToStore>
> {
  renderContent({ small }: { small?: boolean } = {}) {
    if (!small) return null

    const { currentOpenedModal, popModal, replaceModal } = this.props

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
      case 'ADD_COLUMN': {
        return <FAB iconName="x" onPress={() => popModal()} style={fabStyle} />
      }

      default:
        return null
    }
  }

  render() {
    return (
      <DimensionsConsumer>
        {({ width }) => {
          const small = width <= 420
          return this.renderContent({ small })
        }}
      </DimensionsConsumer>
    )
  }
}

export const FABRenderer = connectToStore(FABRendererComponent)

hoistNonReactStatics(FABRenderer, FABRendererComponent as any)
