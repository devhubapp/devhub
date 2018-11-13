import { EventSubscription } from 'fbemitter'
import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'
import { connect } from 'react-redux'

import { Screen } from '../components/common/Screen'
import { Separator } from '../components/common/Separator'
import { DimensionsConsumer } from '../components/context/DimensionsContext'
import { ThemeConsumer } from '../components/context/ThemeContext'
import { FABRenderer } from '../components/layout/FABRenderer'
import { Sidebar } from '../components/layout/Sidebar'
import { ModalRenderer } from '../components/modals/ModalRenderer'
import { ColumnsContainer } from '../containers/ColumnsContainer'
import { Platform } from '../libs/platform'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { emitter } from '../setup'
import { Column, ExtractPropsFromConnector } from '../types'

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
    columnIds: selectors.columnIdsSelector(state),
  }),
  {
    closeAllModals: actions.closeAllModals,
    popModal: actions.popModal,
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

    if (Platform.realOS === 'web') {
      window.addEventListener('keydown', this.handleKeyDown)
      window.addEventListener('keypress', this.handleKeyPress)
    }
  }

  componentWillUnmount() {
    if (this.focusOnColumnListener) this.focusOnColumnListener.remove()

    if (Platform.realOS === 'web') {
      window.removeEventListener('keydown', this.handleKeyDown)
      window.removeEventListener('keypress', this.handleKeyPress)
    }
  }

  handleColumnFocusRequest = () => {
    if (
      this.props.currentOpenedModal &&
      Dimensions.get('window').width <= 420
    ) {
      this.props.closeAllModals()
    }
  }

  handleKeyDown = (e: any) => {
    const targetTagName = e.target && `${e.target.tagName || ''}`.toLowerCase()

    if (e.key === 'Escape') {
      // never happens apparently
      if (targetTagName === 'input') e.target.blur()
      else if (this.props.currentOpenedModal) this.props.popModal()
      return
    }
  }

  handleKeyPress = (e: any) => {
    const targetTagName = e.target && `${e.target.tagName || ''}`.toLowerCase()
    if (targetTagName === 'input') return

    if (e.key === 'a' || e.key === 'n') {
      this.props.replaceModal({ name: 'ADD_COLUMN' })
      return
    }

    if (this.props.columnIds.length > 0) {
      if (e.keyCode - 48 === 0) {
        const columnIndex = this.props.columnIds.length - 1
        emitter.emit('FOCUS_ON_COLUMN', {
          animated: true,
          columnId: this.props.columnIds[columnIndex],
          columnIndex,
          highlight: true,
        })
        return
      }

      if (
        e.keyCode - 48 >= 1 &&
        e.keyCode - 48 <= this.props.columnIds.length
      ) {
        const columnIndex = e.keyCode - 48 - 1
        emitter.emit('FOCUS_ON_COLUMN', {
          animated: true,
          columnId: this.props.columnIds[columnIndex],
          columnIndex,
          highlight: true,
        })
        return
      }
    }
  }

  render() {
    const { currentOpenedModal } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <DimensionsConsumer>
            {({ width }) => {
              const small = width <= 420

              return (
                <Screen
                  statusBarBackgroundColor={theme.backgroundColorLess08}
                  useSafeArea={false}
                >
                  <View
                    style={[
                      styles.container,
                      { flexDirection: small ? 'column-reverse' : 'row' },
                    ]}
                  >
                    <Sidebar
                      key="main-screen-sidebar"
                      horizontal={small}
                      small={small}
                    />
                    <Separator horizontal={small} thick={!small} />

                    <View style={styles.innerContainer}>
                      <ModalRenderer />
                      {!!currentOpenedModal && !small && <Separator thick />}

                      <ColumnsContainer />
                      <FABRenderer />
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
