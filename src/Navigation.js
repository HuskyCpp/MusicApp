import React from 'react';

import Home from './Component/HomeMusic';
import Login from './Component/Login';
import PlayMusic from './Component/PlayMusicTab';
import SearchMusic from './Component/SearchMusic';
import BottomTab from './Component/BottomTab';
import LeftDrawerTab from './Component/cpnLeftDrawer';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Dimensions} from 'react-native';
import {Provider} from 'mobx-react';
import MobxStore from './Store/MobxStore';

const {width, height} = Dimensions.get('window');

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function BTTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <BottomTab {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 50,
          left: 20,
          right: 20,
          backgroundColor: 'white',
          elevation: 0,
        },
      }}>
      <Tab.Screen name="Screen_Home" component={Home} options={{}} />
      <Tab.Screen name="Screen_Search" component={SearchMusic} options={{}} />
    </Tab.Navigator>
  );
}

function LeftDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          width: width * 0.72,
          backgroundColor: 'transparent',
          height: height / 2,
        },
        headerShown: false,
      }}
      drawerContent={props => <LeftDrawerTab {...props} />}
      drawerPosition="left"
      drawerStyle={{
        backgroundColor: '#A9A9A9',
        width: Dimensions.get('window').width,
      }}>
      <Drawer.Screen
        name="Root"
        component={BTTabs}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}

const Stack = createNativeStackNavigator();
export default class App extends React.Component {
  render() {
    return (
      <Provider store={MobxStore}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Screen_Login">
            <Stack.Screen
              name="Screen_Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Main"
              component={LeftDrawer}
              options={{headerShown: false}}
            />
            {/* <Stack.Screen name="Screen_Home" component={Home} options={{headerShown: false}} /> */}
            <Stack.Screen
              name="Screen_PlayMusic"
              component={PlayMusic}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
