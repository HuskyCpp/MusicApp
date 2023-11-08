import React, {Component, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Alert,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
} from 'react-native';
import TrackPlayer, {
  Event,
  Capability,
  State,
  RepeatMode,
  useTrackPlayerEvents,
} from 'react-native-track-player';

import '../API/ZingMp3Api';
// import {store} from '../Store/MobxStore';
import LoadingLottie from './LoadingLottie';
import RenderSlider from './SliderMusic';
import {inject, observer} from 'mobx-react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {useCounterStore} from '../Store/MobxStore';

const PlayMusicTab = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [onHandleScroll, setOnHandleScroll] = useState(false);
  const [playingTrack, setPlayingTrack] = useState({});
  const [playingTrackIdx, setPlayingTrackIdx] = useState(0);
  const [trackState, setTrackState] = useState(State.None);
  const [listTrack, setListTrack] = useState([]);
  const {
    showPlayMusicModal,
    setShowPlayMusicModal,
    setShouldResetPlayingModalgModal,
    shouldResetPlayingModal,
  } = useCounterStore();
  const scrollRef = useRef();

  useTrackPlayerEvents(
    [
      Event.PlaybackState,
      Event.PlaybackError,
      Event.PlaybackTrackChanged,
      Event.PlaybackQueueEnded,
    ],
    async event => {
      if (event.type === Event.PlaybackError) {
        console.warn('An error occured while playing the current track.');
      }
      if (event.type === Event.PlaybackTrackChanged) {
        // console.log(event.nextTrack)
        const track = await TrackPlayer.getTrack(event.nextTrack);
        setPlayingTrack(track || {});
        setPlayingTrackIdx(event.nextTrack);

        scrollRef.current.scrollTo({
          animatde: true,
          x: event.nextTrack * width_window,
          y: 0,
        });
        // props.changeActiveSlideValue(event.nextTrack);
      }
      if (event.type === Event.PlaybackState) {
        setTrackState(event.state);
        // else
        //     props.changeLoadingStatus(true)
      }
      if (event.type === Event.PlaybackQueueEnded) {
        console.log('PlaybackQueueEnd!! ' + event.track);
      }
    },
  );

  useEffect(() => {
    updatePlaylistData();
  }, []);

  useEffect(() => {
    async function handleBeforeRender() {
      await setOnHandleScroll(false);

      TrackPlayer.getRepeatMode() == RepeatMode.Off
        ? setIsRepeat(false)
        : setIsRepeat(true);

      let arrTrack = await TrackPlayer.getQueue();
      await setListTrack(arrTrack);

      let playingTrackIdxCp = await TrackPlayer.getCurrentTrack();
      const track = await TrackPlayer.getTrack(playingTrackIdxCp);
      setPlayingTrackIdx(playingTrackIdxCp);
      setPlayingTrack(track || {});
      await scrollRef.current.scrollTo({
        animated: false,
        x: playingTrackIdxCp * width_window,
        y: 0,
      });
      await setOnHandleScroll(true);
    }
    if (showPlayMusicModal) handleBeforeRender();
  }, [showPlayMusicModal]);

  updatePlaylistData = async () => {
    TrackPlayer.getRepeatMode() == RepeatMode.Off
      ? setIsRepeat(false)
      : setIsRepeat(true);

    let arrTrack = await TrackPlayer.getQueue();
    console.log('TrackPlayer.getQueue() ', arrTrack);

    if (arrTrack.length < 1) {
      // return Alert.alert('Thông báo', 'Chưa tải được bài hát. Thử lại', [
      //   {
      //     text: 'Thử lại',
      //     onPress: () => {
      //       this.reload();
      //     },
      //   },
      //   {
      //     text: 'Hủy',
      //     onPress: () => {
      //       setShowPlayMusicModal(false);
      //     },
      //   },
      // ]);
    } else {
      setListTrack(arrTrack);
      try {
        const recentMusic = await AsyncStorage.getItem('recent_music_key');
        let arrRecentMusic = recentMusic != null ? JSON.parse(recentMusic) : [];
        arrRecentMusic = arrRecentMusic.concat(arrTrack);
        let arrRecentMusicCp = [];
        for (let i in arrRecentMusic) {
          let idx = arrRecentMusicCp
            .map(item => item.encodeId)
            .indexOf(arrRecentMusic[i].encodeId);
          if (idx < 0) {
            arrRecentMusicCp.push(arrRecentMusic[i]);
          }
        }
        console.log('arrRecentMusicCp :  ', arrRecentMusicCp);
        arrRecentMusic = arrRecentMusicCp;

        if (arrRecentMusic.length <= 5) {
          let jsonValue = JSON.stringify(arrRecentMusic);
          // console.log("jsonValue : ", jsonValue)
          await AsyncStorage.setItem('recent_music_key', jsonValue);
        } else {
          arrRecentMusic.splice(0, arrRecentMusic.length - 5);
          let jsonValue = JSON.stringify(arrRecentMusic);
          // console.log("jsonValue : ", jsonValue)
          await AsyncStorage.setItem('recent_music_key', jsonValue);
        }
      } catch (err) {
        return Alert.alert('Thông báo lỗi', err);
      }
    }
  };

  reload = async () => {
    updatePlaylistData();
    // await TrackPlayer.reset();
    // await TrackPlayer.add(playList);
  };

  prevSongHandled = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (e) {
      console.log(e);
    }
  };

  nextSongHandled = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (e) {
      console.log(e);
      Alert.alert('Thông báo', 'Đã hết danh sách phát');
    }
  };

  checkStoragePermissionAnDownload = async () => {
    if (Platform.OS == 'android') {
      //Android
      try {
        let permRead = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        let permWrite = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (permRead == true && permWrite == true) {
        } else {
          if (permRead == false) {
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: 'Chưa cấp quyền truy cập bộ nhớ',
                message: 'Bạn cần cấp quyền truy cập bộ nhớ để tiếp tục',

                buttonNegative: 'Không',
                buttonPositive: 'Có',
              },
            );
            return;
          } else if (permWrite == false) {
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'Chưa cấp quyền ghi bài hát vào bộ nhớ',
                message: 'Bạn cần cấp quyền ghi bài hát vào bộ nhớ để tiếp tục',

                buttonNegative: 'Không',
                buttonPositive: 'Có',
              },
            );
            return;
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    this.downloadHandle();
  };

  downloadHandle = async () => {
    // return 0
    let curSong = playingTrack;
    console.log(curSong);
    if (!curSong.url || !curSong.title) return;

    let URL =
      curSong.url + `&filename=${encodeURIComponent(curSong.title)}.mp4`;

    const {config, fs} = RNFetchBlob;
    let MusicDir = fs.dirs.MusicDir; // this is the pictures directory. You can check the available directories in the wiki.
    let options = {
      fileCache: false,
      addAndroidDownloads: {
        useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        notification: true,
        // this is the path where your downloaded file will live in
        path:
          MusicDir +
          '/' +
          curSong.title +
          ' mp_' +
          Math.floor(new Date().getTime() / 1000) +
          '.mp3',
        appendExt: 'mp3',
      },
    };

    config(options)
      .fetch('GET', URL)
      .then(res => {
        console.log('AAAAA : ', res.path());
        if (Platform.OS == 'android') {
          ToastAndroid.show('Downloading this file', ToastAndroid.SHORT);
        }
      })
      .catch(err => {
        console.log('ERR MUSIC : ', err);
      });
  };

  scanHandle = async () => {
    // let i = await getLyric('ZWBW6WE8');
    // console.log('Handle: ', store.showPlayMusicModal);
    return;
    const {config, fs} = RNFetchBlob;
    let temp = await RNFetchBlob.fs.scanFile([
      {path: fs.dirs.MusicDir, mime: 'audio/mpeg'},
    ]);
    console.log('NS list : ', temp);
    // .then((res) => {
    //   console.log('scanHandle : ', res)
    // })
    // .catch((err) => {
    //   // scan file error
    // });
  };

  setRepeatMode = async () => {
    if (isRepeat) {
      await TrackPlayer.setRepeatMode(RepeatMode.Off);
    } else {
      await TrackPlayer.setRepeatMode(RepeatMode.Track);
    }
    setIsRepeat(!isRepeat);
  };

  renderMainContainer = () => {
    return listTrack.map((item, k) => {
      return (
        <View key={k} style={[styles.music_center_form, styles.center]}>
          <Image
            source={{uri: `${item.artwork}`}}
            style={styles.img_music_center}
          />
          <Text
            style={{
              width: width_window * 0.86,
              color: '#fff',
              fontSize: 20,
              marginTop: 20,
              textAlign: 'center',
            }}>
            {item.title}
          </Text>
          <Text
            style={{
              width: width_window * 0.86,
              color: '#fff',
              fontSize: 12,
              marginTop: 5,
              textAlign: 'center',
              opacity: 0.69,
            }}>
            {item.artist}
          </Text>
        </View>
      );
    });
  };

  handledImageScroll = event => {
    if (!onHandleScroll) return;
    // offset current slider
    let offset =
      event.nativeEvent.contentOffset.x /
      event.nativeEvent.layoutMeasurement.width;

    if (offset > playingTrackIdx) {
      if (Math.floor(offset) >= playingTrackIdx + 0.5) this.nextSongHandled();
    } else {
      if (Math.ceil(offset) <= playingTrackIdx - 0.5) this.prevSongHandled();
    }
  };

  handlePressHeart = async () => {
    // const favoriteMusic = await AsyncStorage.getItem('favorite_music_key');
    // let arrFavoriteMusic =
    //   favoriteMusic != null ? JSON.parse(favoriteMusic) : [];
    // if (this.state.dataSongs[this.state.activeSlide].isFavorite) {
    //   let idx = arrFavoriteMusic.indexOf(
    //     this.state.dataSongs[this.state.activeSlide].encodeId,
    //   );
    //   arrFavoriteMusic.splice(idx, 1);
    //   let jsonValue = JSON.stringify(arrFavoriteMusic);
    //   // console.log("jsonValue : ", jsonValue)
    //   await AsyncStorage.setItem('favorite_music_key', jsonValue);
    // } else {
    //   let newFavorMusId = this.state.dataSongs[this.state.activeSlide].encodeId;
    //   if (arrFavoriteMusic.indexOf(newFavorMusId) < 0) {
    //     arrFavoriteMusic.push(
    //       this.state.dataSongs[this.state.activeSlide].encodeId,
    //     );
    //     let jsonValue = JSON.stringify(arrFavoriteMusic);
    //     console.log('jsonValue : ', jsonValue);
    //     await AsyncStorage.setItem('favorite_music_key', jsonValue);
    //   }
    // }
    // let cpyDataSongs = [...listTrack];
    // cpyDataSongs[this.state.activeSlide].isFavorite =
    //   !cpyDataSongs[this.state.activeSlide].isFavorite;
    // this.setState({dataSongs: cpyDataSongs});
  };

  return (
    <View style={styles.container}>
      {/* Loading modal  */}
      <Modal
        animationType="none"
        transparent={true}
        onRequestClose={() => setIsLoading(false)}
        visible={isLoading}>
        <LoadingLottie />
      </Modal>

      {/* Header bar  */}
      <View style={[styles.header, styles.center]}>
        <TouchableOpacity
          style={{left: 10, marginRight: 'auto'}}
          onPress={() => {
            setShowPlayMusicModal(false);
            // return;
          }}>
          <Image
            source={require('../../asset/down-arrow.png')}
            style={styles.header_icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={setRepeatMode}>
          <Image
            source={
              isRepeat
                ? require('../../asset/repeat.png')
                : require('../../asset/random.png')
            }
            style={styles.header_icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.handlePressHeart()}>
          <Image
            source={
              playingTrack
                ? playingTrack.isFavorite
                  ? require('../../asset/red-heart.png')
                  : require('../../asset/heart.png')
                : require('../../asset/heart.png')
            }
            style={styles.header_icon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('../../asset/dots.png')}
            style={styles.header_icon}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.main_container, styles.center]}>
        {/* Music info */}
        <ScrollView
          // scrollEnabled={false}
          contentContainerStyle={{alignItems: 'center'}}
          horizontal
          pagingEnabled
          onScroll={this.handledImageScroll}
          ref={scrollRef}>
          {this.renderMainContainer()}
        </ScrollView>

        {/* Slider component  */}
        <RenderSlider
          widthSlider={width_window * 0.8}
          heightSlider={30}
          showBottomTime={true}
        />
      </View>

      {/* Bottom button  */}
      <View style={styles.bottom_tool}>
        <TouchableOpacity
          onPress={() => this.checkStoragePermissionAnDownload()}>
          <Image
            source={require('../../asset/direct-download.png')}
            style={styles.img_bot_tool}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.prevSongHandled()}>
          <Image
            source={require('../../asset/previous.png')}
            style={styles.img_bot_tool}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            trackState == State.Playing
              ? TrackPlayer.pause()
              : TrackPlayer.play();
          }}
          opacity={0.8}>
          <Image
            source={
              trackState == State.Playing
                ? require('../../asset/pause-button.png')
                : require('../../asset/play.png')
            }
            style={[styles.img_bot_tool, {width: 55, height: 55}]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.nextSongHandled()}>
          <Image
            source={require('../../asset/next.png')}
            style={styles.img_bot_tool}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.scanHandle();
          }}>
          <Image
            source={require('../../asset/list.png')}
            style={styles.img_bot_tool}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const width_window = Dimensions.get('window').width;
const height_window = Dimensions.get('window').height;

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    top: 0,
    flexDirection: 'row',
    width: width_window,
    height: height_window * 0.1,
    backgroundColor: '#fff',
  },

  header_icon: {
    width: 20,
    height: 20,
    padding: 5,
    margin: 10,
  },

  main_container: {
    height: height_window * 0.7,
    width: width_window,
    backgroundColor: 'black',
  },

  music_center_form: {
    width: width_window,
    height: height_window * 0.58,
    // backgroundColor: 'blue'
  },

  img_music_center: {
    width: '86%',
    height: '76%',
    borderRadius: 25,
  },

  bottom_tool: {
    height: height_window * 0.16,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  img_bot_tool: {
    width: 25,
    height: 25,
    padding: 10,
    // margin:10,
  },
});

export default inject('store')(observer(PlayMusicTab));
// export default observer(PlayMusicTab);
