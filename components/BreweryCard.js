import React from 'react';
import { Card, CardItem, Text, Body, Icon, Button } from 'native-base';
import { View, Image, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating';
import Review from '../models/Review';

export class BreweryCard extends React.Component {

    constructor(){
        super();
          this.state ={
              status:true,
          }
    }

    ShowHideBreweryCard = () =>{
        if(this.state.status == true) {
            this.setState({status: false})
        }
        else {
            this.setState({status: true})
        }
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Brewery", {navigation: this.props.navigation, brewery: this.props.curBrew})}>
              <View style = {{flexDirection: 'row', borderRadius:5, backgroundColor:'white', marginLeft:10, marginRight:10, marginBottom:10}}>
    							{
                    //<View style={{flex: 3, borderRadius: 5, backgroundColor: 'powderblue'}} />
                  }
                  <Image
                    style={{flex:3, borderRadius: 5}}
                    source={{uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&key=AIzaSyBCDrIwmnP8wy528KFOz7I7NhVE7DeV_cI&photoreference=' + this.props.curBrew.photo}}
                  />
    							<View style = {{flex: 7, flexDirection: 'column', padding: 5}}>
    									<View style={{flex: 1, flexDirection: 'row'}}>
    											<Text>{this.props.curBrewName} </Text>
    									</View>
    									<View style={{flex: 1, flexDirection: 'row'}}>
    											<StarRating
    													disabled={true}
    													maxStars={5}
    													rating={this.props.curBrewRating}
    													starSize={20}
                                                        fullStar={require('../resources/beer.png')}
                                                        emptyStar={require('../resources/empty_beer.png')}
                                                        halfStar={require('../resources/half_beer.png')}
                                                />
    									</View>
    									<View style={{flex: 1, flexDirection: 'row'}}>
    											<Text> {this.props.curBrewDist} </Text>
    									</View>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                          {
                            this.props.location &&
                            <Text> {this.props.location} </Text>
                          }
    									</View>
    							</View>
    					</View>
            </TouchableOpacity>
        )
    }
}
