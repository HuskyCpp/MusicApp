import {JSHash, JSHmac, CONSTANTS} from 'react-native-hash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addSong} from '../DataBase/Realm.js';

const CTIME = '1693926639';
const VERSION = '1.9.67';
const SECRET_KEY = '10a01dcf33762d3a204cb96429918ff6';
const API_KEY = '38e8643fb0dc04e8d65b99994d3dafff';

let sid = '';
let sid1 = '';

getData = async path => {
  try {
    const response = await fetch(path);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

buildSid = async idSong => {
  let sha256Str;
  await JSHash(
    'ctime=' + CTIME + 'id=' + idSong,
    CONSTANTS.HashAlgorithms.sha256,
  )
    .then(hash => {
      sha256Str = hash;
    })
    .catch(e => console.log(e));

  await JSHmac(
    '/song/get-song-info' + sha256Str,
    SECRET_KEY,
    CONSTANTS.HmacAlgorithms.HmacSHA512,
  )
    .then(hash => {
      sid = hash;
    })
    .catch(e => console.log(e));

  return sid;
};

buildLyricSid = async id => {
    let sha256Str;
    await JSHash(
      'ctime=' + CTIME +'id=' + id + 'version=' + VERSION ,
      CONSTANTS.HashAlgorithms.sha256,
    )
      .then(hash => {
        sha256Str = hash;
      })
      .catch(e => console.log(e));
  
    await JSHmac(
      '/api/v2/lyric/get/lyric' + sha256Str,
      SECRET_KEY,
      CONSTANTS.HmacAlgorithms.HmacSHA512,
    )
      .then(hash => {
        sid1 = hash;
      })
      .catch(e => console.log(e));
  
    return sid1;
  };

getMusicInfo = async id => {
  let res_obj = {};
  await buildSid(id);
  let path = `https://zingmp3.vn/api/song/get-song-info?id=${id}&ctime=${CTIME}&sig=${sid}&api_key=${API_KEY}`;
  console.log(path);
  res_obj = await getData(path);
  console.log('res_obj ', res_obj);

  return res_obj;
};

getLyric = async id => {
    let res_obj = {};
    await buildLyricSid(id);
    let path = `https://zingmp3.vn/api/v2/lyric/get/lyric?id=${id}&BGId=50&ctime=${CTIME}&version=${VERSION}&sig=${sid1}&api_key=${API_KEY}`;
    // console.log(path);
    res_obj = await getData(path);
    console.log(res_obj.msg);
  
    return res_obj;
  };

getTrackFromID = async id => {
  let res_obj = {
    encodeId: id,
    url: 'http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3',
    title: 'Unknown',
    artist: 'Unknown',
    artwork:
      'https://thumbs.dreamstime.com/b/error-rubber-stamp-word-error-inside-illustration-109026446.jpg',
    success: false,
    isFavorite: false,
  };

  const favoriteMusic = await AsyncStorage.getItem('favorite_music_key');
  let arrFavoriteMusic = favoriteMusic != null ? JSON.parse(favoriteMusic) : [];

  try {
    let obj = await JSON.parse(JSON.stringify(await getMusicInfo(id)))?.data;

    let resURL = obj?.streaming?.default['128'];

    res_obj.encodeId = obj?.id;
    res_obj.url = resURL; // 4/9
    res_obj.title = obj?.title;
    res_obj.artist = obj?.artists_names;
    res_obj.artwork = obj?.thumbnail_medium;
    res_obj.success = obj?.streaming?.default ? true : false;
    res_obj.isFavorite = arrFavoriteMusic.indexOf(obj?.id) > -1;
  } catch (e) {
    console.log(e);
  }

  console.log('RES OBJ : ', res_obj);
  await addSong(res_obj);
  return res_obj;
};

findMusic = async template => {
  let code = encodeURIComponent(template);
  let path = `https://zingmp3.vn/api/v2/search/multi?q=${code}&ctime=1656288670&version=1.6.34&sig=94d74157a18612356658a3f6a31fb20e5c116b7c52613725f5e6dfcb4102869ac1400357ddc9055b8f3e216e110199241233d4f4e02a39268afec253f3bc257f&apiKey=88265e23d4284f25963e6eedac8fbfa3`;

  let res = {};
  res = await getData(path);

  let list_song_data = [];

  try {
    list_song_data = Object.values(res.data.songs);
  } catch (err) {
    console.log(err);
  }
  return list_song_data;
};
