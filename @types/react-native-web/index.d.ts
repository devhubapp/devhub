declare module 'react-native-web' {
  export * from 'react-native'
}

namespace JSX {
  import * as ReactNative from 'react-native'
  interface IntrinsicAttributes extends React.Attributes {
    accessibilityRole?:
      | ReactNative.AccessibilityRole
      | 'article' // article
      | 'banner' // header
      | 'button' // button
      | 'complementary' // aside
      | 'contentinfo' // footer
      | 'form' // form
      | 'heading' // h1, h2, h3, ...
      | 'label' // label
      | 'link' // a
      | 'list' // ul
      | 'listitem' // li
      | 'main' // main
      | 'navigation' // nav
      | 'region' // section
    className?: string
    tabIndex?: number
  }
}
