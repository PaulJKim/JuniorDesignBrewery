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
import { getBreweryReviews } from '../lib/FirebaseHelpers';
import { getAllCurrentReviews } from '../lib/FilterHelpers';

var reviewsMap = {};
export class MapScreen extends React.Component {
    breweries;

    constructor(props) {
        super(props);
        this.state = {
            query: "",
            breweries: [],
            filters: [],
            lat: 0,
            lng: 0,
            mapVisible: true,
            selectedBrewery: null,
            loading: false
        }
        if(global.ulat == null || global.ulong == null) {
            global.ulat = 0;
            global.ulong = 0;
        }
        global.main = true;
        if(global.mapVisible == null) {
            global.mapVisible = true;
        }
        if (global.breweries == null) {
            global.breweries = [];
        }
        if (global.breweries.length == 0) {
            this.searchLocalBreweries();
        }
        this.mapsApiKey = Expo.Constants.manifest.android.config.googleMaps.apiKey;

        console.log(this.mapsApiKey);
    }

    componentDidMount() {
        this.setState({breweries: global.breweries, lat: global.lat, lng: global.lng});
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        let location = await Location.getCurrentPositionAsync({});
        this.state.lat = location.coords.latitude;
        this.state.lng = location.coords.longitude;
        global.ulat = location.coords.latitude;
        global.ulong = location.coords.longitude;
        global.lat = location.coords.latitude;
        global.lng = location.coords.longitude;
    }


    render() {
        return (
            <Container>
                <Spinner overlayColor={"rgba(0, 0, 0, 0.3)"}
                        color={"rgb(66,137,244)"}
                        visible={this.state.loading}
                 />
                <View style={{flex: 1, backgroundColor:'white', flexDirection:'column'}}>
                    {global.mapVisible && this.state.lat != null && this.state.lng != null && this.state.lat != 0 &&
                      <MapView style={styles.map}

                        region={{latitude: this.state.lat,
                        longitude: this.state.lng,
                        latitudeDelta: 0.6,
                        longitudeDelta: 0.6,}}
                        >

                        {this.renderMapViewMarkers()}

                        <MapView.Marker
                                coordinate={{latitude: global.lat, longitude: global.lng}}
                                name={"Your Location"}
                                image={current_location}
                            ></MapView.Marker>

                      </MapView>}
                    {!global.mapVisible && this.state.filters.length == 0 &&
                        <ScrollView style={{marginTop: 60}}>
                        <List style={styles.listStyle}>
                                {this.renderListView()}
                            <List>
                            </List>
                        </List>
                        </ScrollView>
                    }

                    {!global.mapVisible && this.state.filters.length != 0 &&
                        <ScrollView style={{marginTop: 90}}>
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
                        <ModalDropdown style={{marginRight: 20}}
                                       dropdownStyle = {{flexDirection:'row', height:150}}
                                       dropdownTextStyle={{fontWeight:'bold', fontSize:16, color:'black'}}
                                       options={['Distance', 'Rating', 'Strollers', 'K-6', 'Teens Allowed', 'Pet Friendly']}
                                       onSelect = {(index, value) => {this._filterSelect(value)}}>
                        <Icon style={{color:"#4286f4"}} name="md-options"/>
                        </ModalDropdown>
                        <Button style={styles.searchButton} title="Search" onPress={this.search.bind(this)}></Button>
                    </View>

                    {this.state.filters.length != 0 && 
                        <View style={styles.selectedFilters}>
                            {this.renderSelectedFilters()}                        
                        </View>
                    }

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
                                              ? '' + Number(geolib.getDistance({latitude: global.ulat, longitude: global.ulong},
                                              {latitude: this.state.selectedBrewery.latitude, longitude: this.state.selectedBrewery.longitude}) * 0.000621371).toFixed(2) + ' miles': ' no location data'}
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

    // Method for processing filter result
    passFilter(filter, reviews) {
        if (filter === 'Strollers') {
            var count = 0;

            _.each(reviews, function(review) {
                if (review.StrollerKids) {
                    count = count + 1;
                }
            });

            return (count/reviews.length) > .5;
        } else if (filter === 'Rating') {
            var ratingTotal = 0;

            _.each(reviews, function(review) {
                ratingTotal = ratingTotal + review.overallRating;
            });

            return (ratingTotal/reviews.length) > 4;
        }
    }

    // Handler for selecting a filter
    _filterSelect(value) {
        if (this.state.filters.indexOf(value) == -1) {
            this.state.filters.push(value);

            // References to 'this' for anonymous contexts 
            var filters = this.state.filters;
            var currentBreweries = this.state.breweries;
            var passFilter = this.passFilter;
            var filteredBreweries = [];

            _.each(filters, function(filter) {
                _.each(currentBreweries, function(breweryToKeep) {
                    getBreweryReviews(breweryToKeep.placeId).then(reviews => {
                        if (passFilter(filter, reviews)) {
                            filteredBreweries.push(breweryToKeep);
                        }
                    });
                });
            });

            console.log(filteredBreweries);
            this.setState({breweries: filteredBreweries});
        }
    }

    // Handler for deselecting a filter
    _filterDeselect(value) {
        this.state.filters = this.state.filters.filter(function(e) { return e !== value });
        this.setState({});
    }

    renderSelectedFilters() {
        if (this.state.filters) {
            return (
                _.map(this.state.filters, (val) => {
                    return (
                        <View style={styles.selectedFilterBox}>
                            <Text>{val}</Text>
                            <TouchableOpacity onPress={() => { this._filterDeselect(val); }}>
                                <Icon style={{color:"#4286f4", marginLeft: 5}} name="md-close"/>
                            </TouchableOpacity>
                        </View>
                    )
                })
            )
        }
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
                            onPress = {() => this.setState({selectedBrewery : val})}
                        />
                    )
                })
            )
        }
    }

    search() {
        this.setState({loading:true});
        console.log('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.query + '&key=' + this.mapsApiKey);
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.query + '&key=' + this.mapsApiKey)
            .then((r) => r.json().then((d) => {
                location = {};

                this.state.lat = d.results[0].geometry.location.lat;
                this.state.lng = d.results[0].geometry.location.lng;
            })).then(() => {
                this.searchBreweries(this.state.lat, this.state.lng)
            }).catch((error) => {
                console.log(error)
            })
    }

    searchLocalBreweries() {
        this._getLocationAsync().then(() => {
            this.searchBreweriesOnPress(this.state.lat, this.state.lng);
        });
    }

    searchBreweriesOnPress(lat, lng) {
        this.setState({loading:true});
        fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/'
                    + 'json?key=' + this.mapsApiKey
                    + '&location=' + `${lat}` + ',' + `${lng}`
                    + '&radius=50000&name=brewery&keyword=brewery')
            .then((response) => response.json().then(data => {
                res = []
                var results = JSON.parse(JSON.stringify(data)).results;
                results.forEach((val) => {
                    var b = new Brewery();

                    b.merge(val);
                    res.push(b);
                });
                global.breweries = res;
                this.setState({breweries: res, lat: lat, lng: lng, loading:false});
            }));
    }

    searchBreweries(lat, lng) {
        fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/'
                    + 'json?key=' + this.mapsApiKey
                    + '&location=' + `${lat}` + ',' + `${lng}`
                    + '&radius=50000&name=brewery&keyword=brewery')
            .then((response) => response.json().then(data => {
                res = []
                var results = JSON.parse(JSON.stringify(data)).results;
                results.forEach((val) => {
                    var b = new Brewery();
                    b.merge(val);
                    res.push(b);
                });
                global.breweries = res;
                this.setState({breweries: res, loading:false});
            }));
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
                  curBrewDist = {(this.state.lat || this.state.lng)
                                ? '' + Number(geolib.getDistance({latitude: global.ulat, longitude: global.ulong},
                                {latitude: b.latitude, longitude: b.longitude}) * 0.000621371).toFixed(2) + ' miles': ' no location data'}
                  //curBrewLocation =
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
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start'
  },
  searchButton: {
      flex: 15,
  },
  selectedFilters: {
      position: 'absolute',
      marginTop: 60,
      marginLeft: 15,
      marginRight: 15,
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      justifyContent: 'flex-start'
  },
  selectedFilterBox: {
      flex: 1, 
      flexDirection: 'row', 
      minWidth: 100, 
      maxWidth: 105, 
      marginLeft: 2,
      marginRight: 2,
      marginBottom: 5,
      height: 25,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      borderRadius: 25,
      justifyContent: 'center'
  }
})
