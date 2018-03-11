import React, { Component } from 'react';
import { CLARIFAI_KEY } from '../../secrets'
import Clarifai from 'clarifai'

import {
  AppRegistry,
  Text,
  View,
  ImagePickerIOS,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default class PhotoFromLibrary extends Component {
  constructor() {
    super();
    this.state = { image: null };
    this.handleClarifai = this.handleClarifai.bind(this)
  }

  componentDidMount() {
    this.pickImage();
  }

  pickImage() {
    // openSelectDialog(config, successCallback, errorCallback);
    ImagePickerIOS.openSelectDialog({}, imageUri => {
      console.log(imageUri.replace("file://", ""))
      this.setState({ image: imageUri });
    }, error => console.error(error));
  }

  handleClarifai() {
    const clarifai = new Clarifai.App({
      apiKey: CLARIFAI_KEY.apiKey
    });

    process.nextTick = setImmediate; // RN polyfill

    const data = this.state.image;
    const url =
      "https://i.pinimg.com/736x/ba/02/d5/ba02d550c134b26f35cb55d116453bba--beautiful-mind-beautiful-night-sky.jpg";

    clarifai.models
      .predict(Clarifai.GENERAL_MODEL, url)
      .then(res => {
        console.log(res.outputs[0].data);
        this.setState({ ...this.state, words: res.outputs[0].data });
        console.log("CLARIFAI STATE", this.state);
      })
      .catch(Error);

    clarifai.models
      .predict("eeed0b6733a644cea07cf4c60f87ebb7", url)
      .then(res => {
        console.log(res.outputs[0].data.colors);
        this.setState({
          ...this.state,
          colors: res.outputs[0].data.colors
        });
        console.log("CLARIFAI STATE", this.state);
      })
      .catch(Error);
  }

  render() {
    console.log('STATE', this.state)
    return (
      <View style={{ flex: 1 }}>
        {this.state.image &&
          <View style={{ flex: 1 }}>
          <Image style={{ flex: 1 }} source={{ uri: this.state.image }} />

          <TouchableOpacity
          style={styles.button}
          onPress={this.handleClarifai}
        >
          <Text style={styles.text}> Make Your Constellation </Text>
        </TouchableOpacity>
          </View>
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
    padding: 10,
    top: 380,
    left: 100,
    position: 'absolute'
  },
  text: {
    color: '#3f348c',
    fontFamily: 'Arial'
  }
})
