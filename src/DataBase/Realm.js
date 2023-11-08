// import React from 'react';
import Realm from 'realm';
import {createRealmContext} from '@realm/react';

// Define object model
const Song = {
  name: 'Song',
  properties: {
    encodeId: 'string',
    title: 'string',
    artist: 'string',
    artwork: 'string',
    success: {type: 'bool', default: false},
    isFavorite: {type: 'bool', default: false},
  },
  primaryKey: 'encodeId',
};

// Create a configuration object
const realmConfig = {
  path: 'UserDatabase.realm',
  schema: [Song],
  schemaVersion: 1,
};

// const realm = new Realm(realmConfig);
// const {RealmProvider, useRealm, useObject, useQuery} =
//   createRealmContext(realmConfig);

export const addSong = async song => {
  if (!song.encodeId) return;
  try {
    let realm = await Realm.open(realmConfig);
    realm.write(() => {
      realm.create(
        'Song',
        {
          encodeId: song.encodeId,
          title: song.title,
          artist: song.artist,
          artwork: song.artwork,
          success: song.success,
          isFavorite: song.isFavorite,
        },
        'modified',
      );
    });
  } catch (err) {
    console.log('ERR ADD :', err);
  }
};

export const updateSong = song => {
  const realm = useRealm();
  const curSong = useObject(Song, song.encodeId);
  if (curSong) {
    realm.write(() => {
      (curSong.encodeId = song.encodeId),
        (curSong.title = song.title),
        (curSong.artist = song.artist),
        (curSong.artwork = song.artwork),
        (curSong.success = song.success),
        (curSong.isFavorite = song.isFavorite);
    });
  }
};

export const getSong = async id => {
  try {
  let realm = await Realm.open(realmConfig);
  let curSong = realm.objectForPrimaryKey('Song', id);

  console.log('curSong : ', curSong);
  } catch(e){
    console.log(e)
  }
};

export const deleteSong = async id => {
  try {
    let realm = await Realm.open(realmConfig);
    let curSong = realm.objectForPrimaryKey('Song', id);

    realm.write(() => {
      realm.delete(curSong);
    });
    } catch(e){
      console.log(e)
    }
};
