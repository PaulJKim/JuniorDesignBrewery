/*
* Brewery Overview Screen from the Family Friendly Brewery Tracker
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
import { StyleSheet, View, Text, TextInput, Button, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Footer, Container, Icon, List, ListItem, CheckBox } from 'native-base';
import _ from 'lodash';
import Brewery from '../models/Brewery';
import firebaseApp from '../firebase';
import FAB from 'react-native-fab';
import StarRating from 'react-native-star-rating';
import Review from '../models/Review';
import Spinner from 'react-native-loading-spinner-overlay';
import { reportReview, deleteReview, getBreweryReviews, getUsersObject, getFavoriteState, setFavoriteState, isAdmin, isLoggedIn } from '../lib/FirebaseHelpers';

export class BreweryScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Brewery",
        headerStyle:  { backgroundColor: "#2196F3", },
        headerTitleStyle: { color: "#FFFFFF" },
        headerTintColor: "white",
        headerRight:
            (<View style={{width:40}}>
                    <Icon style={{paddingRight: 15, color:"#FFFFFF"}}
                    name={(navigation.state.params.fave) ? "md-star" : "md-star-outline"}
                    onPress= {() => {
                        if(isLoggedIn()) {
                            navigation.state.params.setFavorite();
                        } else {
                            Alert.alert(
                                'You must be logged in to use this feature',
                                'Login?',
                                [
                                {text: 'No', style: 'cancel'},
                                {text: 'Yes', onPress: () => {navigation.navigate("Login", {brewery: ""})}},
                                ],
                                { cancelable: false });
                    }
                }} />

            </View>),
    });

    constructor(props) {
        super(props);
        this.state = {
            brewery: this.props.navigation.state.params.brewery,
            reviews: null,
            pictures: {},
            revsAvg: new Review(),
            rev: null,
            isMounted: false,
            userData: null,
            isAdmin: false
            //count: 0,
        }
        global.main = false;
    }
    componentDidMount() {
        // set handler method with setParams
        this.props.navigation.setParams({
          setFavorite: this._setFavorite.bind(this),
          fave: false
        });

        if(isLoggedIn()) {
            getFavoriteState(this.state.brewery.placeId).then((favoriteState) => {
                this.props.navigation.setParams({
                    fave: favoriteState
                });
            })
            isAdmin().then((adminStatus) => {
                this.setState({isAdmin: adminStatus});
            });
        }


        getBreweryReviews(this.state.brewery.placeId).then((reviews) => {
            this.setState({reviews: reviews});
            Uids = reviews.map((review) => review.userId);
            getUsersObject(Uids).then((userData) => {
                this.setState({userData: userData});
            });
        });

    }
    _setFavorite() {
        setFavoriteState(this.state.brewery.placeId, !this.props.navigation.state.params.fave);
        this.props.navigation.setParams({fave: !this.props.navigation.state.params.fave});
    }
    render() {
        if(this.state.reviews != null && this.state.reviews.length > 0) {
            this.state.revsAvg = new Review();
            this.calcAvg(this.state.reviews)
        }
        return (
            <View style={{height: '100%'}}>
            <Spinner overlayColor={"rgba(0, 0, 0, 0.3)"}
                        color={"rgb(66,137,244)"}
                        visible={this.state.reviews == null}
                        textStyle={{color: '#000000'}} />
            <ScrollView style={{backgroundColor: '#fff'}}>

            <View style={styles.container}>
                <Text style={styles.title}>{this.state.brewery.name}</Text>
                <Text style={styles.subtitle}>City, ST</Text>
                <Image
                    style={{width: 125, height: 125, borderRadius: 5}}
                    source={{uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&key=AIzaSyBCDrIwmnP8wy528KFOz7I7NhVE7DeV_cI&photoreference=' + this.state.brewery.photo}}
                />
                <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={this.state.revsAvg.overallRating}
                            fullStarColor={'#4D97E1'}
                            starSize={25}
                            containerStyle={{marginTop: 15, marginBottom: 15}}
                        />


                <View style={{flexDirection:'row'}}>

                    //////////
                    //left column
                    /////////
                    <View style={{flex:1, marginRight: 12, justifyContent:'space-between'}}>
                        ///////
                        //children & Accessibility
                        ///////
                        <View style={{flexDirection: 'column', width:'100%', borderWidth:1, borderRadius:5, marginTop: 10, marginBottom:10}}>
                                <View style={{flexDirection:'row', borderBottomColor: 'black', borderBottomWidth: 1}}>
                                  <Text style={{fontSize:10}}> Children & Accessibility </Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 3}}>
                                    <Text style={{flex:3,fontSize:10}}> Stroller Kids </Text>
                                    <View style={{ flex:1}}>
                                        <CheckBox style={{checkboxSize: 15}} checked={this.state.strollerKids} onPress = {() => this.setState({strollerKids: !this.state.strollerKids})} />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3}}>
                                        <Text style={{flex:3,fontSize:10}}> K - 6 </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.kThroughSix} onPress = {() => this.setState({kThroughSix: !this.state.kThroughSix})} />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3}}>
                                        <Text style={{flex:3,fontSize:10}}> Teenagers </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.teenagers} onPress = {() => this.setState({teenagers: !this.state.teenagers})} />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 3}}>
                                        <Text style={{flex:3,fontSize:10}}> Changing Tables </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.hasChangingTables} onPress = {() => this.setState({hasChangingTables: !this.state.hasChangingTables})} />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3}}>
                                        <Text style={{flex:3,fontSize:10}}> Family Restrooms </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.hasFamilyRestroom} onPress = {() => this.setState({hasFamilyRestroom: !this.state.hasFamilyRestroom})} />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 3, marginBottom: 3}}>
                                        <Text style={{flex:3,fontSize:10}}> Wheelchair Access </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.isWheelchairAccessible} onPress = {() => this.setState({isWheelchairAccessible: !this.state.isWheelchairAccessible})} />
                                    </View>
                                </View>
                        </View>
                        ////////
                        //food
                        ////////
                        <View style={{flexDirection: 'column', width:'100%', borderWidth:1, borderRadius:5, marginTop: 10, marginBottom:10}}>
                            <View style={{flexDirection:'row', borderBottomColor: 'black', borderBottomWidth: 1}}>
                                <Text style={{fontSize:10}}> Food </Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 3}}>
                                <Text style={{flex:3, fontSize:10, marginTop:3}}> Food </Text>
                                <View style={{flex:1}}>
                                    <CheckBox checked={this.state.overallFood} onPress = {() => this.setState({overallFood: !this.state.overallFood})} />
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:4, marginRight:2}}>
                                <Text style={{fontSize:10}}> Food Diversity</Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.foodOptionDiversity}
                                    selectedStar={(rating) => this.setState({foodOptionDiversity: rating})}
                                    fullStarColor={'#eaaa00'}
                                    //containerStyle={{width: '30%'}}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginBottom:3}}>
                                <Text style={{flex:3, fontSize:10, marginTop:3}}> Non-Alcoholic Drinks </Text>
                                <View style={{flex:1}}>
                                    <CheckBox checked={this.state.nonAlcoholicOptions} onPress = {() => this.setState({nonAlcoholicOptions: !this.state.nonAlcoholicOptions})} />
                                </View>
                            </View>
                        </View>

                    </View>

                    //////////
                    //right column
                    ////////
                    <View style={{flex:1, justifyContent:'space-between'}}>
                        /////////
                        //4x4 visual icons
                        ////////
                        <View style={{height:100, backgroundColor: 'red', marginTop: 5}}>
                        </View>

                        //////////
                        //environment
                        //////////
                        <View style={{flexDirection: 'column', width:'100%', borderWidth:1, borderRadius:5, marginTop: 10, marginBottom:10}}>
                            <View style={{flexDirection:'row', borderBottomColor: 'black', borderBottomWidth: 1}}>
                                <Text style={{fontSize:10}}> Environment </Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3}}>
                                <Text style={{flex:3, fontSize:10}}> Smoking Allowed </Text>
                                <View style={{flex:1}}>
                                    <CheckBox checked={this.state.isSmokingPermitted} onPress = {() => this.setState({isSmokingPermitted: !this.state.isSmokingPermitted})} />
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginRight:2}}>
                                <Text style={{fontSize:10}}> Seating </Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.seatingArrangements}
                                    selectedStar={(rating) => this.setState({seatingArrangements: rating})}
                                    fullStarColor={'#eaaa00'}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginRight:2}}>
                                <Text style={{fontSize:10}}> Safety</Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.safety}
                                    selectedStar={(rating) => this.setState({safety: rating})}
                                    fullStarColor={'#eaaa00'}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:4}}>
                                <Text style={{flex:3, fontSize:10}}> Pet Friendly </Text>
                                <View style={{flex:1}}>
                                    <CheckBox checked={this.state.petFriendly} onPress = {() => this.setState({petFriendly: !this.state.petFriendly})}/>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:4, marginRight:2}}>
                                <Text style={{fontSize:10}}> Cleanliness</Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.cleanliness}
                                    selectedStar={(rating) => this.setState({cleanliness: rating})}
                                    fullStarColor={'#eaaa00'}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginRight:2}}>
                                <Text style={{fontSize:10}}> Sound Level</Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.soundLevel}
                                    selectedStar={(rating) => this.setState({soundLevel: rating})}
                                    fullStarColor={'#eaaa00'}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginBottom:3, marginRight:2}}>
                                <Text style={{fontSize:10}}> Parking </Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.parking}
                                    selectedStar={(rating) => this.setState({parking: rating})}
                                    fullStarColor={'#eaaa00'}
                                    starSize={10}                    />
                            </View>
                        </View>

                    </View>


                </View>
                {!!(this.state.reviews != null && this.state.reviews.length > 0) && <View>
                    <Text style={styles.radio_title_top}>{'\n'}Overall Rating</Text>
                    <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={this.state.revsAvg.overallRating}
                                fullStarColor={'#4D97E1'}
                                starSize={20}
                                containerStyle={{width: '25%'}}
                            />

                    <Text style={styles.radio_title_top}>{'\n'}Overall Kid Friendliness</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.revsAvg.kidFriendly}
                        fullStarColor={'#eaaa00'}
                        starSize={20}
                        containerStyle={{width: '25%'}}
                    />
                    <View style={{marginLeft: 10}}>

                    {!!this.state.revsAvg.strollerKids &&
                    <View>
                    <Text style={styles.radio_title}>Stroller Kids</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.revsAvg.strollerKids}
                        fullStarColor={'#eaaa00'}
                        starSize={20}
                        containerStyle={{width: '25%'}}
                    /></View>}

                    {!!this.state.revsAvg.kThroughSix &&
                    <View>
                    <Text style={styles.radio_title}>K-6</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.revsAvg.kThroughSix}
                        fullStarColor={'#eaaa00'}
                        starSize={20}
                        containerStyle={{width: '25%'}}
                    /></View>}

                    {!!this.state.revsAvg.teenagers &&
                    <View>
                    <Text style={styles.radio_title}>Teenagers</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.revsAvg.teenagers}
                        fullStarColor={'#eaaa00'}
                        starSize={20}
                        containerStyle={{width: '25%'}}
                    /></View>}

                    </View>
                    <Text style={styles.radio_title_top}>{'\n'}Overall Environment Quality</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.revsAvg.environment}
                        fullStarColor={'#eaaa00'}
                        starSize={20}
                        containerStyle={{width: '25%'}}
                    />
                    <View style={{marginLeft: 10}}>
                    {!!this.state.revsAvg.isSmokingPermitted &&
                    <View>
                    <Text style={styles.radio_title}>Smoking (1) restricted (5) prevalent</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.revsAvg.isSmokingPermitted}
                        fullStarColor={'#eaaa00'}
                        starSize={20}
                        containerStyle={{width: '25%'}}
                    /></View>}
                    {!!this.state.revsAvg.seatingArrangements &&
                    <View>
                    <Text style={styles.radio_title}>Seating Arrangements</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.revsAvg.seatingArrangements}
                        fullStarColor={'#eaaa00'}
                        starSize={20}
                        containerStyle={{width: '25%'}}
                    /></View>}

                    {!!this.state.revsAvg.safety &&
                    <View>
                    <Text style={styles.radio_title}>Safety</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.revsAvg.safety}
                        fullStarColor={'#eaaa00'}
                        starSize={20}
                        containerStyle={{width: '25%'}}
                    /></View>}

                    {!!this.state.revsAvg.petFriendly &&
                    <View>
                    <Text style={styles.radio_title}>Pet Friendliness</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.revsAvg.petFriendly}
                        fullStarColor={'#eaaa00'}
                        starSize={20}
                        containerStyle={{width: '25%'}}
                    /></View>}

                    {!!this.state.revsAvg.cleanliness &&
                    <View>
                    <Text style={styles.radio_title}>Cleanliness</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.revsAvg.cleanliness}
                        fullStarColor={'#eaaa00'}
                        starSize={20}
                        containerStyle={{width: '25%'}}
                    /></View>}

                    {!!this.state.revsAvg.soundLevel &&
                    <View>
                    <Text style={styles.radio_title}>Sound Level</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.revsAvg.soundLevel}
                        fullStarColor={'#eaaa00'}
                        starSize={20}
                        containerStyle={{width: '25%'}}
                    /></View>}
                    </View>
                    <Text style={styles.radio_title_top}>{'\n'}Overall Food Quality</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.revsAvg.overallFood}
                        fullStarColor={'#eaaa00'}
                        starSize={20}
                        containerStyle={{width: '25%'}}
                    />
                    <View style={{marginLeft: 10}}>
                    {!!this.state.revsAvg.foodOptionDiversity &&
                    <View>
                    <Text style={styles.radio_title}>Food Option Diversity</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.revsAvg.foodOptionDiversity}
                        fullStarColor={'#eaaa00'}
                        starSize={20}
                        containerStyle={{width: '25%'}}
                    /></View>}
                    {!!this.state.revsAvg.nonAlcoholicOptions &&
                    <View>
                    <Text style={styles.radio_title}>Non Alcoholic Options</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.revsAvg.nonAlcoholicOptions}
                        fullStarColor={'#eaaa00'}
                        starSize={20}
                        containerStyle={{width: '25%'}}
                    /></View>}
                    </View>
                    <Text style={styles.radio_title_top}>{'\n'}Logistics</Text>
                    <Text style={styles.radio_title}>
                    <Text>Enough changing tables:</Text>
                    <Text style={{fontWeight:'bold'}}> {(this.state.revsAvg.hasChangingTables >= .5) ? 'Yes' : 'No'} </Text>
                    </Text>
                    <Text style={styles.radio_title}>
                    <Text>Family restroom availability:</Text>
                    <Text style={{fontWeight:'bold'}}> {(this.state.revsAvg.hasFamilyRestroom >= .5) ? 'Yes' : 'No'}</Text>
                    </Text>
                    <Text style={styles.radio_title}>
                    <Text>Wheelchair accessible:</Text>
                    <Text style={{fontWeight:'bold'}}> {(this.state.revsAvg.isWheelchairAccessible >= .5) ? 'Yes' : 'No'}</Text>
                    </Text>
                    <Text style={styles.radio_title_top}>Reviews:</Text>
                    </View>
                }
                <View>{this.renderContent()}</View>
            </View>
            </ScrollView>

            {(this.state.rev == null && this.state.reviews != null) && <View>
            <FAB
                buttonColor="green"
                iconTextColor="#FFFFFF"
                onClickAction={this.addReviewFABHandler.bind(this)}
                visible={true}
                iconTextComponent={<Icon name="md-add"/>} />
            </View>}
            {this.state.rev != null && <View>
            <FAB
                buttonColor="green"
                iconTextColor="#FFFFFF"
                onClickAction={this.addReviewFABHandler.bind(this)}
                visible={true}
                iconTextComponent={<Icon name="md-create"/>} />
            </View>}

            </View>
        )
    }


    addReviewFABHandler() {
        if(isLoggedIn()) {
            this.props.navigation.navigate("AddReview", {navigation: this.props.navigation, brewery: this.state.brewery, review: this.state.rev});
        } else {
            Alert.alert(
                'You must be logged in to use this feature',
                'Login?',
                [
                {text: 'No', style: 'cancel'},
                {text: 'Yes', onPress: () => {this.props.navigation.navigate("Login", {brewery: this.state.brewery})}},
                ],
                { cancelable: false });
        }
    }

    renderContent() {
        return (
            <List style={styles.listStyle}>
                <List>
                    {this.renderReviewsList()}
                </List>
            </List>
        );
    }

    renderReviewsList() {
        if (this.state.reviews != null && this.state.reviews.length > 0 && this.state.userData != null) {
            return _.map(this.state.reviews, (rev) => {

            	// Check to see if review is set to visible
                return (
                    <ListItem key={new Date().getTime()}>
                        <TouchableOpacity style={{display: 'flex', flexDirection: 'row'}} onPress={() => this.props.navigation.navigate("ReviewView", {navigation: this.props.navigation, review: rev})}>
                            <View style={{flex: 1, paddingTop: 7, paddingRight: 10}}>
                                {this.state.userData[rev.userId].image ?
                                  <Image style={{height: 50, width: 50, borderRadius: 100}} source={{uri: this.state.userData[rev.userId].image}}/>
                                  :
                                  <Image style={{height: 50, width: 50, borderRadius: 100}} source={require('../resources/default_profile_picture.png')}/>
                                }

                            </View>
                            <View style={{flex: 5}}>
                                <Text style={styles.list_item_title}>{this.state.userData[rev.userId].username}</Text>
                                <Text style={{width: '100%'}}>"{rev.comments}"</Text>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={rev.overallRating}
                                    fullStarColor={'#eaaa00'}
                                    starSize={20}
                                    containerStyle={{width: '25%'}}
                                />
                                <View>
							        {this.state.isAdmin ? (
							          	<Button
									    title="Delete Review"
									    onPress={this.deleteReview.bind(this, rev)}
                                        color="red"
									    >
										Delete
										</Button>
							      	) : (
							        	null
							      	)}
							    </View>
                                <Button
                                    title="Report"
                                    color="red"
                                    onPress={() => reportReview(rev.revId)}
                                >
                                </Button>
                            </View>
                        </TouchableOpacity>
                    </ListItem>
                );
            });
        } else if(this.state.reviews != null && this.state.reviews.length == 0 && !this.state.spinnerVisible) {
            return (
                <Text style={{textAlign: 'center'}}>No Reviews Yet!</Text>
            )
        }
    }

    // Delete button listener
    deleteReview(rev, e) {
        deleteReview(rev.revId)
        this.setState({reviews: this.state.reviews.filter((review) => review != rev)});
        // Remove the deleted review from the screen
	}


    calcAvg(revs) {
        this.state.revsAvg.overallRating = this.avg(revs, "overallRating");
        this.state.revsAvg.kidFriendly = this.avg(revs,"kidFriendly");
        this.state.revsAvg.strollerKids = this.avg(revs, "strollerKids");
        this.state.revsAvg.kThroughSix = this.avg(revs, "kThroughSix");
        this.state.revsAvg.teenagers = this.avg(revs, "teenagers");
        this.state.revsAvg.environment = this.avg(revs, "environment");
        this.state.revsAvg.isSmokingPermitted = this.avg(revs, "isSmokingPermitted");
        this.state.revsAvg.seatingArrangements = this.avg(revs, "seatingArrangements");
        this.state.revsAvg.safety = this.avg(revs, "safety");
        this.state.revsAvg.petFriendly = this.avg(revs, "petFriendly");
        this.state.revsAvg.cleanliness = this.avg(revs,"cleanliness");
        this.state.revsAvg.soundLevel = this.avg(revs, "soundLevel");
        this.state.revsAvg.overallFood = this.avg(revs, "overallFood");
        this.state.revsAvg.foodOptionDiversity = this.avg(revs, "foodOptionDiversity");
        this.state.revsAvg.nonAlcoholicOptions = this.avg(revs, "nonAlcoholicOptions");
        this.state.revsAvg.hasChangingTables = this.avg2(revs, "hasChangingTables");
        this.state.revsAvg.hasFamilyRestroom = this.avg2(revs, "hasFamilyRestroom");
        this.state.revsAvg.isWheelchairAccessible = this.avg2(revs, "isWheelchairAccessible");
    }

    avg(revs, prop) {
        cntr = 0;
        sum = 0;
        revs.forEach((rev) =>{
            if(parseInt(rev[prop])) {
                cntr++;
                sum += parseInt(rev[prop])
            }
        })
        if(cntr)
            return sum / cntr;
        return null;
    }

    avg2(revs, prop) {
        cntr = 0;
        sum = 0;
        revs.forEach((rev) =>{
            cntr++;
            sum += parseInt(rev[prop])
        })
        if(cntr)
            return sum / cntr;
        return null;
    }}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems:'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
  },
  list_item_title: {
      fontWeight: 'bold',
  },
  radio_title: {
    marginTop: 5,
  },
  radio_title_top: {
    marginTop: 5,
    fontWeight: 'bold',
  }
});
