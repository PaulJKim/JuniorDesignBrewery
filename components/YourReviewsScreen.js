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
import { Footer, Container, List, ListItem, Content } from 'native-base';
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
                <Content>
                    <View style={{flex: 1, backgroundColor:'white'}}>
                        {this.finishedLoadingData() ? (
                            this.state.reviews.length > 0 ? (
                                this.state.reviews.map((review) => {
                                    return (
                                        <ReviewCard
                                        review = {review}
                                        user = {this.state.user}
                                        breweryName = {review.breweryName}
                                        navigation = {this.props.navigation}
                                        />
                                    )
                                })
                            ) : (
                                <View style={{height:'100%', width:'100%', alignContent:'center', alignItems:'center', backgroundColor:'white', display:'flex'}}>
                                <View style={{flex:1}}/>
                                <Text style={{textAlign: 'center', flex:1}}>No Reviews Yet!</Text>
                                </View>
                            )
                        ) : (
                            <Spinner overlayColor={"rgba(0, 0, 0, 0.3)"} 
                                color={"rgb(66,137,244)"}
                                visible={this.state.reviews == null} 
                                textStyle={{color: '#000000'}} />
                        )}
                    </View>
                </Content>
                <Footer style={{width: '100%'}}>
                    {this.props.renderTabs()}
                </Footer>
            </Container>
        )
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
  },
})