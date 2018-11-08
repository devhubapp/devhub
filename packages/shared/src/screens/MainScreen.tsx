import { EventSubscription } from 'fbemitter'
import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'
import { connect } from 'react-redux'

import { FAB } from '../components/common/FAB'
import { Screen } from '../components/common/Screen'
import { DimensionsConsumer } from '../components/context/DimensionsContext'
import { ThemeConsumer } from '../components/context/ThemeContext'
import { Sidebar, sidebarSize } from '../components/layout/Sidebar'
import { ModalRenderer } from '../components/modals/ModalRenderer'
import { ColumnsContainer } from '../containers/ColumnsContainer'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { emitter } from '../setup'
import { contentPadding } from '../styles/variables'
import { ExtractPropsFromConnector } from '../types'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
})

const connectToStore = connect(
  (state: any) => ({
    currentOpenedModal: selectors.currentOpenedModal(state),
  }),
  {
    closeAllModals: actions.closeAllModals,
    replaceModal: actions.replaceModal,
  },
)

class MainScreenComponent extends PureComponent<
  NavigationScreenProps & ExtractPropsFromConnector<typeof connectToStore>
> {
  static navigationOptions: NavigationStackScreenOptions = {
    header: null,
  }

  focusOnColumnListener?: EventSubscription

  componentDidMount() {
    this.focusOnColumnListener = emitter.addListener(
      'FOCUS_ON_COLUMN',
      this.handleColumnFocusRequest,
    )
  }

  componentWillUnmount() {
    if (this.focusOnColumnListener) this.focusOnColumnListener.remove()
  }

  handleColumnFocusRequest = () => {
    if (
      this.props.currentOpenedModal &&
      Dimensions.get('window').width <= 420
    ) {
      this.props.closeAllModals()
    }
  }

  render() {
    const { currentOpenedModal, replaceModal } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <DimensionsConsumer>
            {({ width }) => {
              const small = width <= 420

              return (
                <Screen statusBarBackgroundColor={theme.backgroundColorLess08}>
                  <View
                    style={[
                      styles.container,
                      { flexDirection: small ? 'column-reverse' : 'row' },
                    ]}
                  >
                    {!!small &&
                      !currentOpenedModal && (
                        <FAB
                          iconName="plus"
                          onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
                          style={{
                            position: 'absolute',
                            bottom: sidebarSize + contentPadding / 2,
                            right: contentPadding,
                          }}
                        />
                      )}

                    <Sidebar
                      key="main-screen-sidebar"
                      horizontal={small}
                      small={small}
                    />

                    <View style={styles.innerContainer}>
                      <ModalRenderer />
                      <ColumnsContainer />
                    </View>
                  </View>
                </Screen>
              )
            }}
          </DimensionsConsumer>
        )}
      </ThemeConsumer>
    )
  }
}

export const MainScreen = connectToStore(MainScreenComponent)

hoistNonReactStatics(MainScreen, MainScreenComponent as any)
