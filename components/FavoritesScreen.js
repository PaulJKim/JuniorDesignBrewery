/*
* Favorites Screen from the Family Friendly Brewery Tracker
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
import _ from 'lodash';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Footer, Container, List, ListItem } from 'native-base';
import firebaseApp from '../firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import geolib from 'geolib'
import {  Constants, Location, Permissions } from 'expo';
import { getFavorites } from '../lib/FirebaseHelpers'
import { BreweryCard } from './BreweryCard'


export class FavoritesScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Favorites",
        headerStyle:  { backgroundColor: "#2196F3", },
        headerTitleStyle: { color: "#FFFFFF" },
        headerTintColor: "blue"
    });

    constructor(props) {
        super(props);
        this.state = {
            favorites: null,
            location: {
                lng: 0,
                lat: 0,
            },
        }
        global.main = true;
    }

    componentDidMount() {
        getFavorites().then((favorites) => {
          this.setState({favorites: favorites})
        })
        this._getLocationAsync()
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        let location = await Location.getCurrentPositionAsync({});
        this.setState({location: {lat: location.coords.latitude, lng: location.coords.longitude}});
    }

    render() {
        return (
            <Container>
            <Spinner overlayColor={"rgba(0, 0, 0, 0.3)"}
                        color={"rgb(66,137,244)"}
                        visible={(this.state.favorites == null)}
                        textStyle={{color: '#000000'}} />
            <View style={{flex: 1, backgroundColor:'white'}}>
                {this.renderContent()}
            </View>
            <Footer style={{width: '100%'}}>
                {this.props.renderTabs()}
            </Footer>
            </Container>
        )
    }

    renderContent() {
        if(this.state.favorites != null && this.state.favorites.length == 0) {
            return(
                <View style={{height:'100%', width:'100%', alignContent:'center', alignItems:'center', backgroundColor:'white', display:'flex'}}>
                <View style={{flex:1}}/>
                <Text style={{textAlign: 'center', flex:1}}>No Favorites Yet!</Text>
                </View>
            )
        }
        return (
            <ScrollView>
                <List style={styles.listStyle}>
                    {this.renderFavoritesList()}
                </List>
            </ScrollView>
        );
    }

    renderFavoritesList() {
        var t = this;
        if(this.state.favorites != null) {
            this.state.favorites.sort(function(a, b){
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })
        } else {
            return;
        }
        return _.map(this.state.favorites, (fav) => {
                return (
                  <BreweryCard
                    curBrew = {fav}
                    curBrewName = {fav.name}
                    navigation = {this.props.navigation}
                    curBrewDist = {(this.state.location.lat || this.state.location.lng)
                                  ? '' + Number(geolib.getDistance({latitude: this.state.location.lat, longitude: this.state.location.lng},
                                  {latitude: fav.latitude, longitude: fav.longitude}) * 0.000621371).toFixed(2) + ' miles': ' no location data'}
                    location = {fav.city + ', ' + fav.state}
                    curBrewRating = {fav.rating}
                  />
                )
            })
    }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  listStyle: {
    flex: 1,
    backgroundColor: "#fff",
    width: '100%'
  }
})
