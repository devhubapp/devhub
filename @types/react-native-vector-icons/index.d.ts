declare module 'react-native-vector-icons' {
  export * from 'react-native-vector-icons'
}

declare module 'react-native-vector-icons/dist/MaterialIcons' {}

declare module 'react-native-vector-icons/dist/Octicons' {}

declare module 'react-native-vector-icons/Fonts/MaterialIcons.ttf' {}

declare module 'react-native-vector-icons/Fonts/Octicons.ttf' {}

declare module 'react-native-vector-icons/lib/create-icon-set' {
  declare function createIconSet<Glyphs extends Record<string, number>>(
    glyphs: Glyphs,
    fontFamily: string,
    fontFile: string,
  ): {
    [key: string]: any
    hasIcon(name: keyof Glyphs): boolean
  }

  export default createIconSet
}
