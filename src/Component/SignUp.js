import React, {Component, useState, useEffect, createRef} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
  Alert,
  View,
  Image,
  ScrollView,
  AppState,
  PermissionsAndroid,
  Modal,
} from 'react-native';
import KeyboardShiftLogin from './KeyboardShiftLogin';
const {width, height} = Dimensions.get('window');
import Loading from './LoadingLottie';
import {observer} from 'mobx-react';
import CONST from './Const';
import auth from '@react-native-firebase/auth';

const SignUp = props => {
  const [TK, setTK] = useState('');
  const [MK, setMK] = useState('');
  const [ReMK, setReMK] = useState('');
  const [errorText, setErrorText] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [enableShowPass, setEnableShowPass] = useState(true);
  const [loading, setLoading] = useState(false);

  const rePasswordInputRef = createRef();
  const passwordInputRef = createRef();

  changeTextHandle = MK => {
    setMK(MK);
    if (MK.length == 0) {
      setShowPass(false);
    }
  };

  SignUpHandle = () => {
    console.log('Login');
    if (TK == null || TK.replace(/\s/g, '') == '') {
      Alert.alert('Thông báo', 'Bạn cần điền tên tài khoản');
      return;
    }
    if (MK == null || MK.replace(/\s/g, '') == '') {
      Alert.alert('Thông báo', 'Bạn cần điền mật khẩu');
      return;
    }
    if (ReMK != MK) {
      Alert.alert('Thông báo', 'Mật khẩu nhập lại không khớp');
      return;
    }
    auth()
      .createUserWithEmailAndPassword(TK, MK)
      .then(user => {
        console.log('User account created & signed in!');
        if (user) {
          // auth()
          //   .currentUser.updateProfile({
          //     displayName: userName,
          //     photoURL:
          //       "https://aboutreact.com/profile.png",
          //   })
          //   .then(() => navigation.replace("HomeScreen"))
          //   .catch((error) => {
          //     alert(error);
          //     console.error(error);
          //   });
          console.log(user);
          Alert.alert("Thông báo", "Đăng ký thành công! Quay lại màn hình đăng nhập",[{text: 'OK', onPress: () => props.setModal(false)}])
        }
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          setErrorText('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          setErrorText('That email address is invalid!');
        }

        if (error.code === 'auth/weak-password') {
          console.log('Password should be at least 6 characters!');
          setErrorText('Password should be at least 6 characters!');
        }
        // console.error(error);
      });
  };

  renderError = () => {
    return (
      <Text
        style={[
          styles.TxtDangNhap,
          {
            width: width / 1.25,
            textAlign: 'center',
            marginLeft: width / 30,
            color: 'red',
            marginTop: width / 40,
          },
        ]}>
        {errorText}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layout} onPress={() => console.log('close')} />

      <KeyboardShiftLogin>
        {() => (
          <ScrollView
            contentContainerStyle={[
              styles.ViewMain,
              {
                alignItems: 'center',
                top: height * 0.4,
                backgroundColor: '#fff',
              },
            ]}>
            <TouchableOpacity
              style={{
                height: height * 0.03,
                width: height * 0.03,
                alignSelf: 'flex-start',
                marginLeft: width * 0.032,
                marginTop: width * 0.03,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => props.setModal(false)}>
              <Image
                style={{
                  width: width * 0.06,
                  height: width * 0.06,
                  resizeMode: 'contain',
                  marginRight: width * 0.02,
                }}
                source={require('../../asset/Login/previous.png')}
              />
            </TouchableOpacity>
            <View style={{alignItems: 'center'}}>
              <View //Acc
                style={{
                  width: width / 1.1,
                  marginTop: width / 18,
                  height: width / 8,
                  backgroundColor: 'white',
                  borderColor: '#ccc',
                  paddingLeft: width / 20,
                  borderWidth: 1,
                  borderRadius: width / 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  elevation: 5,
                  shadowColor: '#222',
                }}>
                <Image
                  style={{
                    width: width * 0.05,
                    height: width * 0.05,
                    resizeMode: 'contain',
                    marginRight: width * 0.02,
                  }}
                  source={require('../../asset/Login/email.png')}
                />
                <TextInput
                  style={styles.TextPassInput}
                  onChangeText={TT => setTK(TT)}
                  value={TK}
                  placeholder="Tài khoản"
                  placeholderTextColor={'#000'}
                  onSubmitEditing={() =>
                    passwordInputRef.current && passwordInputRef.current.focus()
                  }
                  autoCapitalize="none"
                />
              </View>

              <View //Password
                style={{
                  width: width / 1.1,
                  marginTop: width / 15,
                  height: width / 8,
                  backgroundColor: 'white',
                  borderColor: '#ccc',
                  paddingLeft: width / 20,
                  borderWidth: 1,
                  borderRadius: width / 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  elevation: 5,
                  shadowColor: '#222',
                }}>
                <Image
                  style={{
                    width: width * 0.05,
                    height: width * 0.05,
                    resizeMode: 'contain',
                    marginRight: width * 0.02,
                  }}
                  source={require('../../asset/Login/padlock.png')}
                />
                <TextInput
                  style={styles.TextPassInput}
                  onChangeText={MK => changeTextHandle(MK)}
                  value={MK}
                  ref={passwordInputRef}
                  placeholder="Mật khẩu"
                  placeholderTextColor={'#000'}
                  onSubmitEditing={() =>
                    rePasswordInputRef.current &&
                    rePasswordInputRef.current.focus()
                  }
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                  returnKeyType="done"
                />

                {/* cn show pass*/}
                {enableShowPass && MK.length > 0 ? (
                  <TouchableOpacity
                    style={{marginRight: width / 16}}
                    onPress={() => {
                      setShowPass(!showPass);
                    }}>
                    <Image
                      style={{width: width / 15, height: width / 15}}
                      source={
                        !showPass
                          ? require('../../asset/Login/hidden.png')
                          : require('../../asset/Login/view.png')
                      }
                    />
                  </TouchableOpacity>
                ) : null}
              </View>

              <View //Re Password
                style={{
                  width: width / 1.1,
                  marginTop: width / 15,
                  height: width / 8,
                  backgroundColor: 'white',
                  borderColor: '#ccc',
                  paddingLeft: width / 20,
                  borderWidth: 1,
                  borderRadius: width / 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  elevation: 5,
                  shadowColor: '#222',
                }}>
                <Image
                  style={{
                    width: width * 0.05,
                    height: width * 0.05,
                    resizeMode: 'contain',
                    marginRight: width * 0.02,
                  }}
                  source={require('../../asset/Login/padlock.png')}
                />
                <TextInput
                  style={styles.TextPassInput}
                  onChangeText={MK => setReMK(MK)}
                  value={ReMK}
                  ref={rePasswordInputRef}
                  placeholder="Nhập lại mật khẩu"
                  placeholderTextColor={'#000'}
                  onSubmitEditing={Keyboard.dismiss}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                  returnKeyType="done"
                />

                {/* cn show pass*/}
                {enableShowPass && MK.length > 0 ? (
                  <TouchableOpacity
                    style={{marginRight: width / 16}}
                    onPress={() => {
                      setShowPass(!showPass);
                    }}>
                    <Image
                      style={{width: width / 15, height: width / 15}}
                      source={
                        !showPass
                          ? require('../../asset/Login/hidden.png')
                          : require('../../asset/Login/view.png')
                      }
                    />
                  </TouchableOpacity>
                ) : null}
              </View>

              <TouchableOpacity
                style={{
                  ...styles.BTLogin,
                  marginTop: width * 0.2,
                  width: width / 1.25,
                  height: width / 8,
                  backgroundColor: '#000',
                  // paddingLeft: width / 20,
                  borderRadius: width / 16,
                }}
                onPress={() => SignUpHandle()}>
                <Text style={styles.TxtDangNhap}>Đăng ký</Text>
              </TouchableOpacity>

              {errorText != CONST.STATE_LOGIN_SUCCESS &&
              errorText != CONST.STATE_LOGIN_READY &&
              errorText.length > 0
                ? renderError()
                : null}
            </View>
          </ScrollView>
        )}
      </KeyboardShiftLogin>
    </SafeAreaView>
  );
};
export default observer(SignUp);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  layout: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: '#000',
    opacity: 0.35,
  },
  BgLogin: {
    width: width,
    height: height,
    resizeMode: 'contain',
    position: 'absolute',
  },
  Logo: {
    width: width / 1.2,
    height: width / 1.5,
    resizeMode: 'contain',
  },
  ViewMain: {
    flex: 1,
  },
  TextHeaderInput: {
    fontFamily: 'Roboto-Bold',
    fontSize: width / 20,
    color: 'white',
    width: width / 1.1,
  },
  TextPassInput: {
    width: width / 1.5,
    height: width / 9,
    backgroundColor: 'white',
    fontFamily: 'Roboto-Bold',
    fontSize: width / 30,
    color: 'black',
  },
  TextInput: {
    width: width / 1.1,
    marginTop: width / 15,
    height: width / 8,
    backgroundColor: 'white',
    fontFamily: 'Roboto-Bold',
    fontSize: width / 30,
    borderColor: '#94BFE9',
    paddingLeft: width / 20,
    color: 'black',
    borderWidth: 1,
    borderRadius: 10,
  },
  BTLogin: {
    width: width / 2.2,
    height: width / 8,
    backgroundColor: '#a9d0ff',
    borderRadius: 20,
    marginTop: width / 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BTSignUp: {
    width: width / 2.2,
    height: width / 8,
    backgroundColor: '#a0dfff',
    borderRadius: 20,
    marginTop: width / 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TxtDangNhap: {
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    fontSize: width / 25,
    color: '#fff',
  },
});
const stylesDrop = StyleSheet.create({
  textButton: {
    color: 'deepskyblue',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'deepskyblue',
    margin: 2,
  },

  dropdown_2: {
    width: width / 1.1,
    height: width / 8,
    backgroundColor: '#484848',

    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    bottom: width / 10,
    borderRadius: width / 120,
    position: 'absolute',
  },
  dropdown_2_text: {
    fontSize: width / 30,
    paddingLeft: width / 20,
    color: 'white',
    width: width / 1.1,
  },
  dropdown_2_dropdown: {},
  dropdown_2_row: {
    flexDirection: 'row',
    height: width / 10,
    alignItems: 'center',
  },
  dropdown_2_image: {
    marginLeft: 4,
    width: width / 16,
    height: width / 16,
  },
  dropdown_2_row_text: {
    marginHorizontal: width / 80,
    fontSize: width / 30,
    color: 'black',
    textAlignVertical: 'center',
  },
});
