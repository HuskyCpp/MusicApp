import React,{useState} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
const {width, height} = Dimensions.get('window');
import Loading from './LoadingLottie';
import {observer} from 'mobx-react';
import CONST from './Const';
import auth from '@react-native-firebase/auth';

export const FloatBottomTab = () => {
  const [startStop, setStartStop] = useState(false);
  return (
    <View
      style={{
        position: 'absolute',
        width: width * 0.86,
        height: height * 0.08,
        backgroundColor: '#ccc',
        bottom: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() =>
          setStartStop((val) => {
            return !val;
          })
        }>
        <Text>{startStop ? 'Start' : 'Stop'}</Text>
      </TouchableOpacity>
    </View>
  );
};