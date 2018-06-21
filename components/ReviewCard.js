import React from 'react';
import { Card, CardItem, Text, Body, Icon, Button } from 'native-base';
import { View, Image } from 'react-native';
import StarRating from 'react-native-star-rating';

export class ReviewCard extends React.Component {
    render() {
        return (
            <View style = {{borderRadius:5, borderWidth: 1, padding: 5}}>
                {
                    this.props.breweryName &&
                    <Text>{this.props.breweryName}</Text>
                }
                <View style ={{flexDirection: 'row'}}>
                    <View style={{flex:1}}>
                        <View style={{flexDirection: 'row'}}>
                            <Image style={{height: 50, width: 50, borderRadius: 100}} source={{uri:'data:image/png;base64,' + this.props.user.avatar.join('')}}></Image>
                            <Text>{this.props.user.username}</Text>
                            <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={this.props.review.overallRating}
                                    fullStarColor={'#eaaa00'}
                                    starSize={20} />
                        </View>
                        <Text>{this.props.review.comments}</Text>
                    </View>
                    <View>
                        <Button>
                            <Icon name="beer" type="Ionicons" />
                        </Button>
                        <Button>
                            <Icon name="flag" type="simpleLineIcons" />
                        </Button>
                    </View>
                </View>
            </View>
        )
    }
}