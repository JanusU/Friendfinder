import React from 'react';
import { StyleSheet, Text, View , Modal, TouchableHighlight, TextInput, Slider} from 'react-native';
import {MapView, Constants, Location, Permissions } from 'expo';

const api = 'localhost:3000/friends/register/';
const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

export default class App extends React.Component {
  state = {
    userName: "Username",
    location: { coordinates: {longitude: 0, latitude: 0}},
    distance: 0,
    personlist: [],
    modalVisible: false,
  };

  componentDidMount(){
    Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
  }

  locationChanged = (location) => {
    region = {
      longitude: location.coordinates.longitude,
      latitude: location.coordinates.latitude,
      latitudeDelta: 0.8,
      longitudeDelta: 0.05,
    },
      this.setState({ location, region })
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  getFriends = () => {
    return fetch(""+api+this.state.distance, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: this.state.userName,
        loc: {
        type: 'Point',
          coordinates: [this.state.location.coordinates.longitude, this.state.location.coordinates.latitude]
        }
      })
    })
    .then((res) => res.json())
    .then((resJson) => {
      this.setState({personlist: resJson})
    });
  }

  onMapLayout = () => this.map.fitToElements(true);
  
  render() {
    return (
      <View style={{ flex: 1}}>
      <MapView
         ref="map"
          mapType="terrain"
          style={{flex: 0.7}}
          region={this.state.region}
          showsUserLocation={true}
      >
      {this.state.personlist.map(marker => (
        <MapView.Marker
           key={person.userName}
           coordinates={{
             latitude: person.location.coordinates[0],
             longitude: person.location.coordinates[1]
           }}
           title={person.userName}
        />
      ))}
      </MapView>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{marginTop: 22}}>
          <View>
            <Text style={{fontSize: 30,borderColor: 'black',borderWidth: 0.5}}>Login Form</Text>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(userName) => this.setState({userName})}
              value={this.state.userName}
            />
            <Slider
            value={1}
            minimumValue = {1}
            maximumValue = {10}
            onSlidingComplete={(value)=>{
              this.setState({distance: value})
            }}
            />
            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
              //registers
              this.getFriends();
            }}>
              <Text style={{fontSize: 30,borderColor: 'black',borderWidth: 0.5}}>Done</Text>
            </TouchableHighlight>

          </View>
         </View>
        </Modal>
        <TouchableHighlight onPress={() => {
          this.setModalVisible(true)
        }}>
          <Text style={{fontSize: 30,borderColor: 'black',borderWidth: 0.5}}>Login</Text>
        </TouchableHighlight>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
