// Define all your icons once,
// load them once,
// and use everywhere
// https://gist.github.com/dropfen/4a2209d7274788027f782e8655be198f

import Octicons from 'react-native-vector-icons/Octicons';

const defaultIconProvider = Octicons;
const iconsMap = {};

const sizes = {
  normal: 24,
};

// define your suffixes by yourself..
// here we use active, big, small, very-big...
const replaceSuffixPattern = /__(inverted)/g;
const icons = {
  'mark-github': [sizes.normal, '#000000'],
  'mark-github__inverted': [sizes.normal, '#ffffff'],
  flame: [sizes.normal, '#000000'],
  flame__inverted: [sizes.normal, '#ffffff'],
  globe: [sizes.normal, '#000000'],
  globe__inverted: [sizes.normal, '#ffffff'],
  gear: [sizes.normal, '#000000'],
  gear__inverted: [sizes.normal, '#ffffff'],
};

const iconsLoaded = new Promise((resolve) => {
  Promise.all(
    Object.keys(icons).map((iconName) => {
      const Provider = icons[iconName][2] || defaultIconProvider; // Octicons
      return Provider.getImageSource(
        iconName.replace(replaceSuffixPattern, ''),
        icons[iconName][0],
        icons[iconName][1],
      );
    }) // eslint-disable-line comma-dangle
  ).then((sources) => {
    Object.keys(icons).forEach((iconName, idx) => { iconsMap[iconName] = sources[idx]; });

    // Call resolve (and we are done)
    resolve(true);
  });
});

export {
  iconsMap,
  iconsLoaded,
};
