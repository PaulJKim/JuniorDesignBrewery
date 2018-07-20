/*
* Review Overview Screen from the Family Friendly Brewery Tracker
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
import { StyleSheet, View, Text, TextInput, Button, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Footer, Container, Icon, List, ListItem, CheckBox } from 'native-base';
import _ from 'lodash';
import Brewery from '../models/Brewery';
import firebaseApp from '../firebase';
import FAB from 'react-native-fab';
import StarRating from 'react-native-star-rating';
import Review from '../models/Review';
import { getUserData } from '../lib/FirebaseHelpers';


export class ReviewScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Review",
        headerStyle:  { backgroundColor: "#2196F3", },
        headerTitleStyle: { color: "#FFFFFF" },
        headerTintColor: "white"
    });

    constructor(props) {
        super(props);
        this.state = {
            review: this.props.navigation.state.params.review,
            image: null,
            didMount: false,
        }
        global.main = false;
    }
    componentDidMount() {
        getUserData(this.state.review.userId).then((userData) => {
            this.setState({image: userData.image});
        })
    }
    render() {
        return (
            <View style={{height: '100%'}}>
            <ScrollView style={{backgroundColor: '#fff'}}>
            <Image
                    style={{width: '100%', height: 200}}
                    source={{uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&key=AIzaSyBCDrIwmnP8wy528KFOz7I7NhVE7DeV_cI&photoreference=' + this.state.review.photo}}
                />
            <View style={styles.container}>

                <Text style={styles.title}>{this.state.review.breweryName}</Text>
                {<View>
                <TouchableOpacity style={{display: 'flex', flexDirection: 'row'}} onPress={() => this.props.navigation.navigate("ProfileView", {id: this.state.review.userId})}>
                    <View style={{flex: 1, paddingTop: 7, paddingRight: 10}}>
                        {this.state.image ?
                           <Image style={{height: 50, width: 50, borderRadius: 25}} source={{uri: this.state.image}} />
                           :
                           <Image style={{height: 50, width: 50, borderRadius: 25}} source={require('../resources/default_profile_picture.png')} />
                        }
                    </View>
                    <View style={{flex: 6, display:'flex'}}>
                        <View style={{flex:2, marginTop: 10}}>
                            <Text style={{fontWeight:'bold', fontSize: 15}}>{this.state.review.username}</Text>
                        </View>
                        <View style={{flex: 2}}>
                            <Text style={{color:'gray'}}>{this.state.review.date}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{flexDirection:'row', width:'100%', alignItems:'center', marginTop:10, marginBottom:10}}>
                    <Text style={[styles.radio_title_top]}> Overall Rating: </Text>
                    <StarRating
                        maxStars={5}
                        rating={this.state.review.overallRating}
                        fullStar={require('../resources/beer.png')}
                        emptyStar={require('../resources/empty_beer.png')}
                        halfStar={require('../resources/half_beer.png')}
                        starSize={20}                    />
                </View>


                <View style={{flexDirection:'row'}}>
                    {
                    //////////
                    //left column
                    /////////
                    }
                    <View style={{flex:1, marginRight: 12, justifyContent:'space-between'}}>
                        {
                        ///////
                        //children & Accessibility
                        ///////
                        }
                        <View style={{flexDirection: 'column', width:'100%', borderWidth:1, borderRadius:5, marginTop: 10, marginBottom:10}}>
                                <View style={{flexDirection:'row', borderBottomColor: 'black', borderBottomWidth: 1}}>
                                  <Text style={{fontSize:10}}> Children & Accessibility </Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 3}}>
                                    <Text style={{flex:3,fontSize:10}}> Stroller Kids </Text>
                                    <View style={{ flex:1}}>
                                        <CheckBox style={{checkboxSize: 15}} checked={this.state.review.strollerKids} />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3}}>
                                        <Text style={{flex:3,fontSize:10}}> K - 6 </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.review.kThroughSix}  />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3}}>
                                        <Text style={{flex:3,fontSize:10}}> Teenagers </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.review.teenagers} />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 3}}>
                                        <Text style={{flex:3,fontSize:10}}> Changing Tables </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.review.hasChangingTables} />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3}}>
                                        <Text style={{flex:3,fontSize:10}}> Family Restrooms </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.review.hasFamilyRestroom} />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 3, marginBottom: 3}}>
                                        <Text style={{flex:3,fontSize:10}}> Wheelchair Access </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.review.isWheelchairAccessible} />
                                    </View>
                                </View>
                        </View>
                        {
                        ////////
                        //food
                        ////////
                        }
                        <View style={{flexDirection: 'column', width:'100%', borderWidth:1, borderRadius:5, marginTop: 10, marginBottom:10}}>
                            <View style={{flexDirection:'row', borderBottomColor: 'black', borderBottomWidth: 1}}>
                                <Text style={{fontSize:10}}> Food </Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 3}}>
                                <Text style={{flex:3, fontSize:10, marginTop:3}}> Food </Text>
                                <View style={{flex:1}}>
                                    <CheckBox checked={this.state.review.overallFood} />
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:4, marginRight:2}}>
                                <Text style={{fontSize:10}}> Food Diversity</Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.review.foodOptionDiversity}
                                    fullStar={require('../resources/beer.png')}
                                    emptyStar={require('../resources/empty_beer.png')}
                                    halfStar={require('../resources/half_beer.png')}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginBottom:3}}>
                                <Text style={{flex:3, fontSize:10, marginTop:3}}> Non-Alcoholic Drinks </Text>
                                <View style={{flex:1}}>
                                    <CheckBox checked={this.state.review.nonAlcoholicOptions} />
                                </View>
                            </View>
                        </View>

                    </View>

                    {
                    //////////
                    //right column
                    ////////
                    }
                    <View style={{flex:1, justifyContent:'space-between'}}>
                        {
                        /////////
                        //4x4 visual icons
                        ////////
                        }
                        <View style={{flexDirection: 'row', height:100, marginTop: 5}}>
                            <View style={{flex:1, flexDirection: 'column', width:'100%'}}>
                                <View style={{flex:1, marginBottom: 5}}>
                                    {
                                      this.state.review.petFriendly &&
                                      <Image style={{flex:1, alignSelf:'stretch', width:undefined, height:undefined, resizeMode: 'contain'}} source={require('../resources/dog.png')} />
                                    }
                                    {
                                      !this.state.review.petFriendly &&
                                      <Image style={{flex:1, alignSelf:'stretch', width:undefined, height:undefined, resizeMode: 'contain'}} source={require('../resources/noPets.png')} />
                                    }
                                </View>
                                <View style={{flex:1, marginBottom: 5}}>
                                    {
                                      this.state.review.isWheelchairAccessible &&
                                      <Image style={{flex:1, alignSelf:'stretch', width:undefined, height:undefined, resizeMode: 'contain'}} source={require('../resources/disability.png')} />
                                    }
                                    {
                                      !this.state.review.isWheelchairAccessible &&
                                      <Image style={{flex:1, alignSelf:'stretch', width:undefined, height:undefined, resizeMode: 'contain'}} source={require('../resources/noWheelChair.png')} />
                                    }
                                </View>
                            </View>
                            <View style={{flex:1, flexDirection: 'column', width:'100%'}}>
                                <View style={{flex:1, marginBottom: 5}}>
                                    {
                                      this.state.review.overallFood &&
                                      <Image style={{flex:1, alignSelf:'stretch', width:undefined, height:undefined, resizeMode:'contain'}} source={require('../resources/hamburger.png')} />
                                    }
                                    {
                                      !this.state.review.overallFood &&
                                      <Image style={{flex:1, alignSelf:'stretch', width:undefined, height:undefined, resizeMode:'contain'}} source={require('../resources/noFood.png')} />
                                    }
                                </View>
                                <View style={{flex:1}}>
                                </View>
                            </View>
                        </View>

                        {
                        //////////
                        //environment
                        //////////
                        }
                        <View style={{flexDirection: 'column', width:'100%', borderWidth:1, borderRadius:5, marginTop: 10, marginBottom:10}}>
                            <View style={{flexDirection:'row', borderBottomColor: 'black', borderBottomWidth: 1}}>
                                <Text style={{fontSize:10}}> Environment </Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3}}>
                                <Text style={{flex:3, fontSize:10}}> Smoking Allowed </Text>
                                <View style={{flex:1}}>
                                    <CheckBox checked={this.state.review.isSmokingPermitted} />
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginRight:2}}>
                                <Text style={{fontSize:10}}> Seating </Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.review.seatingArrangements}
                                    fullStar={require('../resources/beer.png')}
                                    emptyStar={require('../resources/empty_beer.png')}
                                    halfStar={require('../resources/half_beer.png')}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginRight:2}}>
                                <Text style={{fontSize:10}}> Safety</Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.review.safety}
                                    fullStar={require('../resources/beer.png')}
                                    emptyStar={require('../resources/empty_beer.png')}
                                    halfStar={require('../resources/half_beer.png')}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:4}}>
                                <Text style={{flex:3, fontSize:10}}> Pet Friendly </Text>
                                <View style={{flex:1}}>
                                    <CheckBox checked={this.state.review.petFriendly} />
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:4, marginRight:2}}>
                                <Text style={{fontSize:10}}> Cleanliness</Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.review.cleanliness}
                                    fullStar={require('../resources/beer.png')}
                                    emptyStar={require('../resources/empty_beer.png')}
                                    halfStar={require('../resources/half_beer.png')}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginRight:2}}>
                                <Text style={{fontSize:10}}> Sound Level</Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.review.soundLevel}
                                    fullStar={require('../resources/beer.png')}
                                    emptyStar={require('../resources/empty_beer.png')}
                                    halfStar={require('../resources/half_beer.png')}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginBottom:3, marginRight:2}}>
                                <Text style={{fontSize:10}}> Parking </Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.review.parking}
                                    fullStar={require('../resources/beer.png')}
                                    emptyStar={require('../resources/empty_beer.png')}
                                    halfStar={require('../resources/half_beer.png')}
                                    starSize={10}                    />
                            </View>
                        </View>

                    </View>
                </View>



                </View>}
                {!!this.state.review.comments &&
                <View>
                <Text style={[styles.radio_title_top, {width:'100%'}]}>{'\n'}Comments:</Text>
                <Text style={{width: '100%'}}>"{this.state.review.comments}"</Text>
                </View>}
            </View>
            </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    backgroundColor: '#fff',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  list_item_title: {
      fontWeight: 'bold',
  },
  radio_title: {
    marginTop: 5,
  },
  radio_title_top: {
    marginTop: 5,
    fontWeight:'bold'
  },
  image_style: {
    borderRadius: 100,
    width: 50,
    height: 50,
  },
});
