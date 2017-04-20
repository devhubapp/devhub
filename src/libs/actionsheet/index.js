// flow

import React, { PureComponent } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type ActionSheetProps = {
  cancelButtonIndex: ?number,
  containerPadding: ?number,
  containerStyle: ?any,
  destructiveButtonIndex: ?number,
  icons: ?Array<number>,
  onSelect: ?(i: number) => void,
  optionContainerStyle: ?any,
  optionTextStyle: ?any,
  options: ?Array<string>,
  optionsContainerStyle: ?any,
  radius: ?number,
  tintColor: ?string,
  title: ?string,
  useNativeDriver: ?boolean
};

type ActionSheetState = {
  isAnimating: boolean,
  isVisible: boolean,
  overlayOpacity: any,
  translateY: any
};

export const ANIMATION_TIME_HIDE = 200;
export const ANIMATION_TIME_SHOW = 400;
export const CANCEL_MARGIN = 6;
export const DANGER_COLOR = '#ff3b30';
export const MAX_HEIGHT = Dimensions.get('window').height * 0.7;
export const OPTION_HEIGHT = 50;
export const OPTION_MARGIN = StyleSheet.hairlineWidth;
export const OVERLAY_OPACITY = 0.4;
export const TITLE_HEIGHT = 40;
export const TITLE_MARGIN = OPTION_MARGIN;

export const DEFAULT_TINT_COLOR = '#007aff';

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  container: {},
  container__full: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container__bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  optionsContainer: {},
  optionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: OPTION_HEIGHT,
    marginBottom: OPTION_MARGIN,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  optionText: {
    fontSize: 18,
    padding: 10,
  },
  titleContainer: {
    height: TITLE_HEIGHT,
    marginBottom: TITLE_MARGIN,
  },
  titleText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'gray',
  },
  overlay: {
    backgroundColor: '#000000',
    opacity: 0,
  },
});

export default class ActionSheet extends PureComponent {
  static defaultProps = {
    containerPadding: 10,
    radius: 10,
    tintColor: DEFAULT_TINT_COLOR,
    useNativeDriver: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      height: this.calculateHeight(props),
      isAnimating: false,
      isVisible: false,
      overlayOpacity: new Animated.Value(0),
      translateY: new Animated.Value(this.calculateHeight(props)),
    };
  }

  state: ActionSheetState;

  componentWillReceiveProps(props) {
    this.setState({ height: this.calculateHeight(props) });
  }

  animate = (toVisible, callback) => {
    if (this.state.isVisible === toVisible) {
      return;
    }

    const duration = toVisible ? ANIMATION_TIME_SHOW : ANIMATION_TIME_HIDE;
    const easing = Easing.out(Easing.cubic);
    const overlayOpacity = toVisible ? OVERLAY_OPACITY : 0;
    const translateY = toVisible ? 0 : this.state.height;
    const { useNativeDriver } = this.props;

    this.setState({ isAnimating: true, isVisible: toVisible }, () => {
      Animated.parallel([
        Animated.timing(this.state.translateY, {
          toValue: translateY,
          easing,
          duration,
          useNativeDriver,
        }),
        Animated.timing(this.state.overlayOpacity, {
          toValue: overlayOpacity,
          easing,
          duration,
          useNativeDriver,
        }),
      ]).start(result => {
        if (result.finished) {
          this.setState({ isAnimating: false }, () => {
            if (typeof callback === 'function') {
              callback();
            }
          });
        }
      });
    });
  };

  calculateHeight = props =>
    (props.title ? TITLE_HEIGHT + TITLE_MARGIN : 0) +
    (props.options || []).length * (OPTION_HEIGHT + OPTION_MARGIN) +
    CANCEL_MARGIN +
    2 * (props.containerPadding || 0);

  hide = (animated = true, callback) =>
    (animated
      ? this.animate(false, callback)
      : this.setState({ visible: false }, callback));

  show = (animated = true, callback) =>
    (animated
      ? this.animate(true, callback)
      : this.setState({ visible: true }, callback));

  toggle = (animated = true, callback) =>
    (this.state.isVisible
      ? this.hide(animated, callback)
      : this.show(animated, callback));

  select = index => {
    this.hide(true, () => {
      setTimeout(() => {
        this.props.onSelect(index);
      }, 50);
    });
  };

  props: ActionSheetProps;

  renderCancelOption({ style, textStyle } = {}) {
    const {
      options,
      cancelButtonIndex,
      optionContainerStyle,
      radius,
      tintColor,
    } = this.props;

    if (!(cancelButtonIndex >= 0 && options[cancelButtonIndex])) {
      return null;
    }

    return this.renderOption(cancelButtonIndex, options[cancelButtonIndex], {
      color: tintColor,
      style: [
        optionContainerStyle,
        { marginTop: CANCEL_MARGIN, borderRadius: radius },
        style,
      ],
      textStyle: [{ fontWeight: '600' }, textStyle],
    });
  }

  renderOption = (index, label, { color, style, textStyle } = {}) => {
    const { optionContainerStyle, optionTextStyle } = this.props;

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.9}
        style={[styles.optionButton, optionContainerStyle, style]}
        onPress={() => this.select(index)}
      >
        {React.isValidElement(label)
          ? label
          : <Text
            style={[styles.optionText, { color }, optionTextStyle, textStyle]}
            numberOfLines={1}
          >
            {label}
          </Text>}
      </TouchableOpacity>
    );
  };

  renderOptions = () => {
    const {
      cancelButtonIndex,
      destructiveButtonIndex,
      options,
      radius,
      tintColor,
      title,
    } = this.props;

    const mainOptions = options.filter(
      (label, index) => index !== cancelButtonIndex,
    );

    const lastIndex = options.indexOf(mainOptions.pop());

    return options.map((label, index) => {
      if (index === cancelButtonIndex) return null;

      const color = index === destructiveButtonIndex ? DANGER_COLOR : tintColor;

      return this.renderOption(index, label, {
        color,
        style: {
          borderTopLeftRadius: index === 0 && !title ? radius : 0,
          borderTopRightRadius: index === 0 && !title ? radius : 0,
          borderBottomLeftRadius: index === lastIndex ? radius : 0,
          borderBottomRightRadius: index === lastIndex ? radius : 0,
        },
      });
    });
  };

  renderTitle({ style, textStyle } = {}) {
    const { optionContainerStyle, radius, title } = this.props;

    if (!title) {
      return null;
    }

    return (
      <View
        style={[
          styles.optionButton,
          styles.titleContainer,
          {
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
          },
          optionContainerStyle,
          style,
        ]}
      >
        {React.isValidElement(title)
          ? title
          : <Text style={[styles.titleText, textStyle]} numberOfLines={1}>
            {title}
          </Text>}
      </View>
    );
  }

  render() {
    const {
      containerPadding,
      containerStyle,
      optionsContainerStyle,
    } = this.props;
    const {
      height,
      isAnimating,
      isVisible,
      overlayOpacity,
      translateY,
    } = this.state;

    if (!(isVisible || isAnimating)) return null;

    return (
      <Modal
        animationType="none"
        onRequestClose={() => this.hide()}
        transparent
        visible={isVisible || isAnimating}
      >
        <TouchableWithoutFeedback
          style={styles.container__full}
          onPress={() => this.hide()}
        >
          <Animated.View
            style={[styles.full, styles.overlay, { opacity: overlayOpacity }]}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.container,
            styles.container__bottom,
            containerStyle,
            {
              height,
              padding: containerPadding,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={[styles.optionsContainer, optionsContainerStyle]}>
            {this.renderTitle()}
            <ScrollView scrollEnabled={height > MAX_HEIGHT}>
              {this.renderOptions()}
            </ScrollView>
          </View>
          {this.renderCancelOption()}
        </Animated.View>
      </Modal>
    );
  }
}
