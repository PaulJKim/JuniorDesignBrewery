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
import { StyleSheet, View, Text, TextInput, Image, ScrollView, TouchableOpacity, Button, Dimensions } from 'react-native';
import { Footer, Container, Icon, List, ListItem, Button as BaseButton} from 'native-base';
import firebaseApp from '../firebase';
import FAB from 'react-native-fab';
import StarRating from 'react-native-star-rating';
import { BreweryCard } from './BreweryCard';
import Spinner from 'react-native-loading-spinner-overlay';
import { getBreweries, findLocation, calculateDistance, getLocation } from '../lib/GoogleMapsHelpers';

export class MapScreen extends React.Component {
    constructor(props) {
        super(props);
        global.mapVisible = true;
        if (global.mapState) {
            this.state = global.mapState;
            this.state.mapVisible = false;
            this.latitudeDelta = this.state.latitudeDelta;
            this.longitudeDelta = this.state.longitudeDelta;
            this.loadedFromMemory = true;
        } else {
            this.state = {
                query: "",
                breweries: [],
                lat: null,
                lng: null,
                mapVisible: true,
                selectedBrewery: null,
                loading: false,
                curLat: null,
                curLng: null,
                latitudeDelta: 0.6,
                longitudeDelta: 0.6,
            }
            this.latitudeDelta = 0.6;
            this.longitudeDelta = 0.6;
            this.loadedFromMemory = false;
        }
        global.main = true;
        this.mapsApiKey = Expo.Constants.manifest.android.config.googleMaps.apiKey;
    }

    componentDidMount() {
        if (!this.loadedFromMemory) {
            this.searchLocalBreweries();
        }
    }

    render() {
        global.mapState = this.state;
        let breweryCardMargin = this.determineBreweryCardMargin();
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
                        latitudeDelta: this.state.latitudeDelta,
                        longitudeDelta: this.state.longitudeDelta}}
                        onRegionChangeComplete={(region) => {
                            this.latitudeDelta = region.latitudeDelta;
                            this.longitudeDelta = region.longitudeDelta;
                        }}
                        >

                        {this.renderMapViewMarkers()}
                        {
                          this.state.curLat && this.state.curLng &&
                          <MapView.Marker
                                  coordinate={{latitude: this.state.curLat, longitude: this.state.curLng}}
                                  name={"Your Location"}
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
                    <View style={{bottom:breweryCardMargin, position: 'absolute', width:'100%'}}>
                        <View style={{flexDirection:'column'}}>
                            <View style={{flexDirection:'row', justifyContent:"flex-end"}}>
                                <TouchableOpacity
                                    style={styles.buttonWrapper}
                                    onPress={() => this.setState({selectedBrewery: null})}
                                >
                                    <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
                                        <Icon
                                            style={{color: 'white', fontSize: 20}}
                                            type= 'EvilIcons'
                                            name='close'
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <BreweryCard
                                curBrew = {this.state.selectedBrewery}
                                curBrewName = {this.state.selectedBrewery.name}
                                curBrewRating = {this.state.selectedBrewery.rating}
                                navigation = {this.props.navigation}
                                curBrewDist = {(this.state.lat || this.state.lng)
                                              ? '' + Number(calculateDistance(this.state.curLat, this.state.curLng, this.state.selectedBrewery.latitude, this.state.selectedBrewery.longitude)).toFixed(2) + ' miles': ' no location data'}
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
                this.state.breweries.map((val) => {
                    return (
                        <MapView.Marker
                            coordinate={{latitude: val.latitude, longitude: val.longitude}}
                            key={val.latitude + val.longitude}
                            name={val.name}
                            pinColor={'#2196F3'}
                            onPress = {() => this.setState({selectedBrewery : val, lat: val.latitude, lng: val.longitude, latitudeDelta: this.latitudeDelta, longitudeDelta: this.longitudeDelta})}
                            image={require('../resources/beer.png')}
                        />
                    )
                })
            )
        }
    }

    determineBreweryCardMargin() {
        const {height, width} = Dimensions.get('window');
        const aspectRatio = height / width;
        if (aspectRatio > 2.0) {
          return 85;
        } else {
          return 50;
        }
    }

    search() {
        this.setState({loading:true});
        findLocation(encodeURI(this.state.query)).then((location) => {
          this.searchBreweries(location.lat, location.lng);
      }).catch(() => {
          this.setState({loading:false});
      });
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
        return this.state.breweries.map((b) => {
            counter = counter + 1;
            return (

                <BreweryCard
                  curBrew = {b}
                  curBrewName = {b.name}
                  curBrewRating = {b.rating}
                  navigation = {this.props.navigation}
                  curBrewDist = {(this.state.curLat && this.state.curLng)
                                ? '' + Number(calculateDistance(this.state.curLat, this.state.curLng, b.latitude, b.longitude)).toFixed(2) + ' miles': ' no location data'}
                />
            );
        });
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
  },
  buttonWrapper: {
      backgroundColor:'red',
      marginRight: 10,
      width: 24,
      height: 24,
      borderRadius:12
  }
})