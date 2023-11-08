import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';

import PlayMusicTab from './PlayMusicTab';
import '../API/ZingMp3Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getSong} from '../DataBase/Realm';
import {store} from '../Store/MobxStore';
import {observer} from 'mobx-react';
// import LoadingLottie from './LoadingLottie';
// import MusicFiles from 'react-native-get-music-files';
// import RNFetchBlob from 'rn-fetch-blob'
// import messaging from '@react-native-firebase/messaging';

const DATA_SLIDE = [
  {
    uri: 'https://mondaycareer.com/wp-content/uploads/2020/11/background-%C4%91%E1%BA%B9p-3-1.jpg',
    description: 'Light Triangle Background',
  },
  {
    uri: 'https://brandpacks.com/wp-content/uploads/edd/2018/07/live-music-poster-templates.jpg',
    description: 'Rock Music Background',
  },
  {
    uri: 'https://img.freepik.com/free-vector/seamless-background-with-different-cartoon-musical-insrtuments-music-art-colors-are-separate-groups_300579-157.jpg?w=2000',
    description: 'Musical Seamless Background',
  },
  {
    uri: 'https://wallpaperaccess.com/full/3687333.jpg',
    description: 'Beethoven Background',
  },
  {
    uri: 'https://images.vexels.com/content/205611/preview/jazz-live-poster-template-b2519a.png',
    description: 'MUsic Equalized Background',
  },
];

class HomeMusic extends Component {
  scrollRef = React.createRef();

  constructor(prop) {
    super(prop);
    this.state = {
      activeSlide: 0,
      time_count: 0,
      loading: false,
      text_input: '',
      list_id_songs: [
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
      ],
      recentMusicData: [],
    };
  }

  componentDidMount() {
    const TIME_MAX = 8;
    this._interval = setInterval(() => {
      this.setState(prev => ({
        time_count: prev.time_count >= TIME_MAX ? 0 : prev.time_count + 1,
      }));
      if (this.state.time_count === TIME_MAX)
        this.scrollRef.current.scrollTo({
          animatde: true,
          x:
            this.state.activeSlide + 1 >= DATA_SLIDE.length
              ? 0
              : (this.state.activeSlide + 1) * width_window,
          y: 0,
        });
    }, 1000);

    this.getAsyncStorageData();
  }

  unSubFocus = this.props.navigation.addListener('focus', () => {
    this.getAsyncStorageData();
  });

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  getAsyncStorageData = async () => {
    try {
      const recentMusic = await AsyncStorage.getItem('recent_music_key');
      let arrRecentMusic = recentMusic != null ? JSON.parse(recentMusic) : [];
      this.setState({recentMusicData: arrRecentMusic.reverse()});
    } catch (err) {
      console.log(err);
    }
  };

  setModalVisible = value => {
    this.getAsyncStorageData();
    this.setState({modalVisible: value});
  };

  showList = () => {
    return this.state.recentMusicData.map((item, idx) => {
      return this.renderItemList(item, item.encodeId + idx.toString());
    });
  };

  renderItemList = (item, key) => {
    return (
      <TouchableOpacity
        key={key}
        style={[styles.center, styles.list_item]}
        onPress={() => {
          async function handle() {
            console.log('item ', item);
            await store.resetMusic();
            await store.addMusic(item.encodeId);
            await store.setShowPlayMusicModal(true);
          }
          handle();
        }}
        activeOpacity={0.9}>
        <Image
          source={require('../../asset/music.png')}
          style={styles.list_item_img}
        />
        <View>
          <Text style={[styles.text, styles.item_text_song]}>
            {item.title}{' '}
          </Text>
          <Text style={[styles.text, styles.item_text_audit]}>
            {item.artist}
          </Text>
        </View>
        <TouchableOpacity style={styles.item_more_info}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/7291/7291005.png',
            }}
            style={styles.item_more_info}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  listImageSlide = () => {
    return DATA_SLIDE.map((item, index) => {
      return (
        <View
          key={index}
          style={[styles.center, {justifyContent: 'flex-start'}]}>
          <View>
            <Image source={{uri: item.uri}} style={[styles.image]} />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                margin: 2,
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              {DATA_SLIDE.map((i, k) => {
                return (
                  <Text
                    key={k}
                    style={
                      k == this.state.activeSlide
                        ? {color: '#fff'}
                        : {color: '#ccc'}
                    }>
                    ●
                  </Text>
                );
              })}
            </View>
          </View>
          <Text style={{color: '#fff', fontSize: 14, marginBottom: 5}}>
            {item.description}
          </Text>
        </View>
      );
    });
  };

  handleScroll = event => {
    // console.log(Math.floor(event.nativeEvent.contentOffset.x / width_window));
    this.setState({
      activeSlide: Math.ceil(event.nativeEvent.contentOffset.x / width_window),
      time_count: 0,
    });
  };

  handleSearch = async () => {
    try {
      let template = this.state.text_input;
      if (template !== '') {
        // get all ID song
        let music_list = await findMusic(template);
        console.log(music_list);

        this.setState({list_id_songs: music_list, text_input: ''});
        // console.log(this.state.list_id_songs)
        this.setModalVisible(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  onFavoristMusic = async () => {
    const favoriteMusic = await AsyncStorage.getItem('favorite_music_key');
    let arrFavoriteMusic =
      favoriteMusic != null ? JSON.parse(favoriteMusic) : [];

    // console.log(arrFavoriteMusic)
    this.setState({list_id_songs: arrFavoriteMusic, modalVisible: true});
  };

  render() {
    return (
      <View style={styles.container}>
        {/* Play music modal   */}
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // console.log("Modal had been closed!!")
            this.setModalVisible(false);
          }}>
          <PlayMusicTab Parent={this} ID_SONG={this.state.list_id_songs} />
        </Modal> */}

        <ScrollView
          style={styles.scroll_view}
          contentContainerStyle={[styles.container_scroll]}>
          {/* Auto slide img  */}
          <ScrollView
            pagingEnabled
            horizontal
            contentContainerStyle={styles.top_box}
            onScroll={this.handleScroll}
            ref={this.scrollRef}>
            {this.listImageSlide()}
          </ScrollView>

          {/* Search area  */}
          <View style={styles.search_space}>
            {/* <TextInput
              style={styles.input_text}
              onSubmitEditing={() => {
                this.handleSearch();
              }}
              onChangeText={text => this.setState({text_input: text})}
              placeholder="Search..."
            /> */}
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Screen_Search', {
                  screen: 'Screen_Home',
                });
              }}>
              <Image
                source={require('../../asset/search.png')}
                style={styles.search_icon}
              />
            </TouchableOpacity>
          </View>

          {/* Mid button  */}
          <View style={[styles.middle_box]}>
            <View style={[styles.mid_left_box, styles.center]}>
              <TouchableOpacity
                style={styles.center}
                activeOpacity={0.8}
                onPress={() => getSong('ZW9CF877')}>
                <Image
                  source={{
                    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Itunes-music-app-icon.png/480px-Itunes-music-app-icon.png',
                  }}
                  style={[styles.menu_icon, {borderRadius: 20}]}
                />
                <Text style={[styles.text_menu_icon]}>My Musics</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.mid_mid_box, styles.center]}>
              <TouchableOpacity
                style={styles.center}
                activeOpacity={0.8}
                onPress={() => {
                  let listIdSongs = this.state.list_id_songs;
                  console.log('listIdSongs ', listIdSongs);
                  async function handle() {
                    await store.resetMusic();
                    await store.addArrMusic(listIdSongs);
                    await store.setShowPlayMusicModal(true);
                  }
                  handle();
                }}>
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/HQm_x5ZH-Y61Ca6Q8_TJLmkROyW4yso6DjRxqBaf3Y7yO1yfAyWkmyB5Cry5GNBx45PI=w512-h512',
                  }}
                  style={[styles.menu_icon, {borderRadius: 20}]}
                />
                <Text style={[styles.text_menu_icon]}>Play Musics</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.mid_right_box, styles.center]}>
              <TouchableOpacity
                style={styles.center}
                activeOpacity={0.8}
                onPress={() => this.onFavoristMusic()}>
                <Image
                  source={{
                    uri: 'data:image/jpeg;base64,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',
                  }}
                  style={[styles.menu_icon, {borderRadius: 20}]}
                />
                <Text style={[styles.text_menu_icon]}>Favorist Musics</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent listen music  */}
          <View style={[styles.bottom_box, styles.center]}>
            {this.state.recentMusicData.length ? (
              <Text
                style={[
                  styles.text,
                  {
                    color: '#fff',
                    paddingTop: 10,
                    paddingLeft: 12,
                    alignSelf: 'flex-start',
                  },
                ]}>
                Recent Musics
              </Text>
            ) : null}

            {this.showList()}
          </View>
        </ScrollView>
        {/* <Modal onRequestClose={() => this.setState({loading: false})} visible={this.state.loading}>
        <LoadingLottie />
      </Modal> */}
      </View>
    );
  }
}

let height_window = Dimensions.get('window').height;
let width_window = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  scroll_view: {},

  container_scroll: {
    paddingBottom: width_window * 0.32,
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  top_box: {
    height: (height_window / 12) * 5,
  },

  middle_box: {
    height: (height_window / 12) * 2,
    backgroundColor: '#000',
    flexDirection: 'row',
  },

  mid_left_box: {
    flex: 1,
  },

  mid_mid_box: {
    flex: 1,
  },

  mid_right_box: {
    flex: 1,
  },

  bottom_box: {
    flexDirection: 'column',
    paddingLeft: 10,
    marginBottom: 15,
  },

  search_space: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: width_window * 0.08,
    height: height_window * 0.08,
    height: 35,
    top: width_window * 0.03,
    right: width_window * 0.03,
    position: 'absolute',
    // backgroundColor: '#fff',
    borderRadius: 15,
  },

  input_text: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
    height: 35,
    width: width_window * 0.65,
    marginLeft: 15,
    fontSize: 13.5,
  },

  search_icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  text: {
    fontSize: 15,
    fontWeight: 'normal',
    fontFamily: 'Arial',
    width: width_window * 0.63,
  },

  text_menu_icon: {
    color: '#fff',
    fontSize: 13,
  },

  image: {
    width: width_window,
    height: height_window * 0.38,
    // minWidth: '100%',
    // minHeight: '80%',
    marginBottom: 1,
  },

  menu_icon: {
    width: 'auto',
    height: 'auto',
    minHeight: '59%',
    minWidth: '59%',
    marginBottom: 2,
  },

  list_item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    marginTop: 5,
    width: '95%',
    height: 80,
    borderRadius: 20,
  },

  list_item_img: {
    width: 50,
    height: 50,
    margin: 15,
  },

  item_text_song: {
    color: '#000',
    marginBottom: 5,
  },

  item_text_audit: {
    fontSize: 12,
  },

  item_more_info: {
    width: 50,
    height: 50,
    marginLeft: 'auto',
  },
});

export default observer(HomeMusic);
