import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  View,
  Keyboard,
  Platform,
  Modal,
  Alert,
  Text,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {inject, observer} from 'mobx-react';
import {useCounterStore} from '../Store/MobxStore';
import notifee from '@notifee/react-native';
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import PlayMusicTab from './PlayMusicTab';
import RenderSlider from './SliderMusic';

const BottomTab = props => {
  const [isAlert, setIsAlert] = useState(false);
  const [playingTrack, setPlayingTrack] = useState({});
  const [trackState, setTrackState] = useState(State.None);
  const {showPlayMusicModal, setShowPlayMusicModal} = useCounterStore();

  useEffect(() => {
    // Add firebase listeners
    // checkPermissionFirebase();
    setupPlayerInit();
    createNotificationListeners();
  }, []);

  onDisplayNotification = async message => {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      // sound: 'canhbao',
    });

    // Display a notification
    await notifee.displayNotification({
      id: message.messageId,
      title: message.notification.title,
      body: message.notification.body,
      data: message.data,
      android: {
        channelId,
      },
    });
  };

  setupPlayerInit = async () => {
    await TrackPlayer.setupPlayer();
  };

  useTrackPlayerEvents(
    [Event.PlaybackTrackChanged, Event.PlaybackState],
    async event => {
      if (
        event.type === Event.PlaybackTrackChanged &&
        event.nextTrack != null
      ) {
        const track = await TrackPlayer.getTrack(event.nextTrack);
        setPlayingTrack(track || {});
      }
      if (event.type === Event.PlaybackState) {
        setTrackState(event.state);
      }
    },
  );

  createNotificationListeners = async () => {
    //Khi đang dùng App
    messaging().onMessage(onDisplayNotification);

    messaging().onNotificationOpenedApp(remoteMessage => {
      //Bấm vào thông báo khi App đang chạy nền
      console.log('Bấm vào thông báo khi App đang chạy nền', remoteMessage);
      if (remoteMessage.data && remoteMessage.data.encodeId)
        props.navigation.navigate('Screen_PlayMusic', {
          listSongId: [remoteMessage.data],
          screen: 'Screen_Home',
        });
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        //Bấm vào thông báo sau khi đã kill App
        if (remoteMessage) {
          // this.navigateScreenWithFireBase(remoteMessage.data);
          console.log('Bấm vào thông báo sau khi đã kill App');
        }
      });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      //Chạy Background
    });
  };

  showAlert = (title, body, data) => {
    Alert.alert(title, body, [{text: 'OK', onPress: () => {}}], {
      cancelable: false,
    });
  };

  handleBackPress = () => {
    Alert.alert('', 'Bạn có chắc chắn muốn thoát khỏi ứng dụng không?', [
      {
        text: 'Có',
        onPress: () => BackHandler.exitApp(),
      },
      {
        text: 'Không',
        onPress: () => console.log('Ok'),
      },
    ]);
    return true;
  };
  clickHome = () => {
    if (props.state.index != 0) props.navigation.navigate('Screen_Home');
  };
  clickSearch = () => {
    if (props.state.index != 1) props.navigation.navigate('Screen_Search');
  };

  clickPlayingBarPauseBt = async () => {
    if (trackState == State.Paused || trackState == State.Ready)
      await TrackPlayer.play();
    else if (trackState == State.Playing) await TrackPlayer.pause();
  };

  nextSongHandled = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (e) {
      console.log(e);
      Alert.alert('Thông báo', 'Đã hết danh sách phát');
    }
  };

  return (
    <View
      style={{
        alignItems: 'center',
        width: width,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}>
      {trackState == State.Ready ||
      trackState == State.Paused ||
      trackState == State.Playing ? ( // Playing bar
        <TouchableOpacity
          style={{
            justifyContent: 'flex-start',
            backgroundColor: '#fff',
            height: width * 0.156,
            width: width * 0.9,
            borderRadius: width * 0.03,
            elevation: 10,
            marginBottom: 5,
            shadowColor: '#000',
            shadowOffset: {
              width: 2,
              height: 5,
            },
            borderWidth: 2,
            borderColor: '#ddd'
          }}
          onPress={() => setShowPlayMusicModal(true)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',

              height: width * 0.14,
              width: width * 0.88,
            }}>
            <Image
              source={{
                uri: `${
                  playingTrack?.artwork
                    ? playingTrack.artwork
                    : 'https://leerit.com/media/blog/uploads/2017/02/06/music3.jpg'
                }`,
              }}
              style={{
                width: width * 0.12,
                height: width * 0.12,
                borderRadius: width * 0.03,
              }}
            />
            <View style={{width: width * 0.5, justifyContent: 'center'}}>
              <Text style={{fontSize: width * 0.04, color: '#333'}}>
                {playingTrack?.artist || ''}
              </Text>
              <Text style={{fontSize: width * 0.042, color: '#000'}}>
                {playingTrack?.title || ''}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.touch}
              onPress={() => clickPlayingBarPauseBt()}>
              <Image
                style={styles.imagetouch}
                source={
                  trackState == State.Playing
                    ? require('../../asset/BottomTab/pause.png')
                    : require('../../asset/BottomTab/play.png')
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => nextSongHandled()}
              style={[styles.touch, {}]}>
              <Image
                style={styles.imagetouch}
                source={require('../../asset/BottomTab/forward-arrows.png')}
              />
            </TouchableOpacity>
          </View>
          {/* Slider component  */}
          <RenderSlider
            widthSlider={width * 0.9}
            heightSlider={2}
            showBottomTime={false}
          />
        </TouchableOpacity>
      ) : null}

      <SafeAreaView // Bottom tab button
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          backgroundColor: '#111',
          height: width * 0.156,
          width: width,
        }}>
        <TouchableOpacity onPress={() => clickHome()} style={styles.touch}>
          <Image
            style={styles.imagetouch}
            source={
              props.state.index == 0
                ? require('../../asset/BottomTab/homepage.png')
                : require('../../asset/BottomTab/homepage-unactive.png')
            }
          />
          <Text
            style={{
              color: props.state.index == 0 ? '#fff' : '#c3c3c3',
              textAlign: 'center',
              width: width * 0.26,
              fontSize: width * 0.032,
              marginTop: 2,
            }}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touch} onPress={() => clickSearch()}>
          <Image
            style={styles.imagetouch}
            source={
              props.state.index == 1
                ? require('../../asset/BottomTab/loupe.png')
                : require('../../asset/BottomTab/loupe-unactive.png')
            }
          />
          <Text
            style={{
              color: props.state.index == 1 ? '#fff' : '#c3c3c3',
              textAlign: 'center',
              width: width * 0.26,
              fontSize: width * 0.032,
              marginTop: 2,
            }}>
            Search
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={[styles.touch, {}]}>
          <Image
            style={styles.imagetouch}
            source={
              props.state.index == 2
                ? require('../../asset/BottomTab/library.png')
                : require('../../asset/BottomTab/library-unactive.png')
            }
          />
          <Text
            style={{
              color: props.state.index == 2 ? '#fff' : '#c3c3c3',
              textAlign: 'center',
              width: width * 0.26,
              fontSize: width * 0.032,
              marginTop: 2,
            }}>
            Library
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      <Modal // Playing music modal
        animationType="slide"
        transparent={true}
        visible={showPlayMusicModal}
        onRequestClose={() => {
          setShowPlayMusicModal(false);
        }}>
        <PlayMusicTab
          Parent={this}
          ID_SONG={[
            'ZW7O99BA',
            'ZW6UABCO',
            'ZW6EA7O7',
            'ZWA0OA6D',
            'ZWC0FAFA',
            'ZWAEE0F0',
            'ZZD60DD8',
            'ZW7UIB89',
            'ZZ8FBUW9',
            'ZW6DC6UA',
          ]}
        />
      </Modal>
    </View>
  );
};
export default inject('store')(observer(BottomTab));

const styles = StyleSheet.create({
  ver: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0.03 * width,
    bottom: 10,
  },
  touch: {
    height: width * 0.14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagetouch: {
    width: width * 0.072,
    height: width * 0.072,
    resizeMode: 'cover',
  },
});
