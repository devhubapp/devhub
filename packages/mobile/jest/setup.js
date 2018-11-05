// TODO: How to mock properly? Any way to mock everything automagically?
jest.mock('react-native-gesture-handler', () => {
  return {
    Swipeable: () => 'View',
  }
})

jest.mock('react-native-safari-view', () => {
  return {
    show: jest.fn(),
  }
})
