/*
* Add Review Screen from the Family Friendly Brewery Tracker
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
import { Platform, StyleSheet, View, Text, TextInput, Image, ScrollView, BackHandler, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import { Footer, Container, CheckBox, ListItem, Button, Header, Content, Icon} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash';
import Brewery from '../models/Brewery';
import firebaseApp from '../firebase';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import StarRating from 'react-native-star-rating';
import { NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import { writeReview } from '../lib/FirebaseHelpers';
import { ImagePicker } from 'expo';


export class AddReviewScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Leave a review",
        headerStyle:  { backgroundColor: "#2196F3", },
        headerTitleStyle: { color: "#FFFFFF" },
        headerTintColor: "white"
    });

    constructor(props) {
        super(props);
        global.main = false;

        this.state = {
            error: false,
            profane_content: false,
            spinnerVisible: false,
            brewery: this.props.navigation.state.params.brewery,
            review: this.props.navigation.state.params.review,
            breweryId: this.props.navigation.state.params.brewery.placeId,
            overallRating: 0,

            kidFriendlyView: false,
            environmentView: false,
            foodView: false,
            logisticsView: false,

            numberedView: 1,

            //kid friendly
            strollerKids: false,
            kThroughSix: false,
            teenagers: false,

            //environment
            environment: 0,
            safety: 0,
            petFriendly: false,
            soundLevel: 0,
            isSmokingPermitted: false,
            seatingArrangements: 0,
            cleanliness: 0,

            //food
            overallFood: false,
            foodOptionDiversity: 0,
            nonAlcoholicOptions: false,

            //logistics
            hasChangingTables: false,
            hasFamilyRestroom: false,
            isWheelchairAccessible: false,
            parking: 0,

            comments: "",
            commentsHeight: 100,
            revId: 0,
            breweryName: this.props.navigation.state.params.brewery.name,
            photo: null,
            lat: 0,
            long: 0,
            date: new Date(),
            viewable: true,

            image: null
        }
        if(this.state.review != null) {
            this.state.overallRating = this.state.review.overallRating;
            this.state.visible = this.state.visible;

            //logistics
            this.state.hasChangingTables = this.state.review.hasChangingTables;
            this.state.hasFamilyRestroom = this.state.review.hasFamilyRestroom;
            this.state.isWheelchairAccessible = this.state.review.isWheelchairAccessible;

            //kid friendly
            this.state.kidFriendly = this.state.review.kidFriendly;
            this.state.strollerKids = this.state.review.strollerKids;
            this.state.kThroughSix = this.state.review.kThroughSix;
            this.state.teenagers = this.state.review.teenagers;

            //environment
            this.state.environment = this.state.review.environment;
            this.state.seatingArrangements = this.state.review.seatingArrangements;
            this.state.safety = this.state.review.safety;
            this.state.petFriendly = this.state.review.petFriendly;
            this.state.soundLevel = this.state.review.soundLevel;
            this.state.isSmokingPermitted = this.state.review.isSmokingPermitted;
            this.state.cleanliness = this.state.review.cleanliness;

            //food
            this.state.overallFood = this.state.review.overallFood;
            this.state.foodOptionDiversity = this.state.review.foodOptionDiversity;
            this.state.nonAlcoholicOptions = this.state.review.nonAlcoholicOptions;

            this.state.parking = this.state.review.parking;
            this.state.comments = this.state.review.comments;
            this.state.revId = this.state.review.revId;
            this.state.breweryName = this.state.review.breweryName;
            this.state.breweryId = this.state.review.breweryId;
            this.state.photo = this.state.review.photo;
            this.state.lat = this.state.review.latitude;
            this.state.long = this.state.review.longitude;
        } else {
            this.state.photo = this.state.brewery.photo;
            this.state.lat = this.state.brewery.latitude;
            this.state.long = this.state.brewery.longitude;
        }
    }
    render() {
        return (
            <View style={{height:'100%', width:'100%', backgroundColor:'#FFFFFF'}}>
                <KeyboardAwareScrollView>
                    <View style={{height:'100%', flexDirection: 'column', alignItems:'center'}}>
                            <View style={{flex:1, width:'100%', justifyContent: 'center'}}>
                                <Text style={styles.title}>{this.state.breweryName}</Text>
                                <Spinner overlayColor={"rgba(0, 0, 0, 0.3)"}
                                        color={"rgb(66,137,244)"}
                                        visible={this.state.spinnerVisible}
                                        textStyle={{color: '#000000'}} />
                            </View>

                            <View style={{flex:2}}>
                            {
                                this.state.numberedView == 1 &&
                                    <View style ={{alignItems:'center'}} >
                                        <View style={{flexDirection: 'column', alignItems:'center', borderWidth: 1, borderRadius:5}}>
                                        <Text style={styles.radio_final_title}> * Overall Rating</Text>
                                        <StarRating
                                            maxStars={5}
                                            rating={this.state.overallRating}
                                            selectedStar={(rating) => this.setState({overallRating: rating})}
                                            fullStarColor={'#eaaa00'}
                                            starSize={30}
                                        />
                                        </View>

                                        <View style={{flexDirection: 'column', width:300, borderWidth:1, borderRadius:5, marginTop: 10, marginBottom:10}}>
                                                <View style={{flexDirection:'row', borderBottomColor: 'black', borderBottomWidth: 1}}>
                                                  <Text> Children & Accessibility </Text>
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={{flex:4}}> Stroller Kids </Text>
                                                    <View style={{ flex:1}}>
                                                        <CheckBox checked={this.state.strollerKids} onPress = {() => this.setState({strollerKids: !this.state.strollerKids})} />
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                        <Text style={{flex:4}}> K - 6 </Text>
                                                    <View style={{flex: 1}}>
                                                        <CheckBox checked={this.state.kThroughSix} onPress = {() => this.setState({kThroughSix: !this.state.kThroughSix})} />
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                        <Text style={{flex:4}}> Teenagers </Text>
                                                    <View style={{flex: 1}}>
                                                        <CheckBox checked={this.state.teenagers} onPress = {() => this.setState({teenagers: !this.state.teenagers})} />
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                        <Text style={{flex:4}}> Changing Tables </Text>
                                                    <View style={{flex: 1}}>
                                                        <CheckBox checked={this.state.hasChangingTables} onPress = {() => this.setState({hasChangingTables: !this.state.hasChangingTables})} />
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                        <Text style={{flex:4}}> Family Restrooms </Text>
                                                    <View style={{flex: 1}}>
                                                        <CheckBox checked={this.state.hasFamilyRestroom} onPress = {() => this.setState({hasFamilyRestroom: !this.state.hasFamilyRestroom})} />
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                        <Text style={{flex:4}}> Wheelchair Accessible </Text>
                                                    <View style={{flex: 1}}>
                                                        <CheckBox checked={this.state.isWheelchairAccessible} onPress = {() => this.setState({isWheelchairAccessible: !this.state.isWheelchairAccessible})} />
                                                    </View>
                                                </View>
                                        </View>

                                        <Text style={{fontWeight:'bold'}}>Fields marked * are required </Text>
                                        {this.state.error && <Text style={{color:'red'}}>Please fill out all of the required fields</Text>}
                                    </View>
                        }



                            {
                              //environment
                            }

                            {
                                this.state.numberedView == 2 &&
                                    <View style={{alignItems:'center'}} >
                                            <View style={{flexDirection: 'column', width:300, borderWidth:1, borderRadius:5, marginTop: 10, marginBottom:10}}>
                                                <View style={{flexDirection:'row', borderBottomColor: 'black', borderBottomWidth: 1}}>
                                                    <Text> Environment </Text>
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={{flex:4}}> Smoking Allowed </Text>
                                                    <View style={{flex:1}}>
                                                        <CheckBox checked={this.state.isSmokingPermitted} onPress = {() => this.setState({isSmokingPermitted: !this.state.isSmokingPermitted})} />
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={styles.radio_title}> Seating Arrangements</Text>
                                                    <StarRating
                                                        maxStars={5}
                                                        rating={this.state.seatingArrangements}
                                                        selectedStar={(rating) => this.setState({seatingArrangements: rating})}
                                                        fullStarColor={'#eaaa00'}
                                                        containerStyle={{width: '30%'}}
                                                        starSize={18}                    />
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={styles.radio_title}> Safety</Text>
                                                    <StarRating
                                                        maxStars={5}
                                                        rating={this.state.safety}
                                                        selectedStar={(rating) => this.setState({safety: rating})}
                                                        fullStarColor={'#eaaa00'}
                                                        containerStyle={{width: '30%'}}
                                                        starSize={18}                    />
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={{flex:4}}> Pet Friendly </Text>
                                                    <View style={{flex:1}}>
                                                        <CheckBox checked={this.state.petFriendly} onPress = {() => this.setState({petFriendly: !this.state.petFriendly})}/>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={styles.radio_title}> Cleanliness</Text>
                                                    <StarRating
                                                        maxStars={5}
                                                        rating={this.state.cleanliness}
                                                        selectedStar={(rating) => this.setState({cleanliness: rating})}
                                                        fullStarColor={'#eaaa00'}
                                                        containerStyle={{width: '30%'}}
                                                        starSize={18}                    />
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={styles.radio_title}> Sound Level</Text>
                                                    <StarRating
                                                        maxStars={5}
                                                        rating={this.state.soundLevel}
                                                        selectedStar={(rating) => this.setState({soundLevel: rating})}
                                                        fullStarColor={'#eaaa00'}
                                                        containerStyle={{width: '30%'}}
                                                        starSize={18}                    />
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={styles.radio_title}> Parking </Text>
                                                    <StarRating
                                                        maxStars={5}
                                                        rating={this.state.parking}
                                                        selectedStar={(rating) => this.setState({parking: rating})}
                                                        fullStarColor={'#eaaa00'}
                                                        containerStyle={{width: '30%'}}
                                                        starSize={18}                    />
                                                </View>
                                        </View>
                                </View>
                            }

                            {
                              //FOOD
                            }

                            {
                                this.state.numberedView == 3 &&
                                <View style = {{alignItems:'center'}}>
                                    <View style={{flexDirection: 'column', width:300, borderWidth:1, borderRadius:5, marginTop: 10, marginBottom:10}}>
                                        <View style={{flexDirection:'row', borderBottomColor: 'black', borderBottomWidth: 1}}>
                                            <Text> Food </Text>
                                        </View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <Text style={{flex:4}}> Food </Text>
                                            <View style={{flex:1}}>
                                                <CheckBox checked={this.state.overallFood} onPress = {() => this.setState({overallFood: !this.state.overallFood})} />
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <Text style={styles.radio_title}> Food Diversity</Text>
                                            <StarRating
                                                maxStars={5}
                                                rating={this.state.foodOptionDiversity}
                                                selectedStar={(rating) => this.setState({foodOptionDiversity: rating})}
                                                fullStarColor={'#eaaa00'}
                                                containerStyle={{width: '30%'}}
                                                starSize={18}                    />
                                        </View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <Text style={{flex:4}}> Non-Alcoholic Options </Text>
                                            <View style={{flex:1}}>
                                                <CheckBox checked={this.state.nonAlcoholicOptions} onPress = {() => this.setState({nonAlcoholicOptions: !this.state.nonAlcoholicOptions})} />
                                            </View>
                                        </View>
                                      </View>
                                    </View>
                            }




                            {
                              //LOGISTICS
                            }

                            {
                                this.state.numberedView == 4 &&
                                    <View style={{flexDirection: 'column', width:300, borderRadius:5, marginTop: 10, marginBottom:10}}>

                                        <View style={{width:300, borderRadius:5}}>
                                            <View style={{backgroundColor: 'pink'}}>
                                                <TouchableOpacity style={{width:'100%', backgroundColor: 'pink', alignItems: 'center'}} onPress={this.pickImage.bind(this)}>
                                                    <Icon
                                                      name="camera"
                                                      type="Entypo"
                                                      color='#1DA664'
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                            {
                                              this.state.image != null &&
                                              <Image source={{ uri: this.state.image }}  style={styles.image} />
                                            }

                                            <Text style={styles.radio_title}>Overall Comments:</Text>
                                            <View style={styles.text_wrapper}>
                                                <TextInput
                                                    style={[styles.textinput, {height: this.state.commentsHeight}]}
                                                    onChangeText={(comments) => this.setState({comments: comments})}
                                                    onContentSizeChange={(event) => {
                                                        this.setState({commentsHeight: Math.max(100, event.nativeEvent.contentSize.height)})
                                                    }}
                                                    value={this.state.comments}
                                                    placeholder="Tell us about your visit"
                                                    multiline={true}
                                                    underlineColorAndroid="transparent"
                                                />
                                                {this.state.profane_content && <Text style={{color:'red'}}>Please use clean language in the comments!</Text>}
                                            </View>
                                        </View>
                                    </View>
                            }
                            </View>


                            <View style={{flex:1, width:300, borderRadius:5, flexDirection: 'row', justifyContent: 'space-between'}}>
                            {
                              this.state.numberedView == 1 &&
                                  <View style ={{flex:1}}/>
                            }
                            {
                              this.state.numberedView != 1 &&
                              <TouchableOpacity style={{flex:1, backgroundColor: 'pink', alignItems: 'center', height: 50, justifyContent: 'center'}} onPress={()=>{this.state.numberedView >= 2 ? this.setState({numberedView: this.state.numberedView - 1}) : null}}>
                                  <Image
                                    style={{width: 25, height: 25}}
                                    source={require('../resources/chevron.png')} />
                              </TouchableOpacity>

                            }
                                <View style={{flex:1,alignItems:'center'}}>
                                    <Text style={{flex:1, alignItems:'center', height:'33%'}}> {this.state.numberedView} of 4 </Text>
                                </View>
                                {
                                  this.state.numberedView != 4 &&
                                  <TouchableOpacity style={{flex:1, backgroundColor: 'pink', alignItems: 'center', height: 50, justifyContent: 'center'}} onPress={()=>{this.state.numberedView <= 3 ? this.setState({numberedView: this.state.numberedView + 1}) : null}}>
                                    <Image
                                      style={{width: 25, height: 25}}
                                      source={require('../resources/chevron1.png')} />
                                  </TouchableOpacity>

                                }
                                {
                                  this.state.numberedView == 4 &&
                                  <TouchableOpacity
                                          style={{ flex:1, backgroundColor: 'pink', alignItems: 'center', height: 50, justifyContent:'center'}}
                                          onPress={this.submitReview.bind(this)}>
                                          <Text style={{color: 'black', fontSize:16, fontWeight:'bold'}}>SUBMIT</Text>
                                  </TouchableOpacity>

                                }

                            </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }

    submitReview() {
        if(!this.state.overallRating) {
            this.setState({error: true});
            return;
        }

        var Filter = require('bad-words'),
            filter = new Filter();
        
        if(filter.isProfane(this.state.comments)) {
            this.setState({profane_content: true});
            return;
        }

        this.setState({spinnerVisible: true})

        var timestamp = (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear();
        var reviewData = {
            date: timestamp,
            environment: this.state.environment,
            overallFood: this.state.overallFood,
            cleanliness: this.state.cleanliness,
            parking: this.state.parking,
            hasChangingTables: this.state.hasChangingTables,
            hasFamilyRestroom: this.state.hasFamilyRestroom,
            isWheelchairAccessible: this.state.isWheelchairAccessible,
            seatingArrangements: this.state.seatingArrangements,
            safety: this.state.safety,
            petFriendly: this.state.petFriendly,
            foodOptionDiversity: this.state.foodOptionDiversity,
            nonAlcoholicOptions: this.state.nonAlcoholicOptions,
            soundLevel: this.state.soundLevel,
            isSmokingPermitted: this.state.isSmokingPermitted,
            strollerKids: this.state.strollerKids,
            kThroughSix: this.state.kThroughSix,
            teenagers: this.state.teenagers,
            overallRating: this.state.overallRating,
            revId: this.state.revId,
            breweryName: this.state.breweryName,
            photo: this.state.photo,
            latitude: this.state.lat,
            longitude: this.state.long,
            comments: this.state.comments,
            image: this.state.image
        }
        writeReview(this.props.navigation.state.params.brewery.placeId, reviewData).then(() => {
            const backAction = NavigationActions.back({
                key: null
            })
            this.props.navigation.dispatch(backAction);
        });
    }

    async pickImage() {
        result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3]});
        this.handleImage(result);
    }

    handleImage(result) {
        if (!result.cancelled) {
            this.setState({image: result.uri});
        }
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  radio_title: {
    fontSize: 14,
    marginTop: 5,
  },
  radio_final_title: {
      fontSize: 16,
      fontWeight: 'bold'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  textinput: {
    fontSize: 11,
    width:300,
    maxWidth: '100%',
    margin: 5
  },
  text_wrapper: {
      marginTop: 5,
      marginBottom: 5,
      borderColor: 'gray',
      borderRadius: 5,
      borderWidth: 1
  },
  button: {
    width: '80%',
    marginVertical: 20,
    height: 20,
  },
  image: {
    width: null,
    height: 200,
    resizeMode: 'contain',
    marginTop: 10
}
});
