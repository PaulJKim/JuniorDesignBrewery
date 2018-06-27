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
import { Platform, StyleSheet, View, Text, TextInput, Image, ScrollView, BackHandler, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Footer, Container, CheckBox, ListItem, Button, Header, Content, Icon} from 'native-base';
import _ from 'lodash';
import Brewery from '../models/Brewery';
import firebaseApp from '../firebase';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import Guid from 'guid';
import StarRating from 'react-native-star-rating';
import { NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';



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
            spinnerVisible: false,
            brewery: this.props.navigation.state.params.brewery,
            review: this.props.navigation.state.params.review,
            breweryId: this.props.navigation.state.params.brewery.placeId,

            overallRating: 0,

            //kid friendly
            kidFriendly: 0,
            strollerKids: 0,
            kThroughSix: 0,
            teenagers: 0,

            //environment
            environment: 0,
            safety: 0,
            petFriendly: 0,
            soundLevel: 0,
            isSmokingPermitted: 0,
            seatingArrangements: 0,
            cleanliness: 0,

            //food
            overallFood: 0,
            foodOptionDiversity: 0,
            nonAlcoholicOptions: 0,

            //logistics
            hasChangingTables: 0,
            hasFamilyRestroom: 0,
            isWheelchairAccessible: 0,
            parking: "",

            comments: "",
            revId: 0,
            breweryName: this.props.navigation.state.params.brewery.name,
            photo: null,
            lat: 0,
            long: 0,
            date: new Date(),
            viewable: true
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
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>{this.state.breweryName}</Text>
                <Spinner overlayColor={"rgba(0, 0, 0, 0.3)"}
                        color={"rgb(66,137,244)"}
                        visible={this.state.spinnerVisible}
                        textStyle={{color: '#000000'}} />
                <Text style={styles.radio_final_title}>{"\n"}*Overall Rating</Text>
                <StarRating
                    maxStars={5}
                    rating={this.state.overallRating}
                    selectedStar={(rating) => this.setState({overallRating: rating})}
                    fullStarColor={'#eaaa00'}
                    containerStyle={{width: '30%'}}
                    starSize={30}
                />

                <ListItem>
                    <CheckBox checked={true} />
                        <Text>Stroller Kids</Text>
                </ListItem>

                <ListItem>
                    <CheckBox checked={false} />
                        <Text> k -6 </Text>
                 </ListItem>

                <View style={{flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <View style={{marginRight:5}}>
                            <CheckBox checked={false} />
                        </View>
                        <View style={{flex: 10}}>
                            <View style= {{width: 100, right: 4em}} />
                                <Text> Stroller Kids </Text>
                        </View>
                    </View>

                </View>

                <View style={{marginLeft: 10}}>
                <Text style={styles.radio_title}>Stroller kids</Text>
                <StarRating
                    maxStars={5}
                    rating={this.state.strollerKids}
                    selectedStar={(rating) => this.setState({strollerKids: rating})}
                    fullStarColor={'#eaaa00'}
                    containerStyle={{width: '30%'}}
                    starSize={30}                    />

                <Text style={styles.radio_title}>K-6</Text>
                <StarRating
                    maxStars={5}
                    rating={this.state.kThroughSix}
                    selectedStar={(rating) => this.setState({kThroughSix: rating})}
                    fullStarColor={'#eaaa00'}
                    containerStyle={{width: '30%'}}
                    starSize={30}                    />

                <Text style={styles.radio_title}>Teenagers</Text>
                <StarRating
                    maxStars={5}
                    rating={this.state.teenagers}
                    selectedStar={(rating) => this.setState({teenagers: rating})}
                    fullStarColor={'#eaaa00'}
                    containerStyle={{width: '30%'}}
                    starSize={30}                    />
                </View>

                <Button iconRight light>
                    <Icon name='arrow-forward' />
                </Button>

                <Text style={styles.radio_final_title}>{"\n"}*Overall Environment Quality</Text>
                <StarRating
                    maxStars={5}
                    rating={this.state.environment}
                    selectedStar={(rating) => this.setState({environment: rating})}
                    fullStarColor={'#eaaa00'}
                    containerStyle={{width: '30%'}}
                    starSize={30}                    />
                <View style={{marginLeft: 10}}>
                <Text style={styles.radio_title}>Smoking (1) restricted (5) prevalent</Text>
                <StarRating
                    maxStars={5}
                    rating={this.state.isSmokingPermitted}
                    selectedStar={(rating) => this.setState({isSmokingPermitted: rating})}
                    fullStarColor={'#eaaa00'}
                    containerStyle={{width: '30%'}}
                    starSize={30}                    />
                <Text style={styles.radio_title}>Seating Arrangements</Text>
                <StarRating
                    maxStars={5}
                    rating={this.state.seatingArrangements}
                    selectedStar={(rating) => this.setState({seatingArrangements: rating})}
                    fullStarColor={'#eaaa00'}
                    containerStyle={{width: '30%'}}
                    starSize={30}                    />
                <Text style={styles.radio_title}>Safety</Text>
                <StarRating
                    maxStars={5}
                    rating={this.state.safety}
                    selectedStar={(rating) => this.setState({safety: rating})}
                    fullStarColor={'#eaaa00'}
                    containerStyle={{width: '30%'}}
                    starSize={30}                    />

                <Text style={styles.radio_title}>Pet Friendly</Text>
                <StarRating
                    maxStars={5}
                    rating={this.state.petFriendly}
                    selectedStar={(rating) => this.setState({petFriendly: rating})}
                    fullStarColor={'#eaaa00'}
                    containerStyle={{width: '30%'}}
                    starSize={30}                    />

                <Text style={styles.radio_title}>Cleanliness</Text>
                <StarRating
                    maxStars={5}
                    rating={this.state.cleanliness}
                    selectedStar={(rating) => this.setState({cleanliness: rating})}
                    fullStarColor={'#eaaa00'}
                    containerStyle={{width: '30%'}}
                    starSize={30}                    />

                <Text style={styles.radio_title}>Sound Level</Text>
                <StarRating
                    maxStars={5}
                    rating={this.state.soundLevel}
                    selectedStar={(rating) => this.setState({soundLevel: rating})}
                    fullStarColor={'#eaaa00'}
                    containerStyle={{width: '30%'}}
                    starSize={30}                    />
                </View>

                <Text style={styles.radio_final_title}>{"\n"}*Overall Food Quality</Text>
                <StarRating
                    maxStars={5}
                    rating={this.state.overallFood}
                    selectedStar={(rating) => this.setState({overallFood: rating})}
                    fullStarColor={'#eaaa00'}
                    containerStyle={{width: '30%'}}
                    starSize={30}                    />
                <View style={{marginLeft: 10}}>
                <Text style={styles.radio_title}>Food Option Diversity</Text>
                <StarRating
                    maxStars={5}
                    rating={this.state.foodOptionDiversity}
                    selectedStar={(rating) => this.setState({foodOptionDiversity: rating})}
                    fullStarColor={'#eaaa00'}
                    containerStyle={{width: '30%'}}
                    starSize={30}                    />

                <Text style={styles.radio_title}>Non Alcoholic Options</Text>
                <StarRating
                    maxStars={5}
                    rating={this.state.nonAlcoholicOptions}
                    selectedStar={(rating) => this.setState({nonAlcoholicOptions: rating})}
                    fullStarColor={'#eaaa00'}
                    containerStyle={{width: '30%'}}
                    starSize={30}                    />
                </View>
                <Text style={styles.radio_final_title}>{'\n'}Logistics</Text>

                <View style={{marginLeft: 10}}>
                <Text style={styles.radio_title}>Sufficient Changing Tables</Text>
                <RadioGroup
                    selectedIndex = {(this.state.hasChangingTables == 0) ? 1 : 0}
                    onSelect = {(index, value) => this.setState({hasChangingTables: value})}>
                    <RadioButton value={1} >
                    <Text>Yes</Text>
                    </RadioButton>

                    <RadioButton value={0}>
                    <Text>No</Text>
                    </RadioButton>
                </RadioGroup>

                <Text style={styles.radio_title}>Family Restroom Available</Text>
                <RadioGroup
                    selectedIndex = {(this.state.hasFamilyRestroom == 0) ? 1 : 0}
                    onSelect = {(index, value) => this.setState({hasFamilyRestroom: value})}>
                    <RadioButton value={1} >
                    <Text>Yes</Text>
                    </RadioButton>

                    <RadioButton value={0}>
                    <Text>No</Text>
                    </RadioButton>
                </RadioGroup>

                <Text style={styles.radio_title}>Wheelchair Accessible</Text>
                <RadioGroup
                    selectedIndex = {(this.state.isWheelchairAccessible == 0) ? 1 : 0}
                    onSelect = {(index, value) => this.setState({isWheelchairAccessible: value})}>
                    <RadioButton value={1} >
                    <Text>Yes</Text>
                    </RadioButton>

                    <RadioButton value={0}>
                    <Text>No</Text>
                    </RadioButton>
                </RadioGroup>
                </View>
                <Text style={styles.radio_title}>Parking:</Text>
                <TextInput
                    style={styles.textinput}
                    onChangeText={(parking) => this.setState({parking})}
                    value={this.state.parking}
                    placeholder="Parking info" />
                <Text style={styles.radio_title}>Overall Comments:</Text>
                <TextInput
                    style={styles.textinput}
                    onChangeText={(comments) => this.setState({comments})}
                    value={this.state.comments}
                    placeholder="Comments" />
                <Text style={{fontWeight:'bold'}}>Fields marked * are required </Text>
                {this.state.error && <Text style={{color:'red'}}>Please fill out all of the required fields</Text>}
                <View style={{alignItems:'center', marginBottom:20}}>
                <TouchableOpacity
                    style={{ height: 40, width:200, marginTop: 10, backgroundColor:"#2196F3", borderRadius:3, alignItems:'center', justifyContent:'center' }}
                    onPress={this.submitReview.bind(this)}>
                    <Text style={{color:"#FFF", fontSize:16, fontWeight:'bold'}}>SUBMIT</Text>
                </TouchableOpacity>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
            </View>
        )
    }

    submitReview() {
        if(!this.state.overallRating || !this.state.kidFriendly || !this.state.environment || !this.state.overallFood) {
            this.setState({error: true});
            return;
        }
        this.setState({spinnerVisible: true})
        if(this.state.revId == 0) {
            this.state.revId = this.newGuid();
        }
        var userRef = firebaseApp.database().ref("Users/" + firebaseApp.auth().currentUser.uid + "/publicData");
        var timestamp = (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear();
        userRef.once("value", (userData) => {
            var updates = {};
            updates["Reviews/" + this.state.revId + "/metadata"] = {
                breweryId: this.state.breweryId,
                userId: firebaseApp.auth().currentUser.uid,
                viewable: this.state.viewable
            };
            updates["Reviews/" + this.state.revId + "/data"] = {
                username: userData.val().username,
                date: timestamp,
                environment: this.state.environment,
                overallFood: this.state.overallFood,
                cleanliness: this.state.cleanliness,
                parking: this.state.parking,
                hasChangingTables: this.state.hasChangingTables,
                hasFamilyRestroom: this.state.hasFamilyRestroom,
                isWheelchairAccessible: this.state.isWheelchairAccessible,
                seatingArrangements: this.state.seatingArrangements,
                kidFriendly: this.state.kidFriendly,
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
                comments: this.state.comments
            }
            updates["Users/" + firebaseApp.auth().currentUser.uid + "/privateData/reviews/" + this.state.revId] = true
            updates["Breweries/" + this.state.breweryId + "/reviews/" + this.state.revId] = true
            firebaseApp.database().ref().update(updates).then(() => {
                const backAction = NavigationActions.back({
                    key: null
                })
                this.props.navigation.dispatch(backAction);
            })

        });
    }

    newGuid() { // Public Domain/MIT
        var d = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
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
    height: 58,
    fontSize: 18,
    minWidth: '75%',
    maxWidth: '75%',
    marginTop: 5,
    marginBottom: 5,
    borderColor: 'gray',
    borderWidth: 0
  },
  button: {
    width: '80%',
    marginVertical: 20,
    height: 20,
  }
});