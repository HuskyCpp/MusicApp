import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import '../API/ZingMp3Api';
import {store} from '../Store/MobxStore';
import {observer} from 'mobx-react';

class SearchMusic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text_input: '',
      search_data: [],
    };
  }

  handleSearch = async () => {
    try {
      let template = this.state.text_input;
      if (template !== '') {
        // get all song detail
        let music_list = await findMusic(template);
        // console.log(music_list);

        this.setState({
          search_data: music_list,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleChangeText = async str => {
    try {
      await this.setState({text_input: str});
      this.handleSearch();
    } catch (err) {
      console.log(err);
    }
  };

  renderSearchItem = item => {
    return (
      <TouchableOpacity
        style={styles.search_item}
        onPress={() => {
          async function handle() {
            console.log('item :  ', item);
            // store.resetMusic()
            await store.addMusic(item.item.encodeId);
          }
          handle()
        }}>
        <Image
          style={styles.search_item_image}
          source={require('../../asset/search-interface-symbol.png')}
        />
        <View style={styles.search_info}>
          <Text style={{fontSize: 15, width: width * 0.65}}>
            {item.item.title}
          </Text>
          <Text style={{fontSize: 12, width: width * 0.65}}>
            {item.item.artistsNames}
          </Text>
        </View>

        <Image
          style={styles.search_item_image}
          source={{uri: item.item.thumbnail}}
          // source={require('../../asset/music.png')}
        />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.background} />

        {/* Search header  */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <Image
              source={require('../../asset/arrow-left.png')}
              style={styles.search_icon}
            />
          </TouchableOpacity>
          <View style={styles.search_space}>
            <TextInput
              style={styles.input_text}
              onSubmitEditing={() => {
                this.handleSearch();
              }}
              onChangeText={input => this.handleChangeText(input)}
              placeholder="Search..."
            />
            <TouchableOpacity
              onPress={() => {
                this.handleSearch();
              }}>
              <Image
                source={require('../../asset/search-interface-symbol.png')}
                style={styles.search_icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          {this.state.text_input.length > 0 ? (
            <FlatList
              data={this.state.search_data}
              renderItem={item => this.renderSearchItem(item)}
            />
          ) : (
            <View />
          )}
          <TouchableOpacity style={{margin: 15}}>
            <Text style={{color: 'blue', fontSize: 15}}>
              {this.state.text_input !== ''
                ? this.state.search_data.length > 0
                  ? `All results for "${this.state.text_input}" `
                  : `No have result for "${this.state.text_input}" `
                : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: '#ffffff',
    // opacity: 0.3,
  },

  header: {
    width: width,
    height: height * 0.085,
    padding: 12,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#c0c0c0',
  },

  search_space: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: width * 0.82,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
  },

  input_text: {
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-end',
    height: 40,
    width: width * 0.65,
    marginLeft: 15,
    fontSize: 13.5,
  },

  search_icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  search_item: {
    width: width,
    height: height * 0.085,
    paddingHorizontal: 18,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
  },

  search_info: {
    marginLeft: 10,
    marginRight: 'auto',
  },

  search_item_image: {
    width: 35,
    height: 35,
    // marginLeft: 'auto',
  },
});

export default observer(SearchMusic);
