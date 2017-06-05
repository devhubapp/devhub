// @flow

import React, { PureComponent } from 'react'
import { withTheme } from 'styled-components/native'
import { Animated, Easing, StyleSheet, View } from 'react-native'

@withTheme
export default class ProgressBar extends PureComponent {
  static defaultProps = {
    animated: true,
    borderRadius: 0,
    borderWidth: 0,
    color: undefined,
    duration: 800,
    height: StyleSheet.hairlineWidth,
    indeterminate: true,
    indeterminateWidthFactor: 1,
    progress: 0,
    theme: {},
    width: 200,
  }

  constructor(props) {
    super(props)

    const progress = Math.min(Math.max(props.progress, 0), 1)

    this.state = {
      progress: new Animated.Value(
        props.indeterminate ? props.indeterminateWidthFactor : progress,
      ),
      animationValue: new Animated.Value(this.getBarWidthZeroPosition()),
    }
  }

  componentDidMount() {
    if (this.props.indeterminate) {
      this.animate()
    }
  }

  componentWillReceiveProps(props) {
    if (props.indeterminate !== this.props.indeterminate) {
      if (props.indeterminate) {
        this.animate()
      } else {
        Animated.spring(this.state.animationValue, {
          toValue: this.getBarWidthZeroPosition(),
        }).start()
      }
    }
    if (
      props.indeterminate !== this.props.indeterminate ||
      props.progress !== this.props.progress
    ) {
      const progress = props.indeterminate
        ? props.indeterminateWidthFactor
        : Math.min(Math.max(props.progress, 0), 1)

      if (props.animated) {
        Animated.spring(this.state.progress, {
          toValue: progress,
          bounciness: 0,
        }).start()
      } else {
        this.state.progress.setValue(progress)
      }
    }
  }

  getBarWidthZeroPosition() {
    return (
      this.props.indeterminateWidthFactor /
      (1 + this.props.indeterminateWidthFactor)
    )
  }
  props: {
    animated?: boolean,
    borderColor?: string,
    borderRadius?: number,
    borderWidth?: number,
    children?: ReactClass<any>,
    color?: string,
    duration?: number,
    height?: number,
    indeterminate?: boolean,
    indeterminateWidthFactor?: number,
    progress?: number,
    style?: object | Array<object>,
    theme?: object | Array<object>, // eslint-disable-line react/forbid-prop-types
    unfilledColor?: string,
    width?: number,
  }

  animate() {
    this.state.animationValue.setValue(0)
    Animated.timing(this.state.animationValue, {
      toValue: 1,
      duration: this.props.duration,
      easing: Easing.linear,
      isInteraction: false,
    }).start(endState => {
      if (endState.finished) {
        this.animate()
      }
    })
  }

  render() {
    const {
      borderColor,
      borderRadius,
      borderWidth,
      children,
      color: _color,
      height,
      indeterminateWidthFactor,
      style,
      unfilledColor,
      width,
      theme,
      ...restProps
    } = this.props

    const color = _color || theme.base07 || 'rgba(0, 122, 255, 1)'

    const innerWidth = width - borderWidth * 2
    const containerStyle = {
      width,
      borderWidth,
      borderColor: borderColor || color,
      borderRadius,
      overflow: 'hidden',
      backgroundColor: unfilledColor,
    }
    const progressStyle = {
      backgroundColor: color,
      height,
      width: innerWidth,
      transform: [
        {
          translateX: this.state.animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [innerWidth * -indeterminateWidthFactor, innerWidth],
          }),
        },
        {
          translateX: this.state.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [innerWidth / -2, 0],
          }),
        },
        {
          scaleX: this.state.progress,
        },
      ],
    }

    return (
      <View style={[containerStyle, style]} {...restProps}>
        <Animated.View style={progressStyle} />
        {children}
      </View>
    )
  }
}
