import {action, computed, makeObservable, observable} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Alert} from 'react-native';
import TrackPlayer from 'react-native-track-player';

class MobxStore {
  // favoriteMusicList = [];
  playList = [];
  showPlayMusicModal = false;
  shouldResetPlayingModal = false;

  constructor() {
    makeObservable(this, {
      // favoriteMusicList: observable,
      // addFavoriteMusic: action,
      // removeFavoriteMusic: action,
      // getFavoriteMusicList: computed,

      playList: observable,
      addMusic: action,
      addArrMusic: action,
      removeMusic: action,
      resetMusic: action,
      getPlaylist: computed,

      shouldResetPlayingModal: observable,
      setShouldResetPlayingModal: action,

      showPlayMusicModal: observable,
      setShowPlayMusicModal: action,
    });
  }

  addMusic = async data => {
    // Music exist in playlist
    if (this.playList.indexOf(data) >= 0) return;

    let CUR_DATA = [];
    let push_obj = await getTrackFromID(data);
    if (push_obj?.success) CUR_DATA.push(push_obj);

    if (!push_obj?.success) {
      this.setShowPlayMusicModal(false)
      Alert.alert('Thông báo', 'Chưa tải được bài hát. Thử lại', [
        {
          text: 'Thử lại',
          onPress: () => {
            this.addMusic(data);
          },
        },
        {
          text: 'Hủy',
          onPress: () => {
            setShowPlayMusicModal(false);
          },
        },
      ]);
      return
    }
    
    TrackPlayer.add(CUR_DATA);

    this.playList = [...this.playList, data];
    this.setShowPlayMusicModal(true)
  };

  addArrMusic = async arrSong => {
    let CUR_DATA = [];

    for (let item of arrSong) {
      // Music exist in playlist
      if (this.playList.indexOf(item) >= 0) continue;

      //else
      this.playList.push(item);
      let push_obj = await getTrackFromID(item);
      if (push_obj?.success) CUR_DATA.push(push_obj);
    }

    if (CUR_DATA.length < 1) {

    } else {
      TrackPlayer.add(CUR_DATA);
      try {
        const recentMusic = await AsyncStorage.getItem('recent_music_key');
        let arrRecentMusic = recentMusic != null ? JSON.parse(recentMusic) : [];
        arrRecentMusic = arrRecentMusic.concat(CUR_DATA);
        let arrRecentMusicCp = [];
        for (let i in arrRecentMusic) {
          let idx = arrRecentMusicCp
            .map(item => item.encodeId)
            .indexOf(arrRecentMusic[i].encodeId);
          if (idx < 0) {
            arrRecentMusicCp.push(arrRecentMusic[i]);
          }
        }
        arrRecentMusic = arrRecentMusicCp;

        if (arrRecentMusic.length <= 5) {
          let jsonValue = JSON.stringify(arrRecentMusic);
          await AsyncStorage.setItem('recent_music_key', jsonValue);
        } else {
          arrRecentMusic.splice(0, arrRecentMusic.length - 5);
          let jsonValue = JSON.stringify(arrRecentMusic);
          await AsyncStorage.setItem('recent_music_key', jsonValue);
        }
      } catch (err) {
        return Alert.alert('Thông báo lỗi', err);
      }
    }
  };

  removeMusic = data => {
    this.playList = this.playList.filter(
      item => item.encodeId != data.encodeId,
    );
  };

  resetMusic = () => {
    this.playList = [];
    TrackPlayer.reset();
  };

  get getPlaylist() {
    return this.playList;
  }

  setShowPlayMusicModal = status => {
    this.showPlayMusicModal = status;
  };

  setShouldResetPlayingModal = status => {
    this.shouldResetPlayingModal = status;
  };
}
export const store = new MobxStore();
export const CounterStoreContext = React.createContext(store);
export const useCounterStore = () => React.useContext(CounterStoreContext);
