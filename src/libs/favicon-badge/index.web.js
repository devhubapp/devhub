// @flow
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies, react/no-unused-prop-types */
/* eslint-env browser */
// TODO: Fix eslint for web imports

import { PureComponent } from 'react'
import Favico from './favico'

let favico

export default class FaviconBadge extends PureComponent {
  static defaultProps = {
    badgeCount: 0,
    bgColor: '#d00',
    textColor: '#fff',
    fontFamily: 'sans-serif',
    fontStyle: 'bold',
    type: 'circle',
    position: 'down',
    animation: 'slide',
    elementId: false,
    element: false,
    dataUrl: false,
  }

  constructor(props) {
    super(props)

    const { badgeCount, ...options } = props

    favico = favico || new Favico(options)
    favico.badge(badgeCount, options)
  }

  componentWillReceiveProps({ badgeCount, ...options }) {
    if (badgeCount === this.props.badgeCount) return
    favico.badge(badgeCount, options)
  }

  props: {
    // Badge count
    badgeCount: number,

    // Badge background color
    bgColor?: string,

    // Badge text color
    textColor?: string,

    // Text font family (Arial, Verdana, Times New Roman, serif, sans-serif,...)
    fontFamily?: string,

    // Font style
    fontStyle:
      | 'normal'
      | 'italic'
      | 'oblique'
      | 'bold'
      | 'bolder'
      | 'lighter'
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900',

    // Badge shape
    type?: 'circle' | 'rectangle',

    // Badge position
    position?: 'up' | 'down' | 'left' | 'upleft',

    // Badge animation type
    animation?: 'slide' | 'fade' | 'pop' | 'popFade' | 'none',

    // Image element ID if there is need to attach badge to regular image
    elementId?: boolean,

    // DOM element where to change "href" attribute (useful in case of multiple link icon elements)
    element?: boolean,

    // Method that will be called for each animation from with data URI parameter
    dataUrl?: boolean,
  }

  render() {
    return null
  }
}
