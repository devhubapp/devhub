import { FlatListProps } from 'react-native'

export type FlatListItemLayout = ReturnType<
  NonNullable<FlatListProps<any>['getItemLayout']>
>
