/*
* Your Reviews Screen from the Family Friendly Brewery Tracker
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
import StarRating from 'react-native-star-rating';
import {  Constants, Location, Permissions } from 'expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { getUserReviews, getUserData } from '../lib/FirebaseHelpers';
import { ReviewCard } from './ReviewCard';

export class YourReviewsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reviews: null,
            location: {
                lat: 0,
                lng: 0,
            },
            user: null
        }
        global.main = true;
    }

    componentDidMount() {
        this._getLocationAsync()
        getUserReviews().then((reviews) => {
            this.setState({reviews: reviews});
        });
        getUserData(firebaseApp.auth().currentUser.uid).then((userData) => {
            this.setState({user: userData});
        });
    }
    
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        let location = await Location.getCurrentPositionAsync({});
        this.state.location.lat = location.coords.latitude;
        this.state.location.lng = location.coords.longitude;
        this.setState({});
    }

    finishedLoadingData() {
        return this.state.reviews != null && this.state.user != null;
    }

    render() {
        return (
            <Container>
            <Spinner overlayColor={"rgba(0, 0, 0, 0.3)"} 
                        color={"rgb(66,137,244)"}
                        visible={this.state.reviews == null} 
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
        if(this.state.reviews != null && this.state.reviews.length == 0 && !this.state.spinnerVisible) {
            return(
                <View style={{height:'100%', width:'100%', alignContent:'center', alignItems:'center', backgroundColor:'white', display:'flex'}}>
                <View style={{flex:1}}/>
                <Text style={{textAlign: 'center', flex:1}}>No Reviews Yet!</Text>
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
        if(this.state.reviews != null) {
            var t = this;
            if(this.props.sort === "Alphabetical") {
                this.state.reviews.sort(function(a, b){
                    var textA = a.breweryName.toUpperCase();
                    var textB = b.breweryName.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                })
            }
            else if(this.props.sort === "Distance" && (this.state.location.lng || this.state.location.lat)) {
                this.state.reviews.sort(function(a,b) {
                    var x = t.state.location.lat;
                    var y = t.state.location.lng;
                    var dist1 = geolib.getDistance({latitude: x, longitude: y}, {latitude: a.latitude, longitude: a.longitude});
                    var dist2 = geolib.getDistance({latitude: x, longitude: y}, {latitude: b.latitude, longitude: b.longitude});
                    return (dist1 < dist2) ? -1 : (dist1 > dist2) ? 1 : 0;               
                })
            } else if(this.props.sort === "Rating") {
                this.state.reviews.sort(function(a, b){
                    var textA = a.overallRating;
                    var textB = b.overallRating;
                    return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
                })
            }
            return _.map(this.state.reviews, (fav) => {
                return (
                    /*
                        <ListItem key={this.hashCode(fav.breweryName)}>
                            <TouchableOpacity 
                                onPress={() => this.props.navigation.navigate("ReviewView", {navigation: this.props.navigation, review: fav})}>
                                <Text style={{width: '100%'}}>
                                {fav.breweryName}
                                </Text>
                                <Text style={{width:'100%', color:'gray', fontSize:11}}>
                                Distance:   
                                    {(this.state.location.lat || this.state.location.lng) 
                                    ? ' ' + Number(geolib.getDistance({latitude: this.state.location.lat, longitude: this.state.location.lng}, 
                                    {latitude: fav.latitude, longitude: fav.longitude}) * 0.000621371).toFixed(2) + ' miles': ' no location data'}
                                </Text>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={fav.overallRating}
                                    fullStarColor={'#eaaa00'}
                                    starSize={20}
                                    containerStyle={{width: '25%'}} />
                            </TouchableOpacity>
                        </ListItem>
                        */
                    <ReviewCard 
                        review = {fav}
                        user = {this.state.user}
                        breweryName = {fav.breweryName}
                        navigation = {this.props.navigation}
                    />
                );
            });
        }
    }

    hashCode(s) {
        var h = 0, l = s.length, i = 0;
        if ( l > 0 )
            while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
        return h;
    };
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
  },
})