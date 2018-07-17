import React from 'react';
import { Card, CardItem, Text, Body, Icon, Button } from 'native-base';
import { View, Image, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating';
import { reportReview, deleteReview, isAdmin } from '../lib/FirebaseHelpers';

export class ReviewCard extends React.Component {
    render() {
        return (
            <View style = {{borderRadius:5, borderWidth: 1, padding: 5, marginBottom: 10}}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("ReviewView", {navigation: this.props.navigation, review: this.props.review})}>
                    {
                        this.props.breweryName &&
                        <Text>{this.props.breweryName}</Text>
                    }

                    <View style ={{flexDirection: 'row'}}>
                        <View style={{flex:5}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{padding:5}}>
                                    {this.props.user.image ?
                                            <Image style={{height: 50, width: 50, borderRadius: 25}} source={{ uri: this.props.user.image}} />
                                        :
                                            <Image style={{height: 50, width: 50, borderRadius: 25}} source={require('../resources/default_profile_picture.png')} />
                                    }
                                </View>

                                <View style={{flexDirection:'column', justifyContent:'center'}}>
                                    <View style={{marginBottom:5}}>
                                        <Text style={{fontWeight:'bold'}}>{this.props.user.username}</Text>
                                    </View>
                                    <View style={{flexDirection:'row', justifyContent:'flex-start'}}>
                                        <StarRating
                                                disabled={true}
                                                maxStars={5}
                                                rating={this.props.review.overallRating}
                                                fullStar={require('../resources/beer.png')}
                                                emptyStar={require('../resources/empty_beer.png')}
                                                halfStar={require('../resources/half_beer.png')}
                                                starSize={15} />
                                    </View>
                                </View>
                            </View>
                            <Text>{this.props.review.comments}</Text>
                        </View>
                        <View style={{flex:1, justifyContent:'space-between'}}>
                            <Button transparent dark>
                                <Icon name="beer" type="Ionicons" />
                            </Button>
                            <Button transparent dark onPress={() => reportReview(this.props.review.revId)}>
                                <Icon name="flag" type="simpleLineIcons" />
                            </Button>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
