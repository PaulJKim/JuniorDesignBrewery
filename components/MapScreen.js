/*
* Map Screen from the Family Friendly Brewery Tracker
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License version 3 as
* published by the Free Software Foundation;
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
* OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF THIRD PARTY RIGHTS.
* IN NO EVENT SHALL THE COPYRIGHT HOLDER(S) AND AUTHOR(S) BE LIABLE FOR ANY
* CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL DAMAGES, OR ANY DAMAGES
* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*
* ALL LIABILITY, INCLUDING LIABILITY FOR INFRINGEMENT OF ANY PATENTS,
* COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS, RELATING TO USE OF THIS
* SOFTWARE IS DISCLAIMED.
*/

import React from 'react';
import { MapView, Constants, Location, Permissions } from 'expo';
import { StyleSheet, View, Text, TextInput, Image, ScrollView, TouchableOpacity, Button } from 'react-native';
import { Footer, Container, Icon, List, ListItem, SwipeRow, Content, Button as BaseButton} from 'native-base';
import _ from 'lodash';
import Brewery from '../models/Brewery';
import firebaseApp from '../firebase';
import FAB from 'react-native-fab';
import StarRating from 'react-native-star-rating';
import current_location from '../current_location.png';
import ModalDropdown from 'react-native-modal-dropdown';
import { BreweryCard } from './BreweryCard'
import Spinner from 'react-native-loading-spinner-overlay';
import { getBreweries, findLocation, calculateDistance, getLocation } from '../lib/GoogleMapsHelpers';

export class MapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            breweries: [],
            lat: null,
            lng: null,
            mapVisible: true,
            selectedBrewery: null,
            loading: false,
            curLat: null,
            curLng: null
        }
        global.main = true;
        if(global.mapVisible == null) {
            global.mapVisible = true;
        }
        this.mapsApiKey = Expo.Constants.manifest.android.config.googleMaps.apiKey;
    }

    componentDidMount() {
        this.setState({breweries: global.breweries});
        this.searchLocalBreweries();
    }

    render() {
        return (
            <Container>
                <Spinner overlayColor={"rgba(0, 0, 0, 0.3)"}
                        color={"rgb(66,137,244)"}
                        visible={this.state.loading}
                 />
                <View style={{flex: 1, backgroundColor:'white'}}>
                    {global.mapVisible && this.state.lat != null && this.state.lng != null &&
                      <MapView style={styles.map}

                        region={{latitude: this.state.lat,
                        longitude: this.state.lng,
                        latitudeDelta: 0.6,
                        longitudeDelta: 0.6,}}
                        >

                        {this.renderMapViewMarkers()}
                        {
                          this.state.curLat && this.state.curLng &&
                          <MapView.Marker
                                  coordinate={{latitude: this.state.curLat, longitude: this.state.curLng}}
                                  name={"Your Location"}
                                  image={current_location}
                          />
                        }


                      </MapView>}
                    {!global.mapVisible &&
                        <ScrollView style={{marginTop: 60}}>
                        <List style={styles.listStyle}>
                                {this.renderListView()}
                            <List>
                            </List>
                        </List>
                        </ScrollView>
                    }

                    {this.state.selectedBrewery == null && global.mapVisible &&
                        <View style={{bottom: 0, right: 0, position: 'absolute'}}>
                            <FAB
                                buttonColor="blue"
                                iconTextColor="#FFFFFF"
                                onClickAction={this.searchLocalBreweries.bind(this)}
                                visible={true}
                                style={{ position: 'absolute', marginRight: 100}}
                                iconTextComponent={<Icon name="md-pin"/>} />
                        </View>
                    }

                    <View style={styles.searchWrapper}>
                        <TextInput style={styles.search}
                                placeholder="Search"
                                onChangeText={(query) => this.setState({query})}
                                value={this.state.query}
                        ></TextInput>
                        <View style={{flex: 1}}/>
                        <Button style={styles.searchButton} title="Search" onPress={this.search.bind(this)}></Button>
                    </View>
                </View>


                {this.state.selectedBrewery != null && global.mapVisible &&
                    <View style={{bottom:50, position: 'absolute', width:'100%'}}>
                        <View style={{flexDirection:'column'}}>
                            <View style={{flexDirection:'row', justifyContent:"flex-end"}}>
                                <BaseButton rounded style={{backgroundColor:'red', marginRight: 10}} onPress={() => this.setState({selectedBrewery : null})}>
                                    <Icon
                                        style={{color: 'white'}}
                                        type= 'EvilIcons'
                                        name='close'/>
                                </BaseButton>
                            </View>
                            <BreweryCard
                                curBrew = {this.state.selectedBrewery}
                                curBrewName = {this.state.selectedBrewery.name}
                                curBrewRating = {this.state.selectedBrewery.genRating}
                                navigation = {this.props.navigation}
                                curBrewDist = {(this.state.lat || this.state.lng)
                                              ? '' + Number(calculateDistance(this.state.curLat, this.state.curLng, this.state.selectedBrewery.latitude, this.state.selectedBrewery.longitude)).toFixed(2) + ' miles': ' no location data'}
                                location = {this.state.selectedBrewery.city + ', ' + this.state.selectedBrewery.state}
                            />
                        </View>
                    </View>
                }

                <Footer style={{width: '100%'}}>
                    {this.props.renderTabs()}
                </Footer>
            </Container>
        )
    }

    renderMapViewMarkers() {
        if (this.state.breweries) {
            return (
                _.map(this.state.breweries, (val) => {
                    return (
                        <MapView.Marker
                            coordinate={{latitude: val.latitude, longitude: val.longitude}}
                            key={val.latitude + val.longitude}
                            name={val.name}
                            pinColor={'#2196F3'}
                            onPress = {() => this.setState({selectedBrewery : val, lat: val.latitude, lng: val.longitude})}
                        />
                    )
                })
            )
        }
    }

    search() {
        this.setState({loading:true});
        findLocation(this.state.query).then((location) => {
          this.searchBreweries(location.lat, location.lng);
        })
    }

    searchLocalBreweries() {
        this.setState({loading:true});
        getLocation().then((location) => {
            this.searchBreweries(location.latitude, location.longitude);
            this.setState({curLat: location.latitude, curLng: location.longitude});
        });
    }

    searchBreweries(lat, lng) {
      getBreweries(lat, lng, 50000).then((breweries) => {
        this.setState({breweries: breweries, loading: false, lat: lat, lng: lng});
      });
    }

    renderListView() {
        counter = 0;
        if(this.props.sort === "Alphabetical") {
            this.state.breweries.sort(function(a, b){
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })
        }
        else if(this.props.sort === "Distance") {
            this.state.breweries.sort(function(a,b) {
                var x = global.ulat;
                var y = global.ulong;
                var dist1 = geolib.getDistance({latitude: x, longitude: y}, {latitude: a.latitude, longitude: a.longitude});
                var dist2 = geolib.getDistance({latitude: x, longitude: y}, {latitude: b.latitude, longitude: b.longitude});
                return (dist1 < dist2) ? -1 : (dist1 > dist2) ? 1 : 0;
            })
        } else if(this.props.sort === "Rating") {
            this.state.breweries.sort(function(a, b){
                var textA = a.genRating;
                var textB = b.genRating;
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })
        }
        return _.map(this.state.breweries, (b) => {
            counter = counter + 1;
            return (

                <BreweryCard
                  curBrew = {b}
                  curBrewName = {b.name}
                  curBrewRating = {b.genRating}
                  navigation = {this.props.navigation}
                  curBrewDist = {(this.state.curLat && this.state.curLng)
                                ? '' + Number(calculateDistance(this.state.curLat, this.state.curLng, b.latitude, b.longitude)).toFixed(2) + ' miles': ' no location data'}
                  location = {b.city + ', ' + b.state}
                />
            );
        });
    }

    mapToggle() {
        this.setState({mapVisible: !this.state.mapVisible});
        global.mapVisible = !global.mapVisible;
    }
}

const styles = StyleSheet.create({
  listStyle: {
    flex: 1,
    backgroundColor: "#fff",
    width: '100%'
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
  },
  search: {
      height: 40,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      borderRadius: 50,
      flex: 15,
      paddingLeft: 5,
      paddingRight: 5
  },
  searchWrapper: {
      position: 'absolute',
      marginTop: 15,
      marginLeft: 15,
      marginRight: 15,
      flex: 1,
      flexDirection: 'row'
  },
  searchButton: {
      flex: 15,
  }
})
