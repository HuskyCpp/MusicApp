import React, {useState, useEffect} from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
} from 'react-native';
const {width, height} = Dimensions.get('window');

import auth from '@react-native-firebase/auth';
export default cpnLeftDrawer = props => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    console.log('US: ', user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const navigateToScreenLogin = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        props.navigation.navigate('Screen_Login');
      });
  };

  if (initializing) return null;

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.viewContent}>
        <TouchableOpacity style={styles.Logo}>
          <Image
            source={require('../../asset/LeftDraw/user.png')}
            style={{
              width: width * 0.16,
              height: width * 0.16,
              resizeMode: 'contain',
              marginLeft: width * 0.03,
              marginRight: width * 0.02,
            }}
          />
          {user ? (
            <Text
              style={{
                color: '#000',
                fontSize: width * 0.058,
                textAlign: 'left',
                width: width * 0.48,
              }}>
              {user.email}
            </Text>
          ) : null}
        </TouchableOpacity>

        <View
          style={{
            //   backgroundColor: '#484848',
            position: 'absolute',
            width: width / 1.5,
            height: height / 4.5,
            bottom: width * 0.05,
          }}>
          <TouchableOpacity
            style={styles.ItemContent}
            onPress={() => navigateToScreenLogin()}>
            <Image
              source={require('../../asset/LeftDraw/logout.png')}
              style={{
                width: width * 0.12,
                height: width * 0.12,
                resizeMode: 'contain',
                marginLeft: width * 0.03,
                marginRight: width * 0.02,
              }}
            />
            <Text
              style={{
                color: '#000',
                fontSize: width * 0.052,
                textAlign: 'left',
                width: width * 0.48,
              }}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.72,
    height: height,
  },
  Logo: {
    width: width * 0.69,
    height: width * 0.3,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#666',
  },
  viewContent: {
    width: width * 0.72,
    height: height,
    backgroundColor: '#ddd',
  },
  ItemContent: {
    width: width * 0.69,
    height: width * 0.26,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // paddingLeft: width / 40,
  },
  YellowLine: {
    width: width / 1.5,
    height: width / 150,
    backgroundColor: '#FFD700',
  },
  imgItem: {
    resizeMode: 'cover',
    width: width / 17,
    height: width / 17,
  },
  TxtTouchable1: {
    fontSize: width / 30,
    marginLeft: width / 30,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    width: width / 2,
  },
});
