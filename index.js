/**
 * @format
 */

 import {AppRegistry} from 'react-native';
 import App from './App';
 import HomeMusic from './src/Component/HomeMusic';
 import PlayMusicTab from './src/Component/PlayMusicTab';
 import SearchMusic from './src/Component/SearchMusic';
 import Test from './src/Component/Test';
 import Navigation from './src/Navigation'
 import {name as appName} from './app.json';
 import TrackPlayer from 'react-native-track-player';

 
 TrackPlayer.registerPlaybackService(() => require('./service.js'));
 AppRegistry.registerComponent(appName, () => Navigation);
//  AppRegistry.registerComponent(appName, () => SearchMusic);
//  AppRegistry.registerComponent(appName, () => PlayMusicTab);
//  AppRegistry.registerComponent(appName, () => HomeMusic);
 
//  AppRegistry.registerComponent(appName, () => Test);
 