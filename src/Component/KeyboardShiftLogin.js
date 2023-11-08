import {PropTypes} from 'prop-types';
import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';

const {State: TextInputState} = TextInput;

export default class KeyboardShiftLogin extends Component {
  state = {
    shift: new Animated.Value(0),
  };
  componentDidMount() {
    if (Platform.OS == 'android') {
      this.keyboardDidShowSub = Keyboard.addListener(
        'keyboardDidShow',
        this.handleKeyboardDidShow,
      );
      this.keyboardDidHideSub = Keyboard.addListener(
        'keyboardDidHide',
        this.handleKeyboardDidHide,
      );
    } else {
      this.keyboardDidShowSub = Keyboard.addListener(
        'keyboardWillShow',
        this.handleKeyboardDidShow,
      );
      this.keyboardDidHideSub = Keyboard.addListener(
        'keyboardWillHide',
        this.handleKeyboardDidHide,
      );
    }
  }
  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  render() {
    const {children: renderProp} = this.props;
    const {shift} = this.state;
    return (
      <Animated.View
        style={[styles.container, {transform: [{translateY: shift}]}]}
        ref={anmView => (this.UIView = anmView)}>
        {renderProp()}
      </Animated.View>
    );
  }

  handleKeyboardDidShow = event => {
    const {height: windowHeight} = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedInput = TextInputState.currentlyFocusedInput();
    //console.log(currentlyFocusedField);
    if (currentlyFocusedInput) {
      currentlyFocusedInput.measure(
        //currentlyFocusedInput,
        (originX, originY, width, height, pageX, pageY) => {
          const fieldHeight = height;
          const fieldTop = pageY;
          const gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight);
          if (!gap || gap >= 0) {
            return;
          }
          Animated.timing(this.state.shift, {
            toValue:
              Platform.OS == 'android'
                ? gap - (Dimensions.get('window').width / 5)
                : gap - (Dimensions.get('window').width / 5),

            duration: 200,
            useNativeDriver: true,
          }).start();
        },
      );
    }
  };

  handleKeyboardDidHide = () => {
    Animated.timing(this.state.shift, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    left: 0,
    position: 'absolute',
    width: '100%',
  },
});

KeyboardShiftLogin.propTypes = {
  children: PropTypes.func.isRequired,
};
