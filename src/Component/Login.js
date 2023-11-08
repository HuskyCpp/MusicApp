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
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeyboardShiftLogin from './KeyboardShiftLogin';
const {width, height} = Dimensions.get('window');
import Loading from './LoadingLottie';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import {observer} from 'mobx-react';
import CONST from './Const';
import SignUp from './SignUp';

const CpnLogin = props => {
  const [TK, setTK] = useState('');
  const [MK, setMK] = useState('');
  const [token, setToken] = useState('');
  const [errorText, setErrorText] = useState('');
  const [checkLocation, setCheckLocation] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);
  const [showPass, setShowPass] = useState(false);
  const [enableShowPass, setEnableShowPass] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const passInput = createRef();

  changeTextHandle = MK => {
    setMK(MK);
    if (MK.length == 0) {
      // setEnableShowPass(true);
      setShowPass(false);
    }
  };

  // initData = async () => {
  //   try {
  //     let a = await AsyncStorage.getItem('username');
  //     let b = await AsyncStorage.getItem('password');
  //     setTK(a ? a : '');
  //     setMK(b ? b : '');
  //     if (b && b.length > 0) setEnableShowPass(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // unSubFocus = props.navigation.addListener('focus', async () => {
  //   await initData();
  // });

  useEffect(() => {
    setLoading(false);
    const getInfoAsyncStorage = async () => {
      try {
        let a = await AsyncStorage.getItem('username');
        let b = await AsyncStorage.getItem('password');
        setEnableShowPass(b ? false : true);
        console.log(a);
        console.log(b);
        setTK(a ? a : '');
        setMK(b ? b : '');
      } catch (error) {
        console.log(error);
      }
    };

    checkPermissionFirebase();
    getInfoAsyncStorage();
    Login()
  }, []);

  checkPermissionFirebase = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log('checkPermissionFirebase', enabled);
    if (enabled) {
      getToken();
    } else {
      requestPermissionFirebase();
    }
  };

  getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      console.log('getToken', fcmToken);
      if (fcmToken) {
        console.log(fcmToken, 'token');
        setToken(fcmToken);

        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } else {
      console.log('fcmToken', fcmToken);
      setToken(fcmToken);
    }
  };

  requestPermissionFirebase = async () => {
    try {
      await messaging().requestPermission();
      getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  };

  Login = () => {
    // console.log('Login');
    // if (!TK || TK.replace(/\s/g, '') == '') {
    //   Alert.alert('Thông báo', 'Bạn cần điền tên tài khoản');
    //   return;
    // }
    // if (!MK || MK.replace(/\s/g, '') == '') {
    //   Alert.alert('Thông báo', 'Bạn cần điền mật khẩu');
    //   return;
    // }

    setLoading(true);
    auth()
      // .signInWithEmailAndPassword(TK, MK)
      .signInWithEmailAndPassword('a@gmail.com', '111111')
      .then(async user => {
        console.log(user);
        // If server response message same as Data Matched
        if (user) {
          await AsyncStorage.setItem('username', TK.toLowerCase());
          await AsyncStorage.setItem('password', MK);

          props.navigation.replace('Main');
          // setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
        if (error.code === 'auth/invalid-email')
          setErrorText('That email address is invalid!');
        else if (error.code === 'auth/user-not-found')
          setErrorText('No Email Found');
        else {
          setErrorText('Please check your email id or password');
        }
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
      <KeyboardShiftLogin>
        {() => (
          <ScrollView
            contentContainerStyle={[styles.ViewMain, {alignItems: 'center'}]}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: height * 0.45,
                width: width,
              }}>
              <Image
                style={{
                  width: width * 0.5,
                  height: width * 0.5,
                  resizeMode: 'stretch',
                }}
                source={require('../../asset/Login/music.png')}
              />
            </View>
            <View style={{marginTop: 0, alignItems: 'center'}}>
              <View //Acc
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
                  source={require('../../asset/Login/email.png')}
                />
                <TextInput
                  style={styles.TextPassInput}
                  onChangeText={TT => setTK(TT)}
                  value={TK}
                  placeholder="Tài khoản"
                  placeholderTextColor={'#000'}
                  onSubmitEditing={() =>
                    passInput.current && passInput.current.focus()
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
                  ref={passInput}
                  placeholder="Mật khẩu"
                  value={MK}
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
                onPress={() => Login()}>
                <Text style={styles.TxtDangNhap}>Đăng nhập</Text>
              </TouchableOpacity>

              <Text
                style={{
                  ...styles.TxtDangNhap,
                  color: '#888',
                  marginTop: height * 0.02,
                }}>
                Chưa có tài khoản?{' '}
                <Text
                  style={{color: '#111'}}
                  onPress={() => setShowSignUp(true)}>
                  Đăng ký ngay
                </Text>
              </Text>

              {errorText != CONST.STATE_LOGIN_SUCCESS &&
              errorText != CONST.STATE_LOGIN_READY &&
              errorText.length > 0
                ? renderError()
                : null}
            </View>
          </ScrollView>
        )}
      </KeyboardShiftLogin>
      <Modal onRequestClose={() => setLoading(false)} visible={loading}>
        <Loading />
      </Modal>
      <Modal
        onRequestClose={() => setShowSignUp(false)}
        visible={showSignUp}
        animationType="fade"
        transparent={true}>
        <SignUp setModal={setShowSignUp} />
      </Modal>
    </SafeAreaView>
  );
};
export default observer(CpnLogin);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
