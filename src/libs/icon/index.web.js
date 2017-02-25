/* eslint-env browser */

import font from 'react-native-vector-icons/Fonts/Octicons.ttf';
import Icon from 'react-native-vector-icons/Octicons';

const iconStyles = `@font-face { src:url(${font});font-family: Octicons; }`;

const style = document.createElement('style');
style.type = 'text/css';

if (style.styleSheet) {
  style.styleSheet.cssText = iconStyles;
} else {
  style.appendChild(
    document.createTextNode(iconStyles),
  );
}

document.head.appendChild(style);

export default Icon;
