export * from 'react-native'

declare module 'react-native' {
  export interface TouchableNativeFeedbackStatic
    extends TouchableMixin,
      React.ClassicComponentClass<TouchableNativeFeedbackProperties> {
    /**
     * Creates an object that represents android theme's default background for
     * selectable elements (?android:attr/selectableItemBackground).
     */
    SelectableBackground(): ThemeAttributeBackgroundPropType

    /**
     * Creates an object that represent android theme's default background for borderless
     * selectable elements (?android:attr/selectableItemBackgroundBorderless).
     * Available on android API level 21+.
     */
    SelectableBackgroundBorderless(): ThemeAttributeBackgroundPropType

    /**
     * Creates an object that represents ripple drawable with specified color (as a
     * string). If property `borderless` evaluates to true the ripple will
     * render outside of the view bounds (see native actionbar buttons as an
     * example of that behavior). This background type is available on Android
     * API level 21+.
     *
     * @param color The ripple color
     * @param borderless If the ripple can render outside it's bounds
     */
    Ripple(color: string, borderless?: boolean): RippleBackgroundPropType

    canUseNativeForeground(): boolean
  }
}
