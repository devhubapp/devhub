// @flow

import React from 'react'
import styled from 'styled-components/native'

import Column from './_Column'

const Wrapper = styled.ScrollView`
  flex: 1;
`

const EmptyColumnText = styled.Text`
  align-self: center;
  text-align: center;
  color: ${({ theme }) => theme.base05};
`

const clearMessages = [
  'All clear!',
  'Awesome!',
  'Good job!',
  "You're doing great!",
  'You rock!',
]

const emojis = ['👍', '👏', '💪', '🎉', '💯']

const getRandomClearMessage = () => {
  const randomIndex = Math.floor(Math.random() * clearMessages.length)
  return clearMessages[randomIndex]
}

const getRandomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * emojis.length)
  return emojis[randomIndex]
}

// only one message per app running instance
// because a chaning message is a bit distractive
const clearMessage = getRandomClearMessage()
const emoji = getRandomEmoji()

export const EmptyColumnContent = props => (
  <Wrapper
    {...props}
    contentContainerStyle={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <EmptyColumnText>{clearMessage} {emoji}</EmptyColumnText>
  </Wrapper>
)

export default class extends React.PureComponent {
  props: {
    refreshControl?: React.Element,
  }

  render() {
    const { refreshControl, ...props } = this.props
    delete props.items

    return (
      <Column {...props}>
        <EmptyColumnContent refreshControl={refreshControl} />
      </Column>
    )
  }
}
