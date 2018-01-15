declare module 'react-native-navigation' {
  // import { Redux } from 'redux'

  export interface INavigatorStyle {
    navBarTextColor?: string
    navBarBackgroundColor?: string
    navBarButtonColor?: string
    navBarHidden?: boolean
    navBarHideOnScroll?: boolean
    navBarTranslucent?: boolean
    navBarNoBorder?: boolean
    drawUnderNavBar?: boolean
    drawUnderTabBar?: boolean
    statusBarBlur?: boolean
    navBarBlur?: boolean
    tabBarHidden?: boolean
    statusBarHideWithNavBar?: boolean
    statusBarHidden?: boolean
    statusBarTextColorScheme?: string
  }

  export interface INavigatorButtons {
    leftButtons?: INavigatorButton[]
    rightButtons?: INavigatorButton[]
  }

  export interface INavigatorButton {
    id: string
    icon?: any
    title?: string
    testID?: string
    disabled?: boolean
    component?: string
    passProps?: object
  }

  export interface IDrawer {
    left?: {
      screen: string
    }
    right?: {
      screen: string
    }
    disableOpenGesture?: boolean
  }

  export interface ITabBasedApp {
    tabs: ITabScreen[]
    appStyle?: INavigatorStyle & { keepStyleAcrossPush?: boolean }
    tabsStyle?: {
      tabBarButtonColor: string
      tabBarSelectedButtonColor: string
      tabBarBackgroundColor: string
      tabBarTranslucent?: boolean
    }
    drawer?: IDrawer
    passProps?: object
    animationType?: string
  }

  export interface ISingleScreenApp {
    screen: IScreen
    drawer?: IDrawer
    passProps?: object
    animationType?: string
  }

  export interface ITabScreen {
    label?: string
    screen: string
    icon?: any
    selectedIcon?: any
    title?: string
    navigatorStyle?: INavigatorStyle
    navigatorButtons?: INavigatorButtons
  }

  export interface IScreen {
    screen: string
    title?: string
    navigatorStyle?: INavigatorStyle
    navigatorButtons?: INavigatorButtons
  }

  export interface IModalScreen extends IScreen {
    passProps?: object
    animationType?: string
    hideStatusBarAndroid?: boolean
    orientation?: 'landscape' | 'portrait'
  }

  export interface IPushedScreen extends IModalScreen {
    backButtonTitle?: string
    backButtonHidden?: boolean
  }

  export interface ILightBox {
    screen: string
    passProps?: object
    style?: {
      backgroundBlur: string
      backgroundColor?: string
    }
  }

  export class Navigation {
    static registerComponent(
      screenID: string,
      generator: () => any,
      store?: any, // Redux.Store,
      provider?: any,
    ): any

    static registerScreen(screenId: string, generator: () => any): any

    static startTabBasedApp(params: ITabBasedApp): any

    static startSingleScreenApp(params: ISingleScreenApp): any

    static showModal(params: IModalScreen): any

    static dismissModal(params?: { animationType?: string }): any

    static dismissMeasurementFlow(params?: { animationType?: string }): any

    static dismissAllModals(params?: { animationType?: string }): any

    static showLightBox(params: ILightBox): any

    static dismissLightBox(): any

    static lockToPortrait(): any

    static lockToLandscape(): any

    static lockToSensorLandscape(): any

    static unlockAllOrientations(): any

    static showMaterialDialog(options: any): any
  }

  export interface INavigator {
    push: (options: IPushedScreen) => any
    pop: (options?: { animated?: boolean }) => any
    popToRoot: (options?: { animated?: boolean }) => any
    resetTo: (options: IModalScreen) => any
    showModal: (options: IModalScreen) => any
    dismissModal: (options?: { animationType?: string }) => any
    dismissMeasurementFlow: () => any
    dismissAllModals: (options?: { animationType?: string }) => any
    showLightBox: (options: ILightBox) => any
    dismissLightBox: () => any
    handleDeepLink: (options: { link: string }) => any
    setOnNavigatorEvent: (callback: (event: any) => any) => any
    setButtons: (options: INavigatorButtons & { animated?: boolean }) => any
    setTitle: (options: { title: string }) => any
    toggleDrawer: (
      options: { side: string; animated?: boolean; to?: string },
    ) => any
    toggleTabs: (options: { to: string; animated?: boolean }) => any
    setTabBadge: (options: { tabIndex?: number; badge: number }) => any
    switchToTab: (options: { tabIndex: number }) => any
    toggleNavBar: (options: { to: string; animated?: boolean }) => any
  }
}
