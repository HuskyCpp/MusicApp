import React from 'react';
import {Text, View, Dimensions} from 'react-native';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import Slider from '@react-native-community/slider';

const formartTime = sec => {
  if (sec < 0) sec = 0;
  min_format = Math.floor(sec / 60);
  sec_format = Math.floor(sec - min_format * 60);

  if (sec_format < 10) sec_format = `0${sec_format}`;
  return `${min_format}:${sec_format}`;
};

const toogleSliderScrool = async value => {
  // console.log(value);
  try {
    await TrackPlayer.seekTo(value);
  } catch (err) {
    console.log(err);
  }
};

const RenderSlider = props => {
  const {position, duration} = useProgress(450);

  return (
    <View>
      <Slider
        style={{width: props.widthSlider, height: props.heightSlider}}
        value={position}
        minimumValue={0}
        maximumValue={duration}
        thumbTintColor="#aaa"
        minimumTrackTintColor="#aaa"
        maximumTrackTintColor="#ccc"
        onSlidingComplete={value => toogleSliderScrool(value)}
      />
      {props?.showBottomTime ? (
        <View
          style={{
            width: props.widthSlider,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
          <Text style={{color: '#fff', fontSize: 12}}>
            {formartTime(position)}
          </Text>
          <Text style={{color: '#fff', fontSize: 12}}>
            {formartTime(duration - position)}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
export default RenderSlider;
