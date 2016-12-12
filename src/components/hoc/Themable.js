// @flow

import React from 'react';
import { withTheme } from 'styled-components/native';

export default withTheme;

// import { CHANNEL } from 'styled-components/lib/models/ThemeProvider';

// import type { ThemeObject } from '../../utils/types';

// export default Component => class extends React.PureComponent {
//   static contextTypes = {
//     [CHANNEL]: React.PropTypes.func,
//   };
//
//   state = ({}: {
//     theme?: ?ThemeObject,
//   });
//
//   unsubscribe: Function;
//
//   componentWillMount = () => {
//     const subscribe = this.context[CHANNEL];
//     this.unsubscribe = subscribe((theme) => {
//       this.setState({ theme });
//     });
//   };
//
//   componentWillUnmount = () => {
//     if (typeof this.unsubscribe === 'function') this.unsubscribe();
//   };
//
//   render = () => {
//     const { theme } = this.state;
//
//     return (
//       <Component theme={theme} {...this.props} />
//     );
//   };
// };
