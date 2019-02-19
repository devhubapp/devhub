import React, { ReactElement } from 'react'
import { Spring } from 'react-spring/renderprops'

import {
  GestureResponderEvent,
  GestureResponderHandlers,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
} from 'react-native'

export interface DraggableChildrenProps {
  panHandlers: GestureResponderHandlers
  springProps: {
    translateX: number
    translateY: number
  }
}

export interface SpringProps {
  translateX: number
  translateY: number
}

export interface DraggableProps {
  baseSize: number
  currentActiveDraftIndex: number | null
  currentActiveOriginalIndex: number | null
  index: number
  onMove: (
    e: GestureResponderEvent,
    gesture: PanResponderGestureState,
  ) => SpringProps
  onGrant?: (
    e: GestureResponderEvent,
    gesture: PanResponderGestureState,
  ) => void
  onEnd?: (e: GestureResponderEvent, gesture: PanResponderGestureState) => void
  render: (props: DraggableChildrenProps) => ReactElement<any>
}

export default class Draggable extends React.PureComponent<DraggableProps> {
  static getDerivedStateFromProps(props: DraggableProps, state: SpringProps) {
    let translateX =
      props.index === props.currentActiveOriginalIndex ? state.translateX : 0
    let translateY =
      props.index === props.currentActiveOriginalIndex ? state.translateY : 0

    if (
      props.currentActiveOriginalIndex !== props.currentActiveDraftIndex &&
      props.currentActiveOriginalIndex !== null &&
      props.currentActiveDraftIndex !== null
    ) {
      if (
        props.index <= props.currentActiveDraftIndex &&
        props.index > props.currentActiveOriginalIndex
      ) {
        translateX = props.baseSize * -1
        translateY = props.baseSize * -1
      } else if (
        props.index >= props.currentActiveDraftIndex &&
        props.index < props.currentActiveOriginalIndex
      ) {
        translateX = props.baseSize
        translateY = props.baseSize
      }
    }

    return {
      translateX,
      translateY,
    }
  }
  panResponder: PanResponderInstance
  state: SpringProps

  constructor(props: DraggableProps) {
    super(props)

    this.state = {
      translateX: 0,
      translateY: 0,
    }

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: this
        .onMoveShouldSetPanResponderCapture,
      onPanResponderGrant: this.onPanResponderGrant,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderEnd: this.onPanResponderEnd,
      onPanResponderRelease: this.onPanResponderEnd,
      onPanResponderTerminate: this.onPanResponderEnd,
    })
  }

  onMoveShouldSetPanResponderCapture = (
    e: GestureResponderEvent,
    gesture: PanResponderGestureState,
  ) => {
    return gesture.dx !== 0 && gesture.dy !== 0
  }

  onPanResponderGrant = (
    e: GestureResponderEvent,
    gesture: PanResponderGestureState,
  ) => {
    if (this.props.onGrant) {
      this.props.onGrant(e, gesture)
    }
  }

  onPanResponderMove = (
    e: GestureResponderEvent,
    gesture: PanResponderGestureState,
  ) => {
    const { translateX, translateY } = this.props.onMove(e, gesture)
    this.setState({
      translateX,
      translateY,
    })
  }

  onPanResponderEnd = (
    e: GestureResponderEvent,
    gesture: PanResponderGestureState,
  ) => {
    if (this.props.onEnd) {
      this.props.onEnd(e, gesture)
    }
  }

  render() {
    return (
      <Spring
        to={{
          translateX: this.state.translateX,
          translateY: this.state.translateY,
        }}
        immediate={Boolean(
          this.props.currentActiveOriginalIndex === null &&
            this.props.currentActiveDraftIndex === null,
        )}
      >
        {(props: SpringProps) =>
          this.props.render({
            springProps: props,
            panHandlers: this.panResponder.panHandlers,
          })
        }
      </Spring>
    )
  }
}
