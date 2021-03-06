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
import { ReviewCard } from './ReviewCard';

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
                        visible={this.state.reviews == null || this.state.userData == null}
                        textStyle={{color: '#000000'}} />
            <ScrollView style={{backgroundColor: '#fff'}}>

            <View style={styles.container}>
                <Text style={styles.title}>{this.state.brewery.name}</Text>
                <Image
                    style={{width: 125, height: 125, borderRadius: 5}}
                    source={{uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&key=AIzaSyBCDrIwmnP8wy528KFOz7I7NhVE7DeV_cI&photoreference=' + this.state.brewery.photo}}
                />
                {
                    (this.state.reviews && this.state.reviews.length > 0) ?
                    <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={this.state.revsAvg.overallRating}
                                fullStar={require('../resources/beer.png')}
                                emptyStar={require('../resources/empty_beer.png')}
                                halfStar={require('../resources/half_beer.png')}
                                starSize={25}
                                containerStyle={{marginTop: 15, marginBottom: 15}}
                    />
                    :
                    <Text style={{fontSize: 20, marginTop: 10}}>No reviews yet</Text>
                }



                {(this.state.reviews != null && this.state.reviews.length > 0) &&
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
                                        <CheckBox style={{checkboxSize: 15}} checked={this.state.revsAvg.strollerKids} />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3}}>
                                        <Text style={{flex:3,fontSize:10}}> K - 6 </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.revsAvg.kThroughSix}  />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3}}>
                                        <Text style={{flex:3,fontSize:10}}> Teenagers </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.revsAvg.teenagers} />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 3}}>
                                        <Text style={{flex:3,fontSize:10}}> Changing Tables </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.revsAvg.hasChangingTables} />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3}}>
                                        <Text style={{flex:3,fontSize:10}}> Family Restrooms </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.revsAvg.hasFamilyRestroom} />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 3, marginBottom: 3}}>
                                        <Text style={{flex:3,fontSize:10}}> Wheelchair Access </Text>
                                    <View style={{flex: 1}}>
                                        <CheckBox checked={this.state.revsAvg.isWheelchairAccessible} />
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
                                    <CheckBox checked={this.state.revsAvg.overallFood} />
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:4, marginRight:2}}>
                                <Text style={{fontSize:10}}> Food Diversity</Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.revsAvg.foodOptionDiversity}
                                    fullStar={require('../resources/beer.png')}
                                    emptyStar={require('../resources/empty_beer.png')}
                                    halfStar={require('../resources/half_beer.png')}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginBottom:3}}>
                                <Text style={{flex:3, fontSize:10, marginTop:3}}> Non-Alcoholic Drinks </Text>
                                <View style={{flex:1}}>
                                    <CheckBox checked={this.state.revsAvg.nonAlcoholicOptions} />
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
                                      this.state.revsAvg.petFriendly &&
                                      <Image style={{flex:1, alignSelf:'stretch', width:undefined, height:undefined, resizeMode: 'contain'}} source={require('../resources/dog.png')} />
                                    }
                                    {
                                      !this.state.revsAvg.petFriendly &&
                                      <Image style={{flex:1, alignSelf:'stretch', width:undefined, height:undefined, resizeMode: 'contain'}} source={require('../resources/noPets.png')} />
                                    }
                                </View>
                                <View style={{flex:1, marginBottom: 5}}>
                                    {
                                      this.state.revsAvg.isWheelchairAccessible &&
                                      <Image style={{flex:1, alignSelf:'stretch', width:undefined, height:undefined, resizeMode: 'contain'}} source={require('../resources/disability.png')} />
                                    }
                                    {
                                      !this.state.revsAvg.isWheelchairAccessible &&
                                      <Image style={{flex:1, alignSelf:'stretch', width:undefined, height:undefined, resizeMode: 'contain'}} source={require('../resources/noWheelChair.png')} />
                                    }
                                </View>
                            </View>
                            <View style={{flex:1, flexDirection: 'column', width:'100%'}}>
                                <View style={{flex:1, marginBottom: 5}}>
                                    {
                                      this.state.revsAvg.overallFood &&
                                      <Image style={{flex:1, alignSelf:'stretch', width:undefined, height:undefined, resizeMode:'contain'}} source={require('../resources/hamburger.png')} />
                                    }
                                    {
                                      !this.state.revsAvg.overallFood &&
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
                                    <CheckBox checked={this.state.revsAvg.isSmokingPermitted} />
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginRight:2}}>
                                <Text style={{fontSize:10}}> Seating </Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.revsAvg.seatingArrangements}
                                    fullStar={require('../resources/beer.png')}
                                    emptyStar={require('../resources/empty_beer.png')}
                                    halfStar={require('../resources/half_beer.png')}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginRight:2}}>
                                <Text style={{fontSize:10}}> Safety</Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.revsAvg.safety}
                                    fullStar={require('../resources/beer.png')}
                                    emptyStar={require('../resources/empty_beer.png')}
                                    halfStar={require('../resources/half_beer.png')}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:4}}>
                                <Text style={{flex:3, fontSize:10}}> Pet Friendly </Text>
                                <View style={{flex:1}}>
                                    <CheckBox checked={this.state.revsAvg.petFriendly} />
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:4, marginRight:2}}>
                                <Text style={{fontSize:10}}> Cleanliness</Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.revsAvg.cleanliness}
                                    fullStar={require('../resources/beer.png')}
                                    emptyStar={require('../resources/empty_beer.png')}
                                    halfStar={require('../resources/half_beer.png')}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginRight:2}}>
                                <Text style={{fontSize:10}}> Sound Level</Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.revsAvg.soundLevel}
                                    fullStar={require('../resources/beer.png')}
                                    emptyStar={require('../resources/empty_beer.png')}
                                    halfStar={require('../resources/half_beer.png')}
                                    starSize={10}                    />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:3, marginBottom:3, marginRight:2}}>
                                <Text style={{fontSize:10}}> Parking </Text>
                                <StarRating
                                    maxStars={5}
                                    rating={this.state.revsAvg.parking}
                                    fullStar={require('../resources/beer.png')}
                                    emptyStar={require('../resources/empty_beer.png')}
                                    halfStar={require('../resources/half_beer.png')}
                                    starSize={10}                    />
                            </View>
                        </View>

                    </View>
                </View>
              }

              {!!(this.state.reviews != null && this.state.reviews.length > 0) && <View style={{flexDirection: 'column', marginBottom:20, width: '100%'}}>

                  {
                  ///photos and User reviews


                  ////////
                  //image Carousel
                  ////////
                  }
                  <View style={{flexDirection:'row', width:'100%'}}>
                      <Text style={styles.radio_title_top}>Photos </Text>
                  </View>

                  <View style={{flexDirection:'column', width:'100%'}}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={10}>
                        {
                            this.state.reviews &&
                            this.state.reviews.map((review) => {
                                if (review.image) {
                                    return <Image source={{ uri: review.image }}  style={styles.image} />
                                }
                            })
                        }
                      </ScrollView>
                  </View>

                  <View style={{flexDirection:'row', width:'100%'}}>
                      <Text style={styles.radio_title_top}>User Reviews </Text>
                  </View>
                  <View style={{width:'100%'}}>{this.renderContent()}</View>
              </View>
            }
            <View style={{height: 150}}/>

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
                    {this.renderReviewCardsList()}
                </List>
            </List>
        );
    }

    renderReviewsList() {
        if (this.state.reviews != null && this.state.reviews.length > 0 && this.state.userData != null) {
            return _.map(this.state.reviews, (rev) => {

                return (
                    <ListItem key={new Date().getTime()}>
                        <TouchableOpacity style={{display: 'flex', flexDirection: 'row'}} onPress={() => this.props.navigation.navigate("ReviewView", {navigation: this.props.navigation, review: rev})}>
                            <View style={{flex: 1, paddingTop: 7, paddingRight: 10}}>
                                {this.state.userData[rev.userId].image ?
                                  <Image style={{height: 50, width: 50, borderRadius: 25}} source={{uri: this.state.userData[rev.userId].image}}/>
                                  :
                                  <Image style={{height: 50, width: 50, borderRadius: 25}} source={require('../resources/default_profile_picture.png')}/>
                                }

                            </View>
                            <View style={{flex: 5}}>
                                <Text style={styles.list_item_title}>{this.state.userData[rev.userId].username}</Text>
                                <Text style={{width: '100%'}}>"{rev.comments}"</Text>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={rev.overallRating}
                                    fullStar={require('../resources/beer.png')}
                                    emptyStar={require('../resources/empty_beer.png')}
                                    halfStar={require('../resources/half_beer.png')}
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

    renderReviewCardsList() {
        if (this.state.reviews != null && this.state.reviews.length > 0 && this.state.userData != null) {
            return _.map(this.state.reviews, (rev) => {

                return (
                    <ReviewCard
                        user = {this.state.userData[rev.userId]}
                        review = {rev}
                        navigation = {this.props.navigation}
                        reportFunction = {this.reportFunction.bind(this)}
                    />
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
        this.state.revsAvg.strollerKids = this.majCheck(revs, "strollerKids");
        this.state.revsAvg.kThroughSix = this.majCheck(revs, "kThroughSix");
        this.state.revsAvg.teenagers = this.majCheck(revs, "teenagers");
        this.state.revsAvg.environment = this.avg(revs, "environment");
        this.state.revsAvg.isSmokingPermitted = this.majCheck(revs, "isSmokingPermitted");
        this.state.revsAvg.seatingArrangements = this.avg(revs, "seatingArrangements");
        this.state.revsAvg.safety = this.avg(revs, "safety");
        this.state.revsAvg.petFriendly = this.majCheck(revs, "petFriendly");
        this.state.revsAvg.cleanliness = this.avg(revs,"cleanliness");
        this.state.revsAvg.soundLevel = this.avg(revs, "soundLevel");
        this.state.revsAvg.overallFood = this.majCheck(revs, "overallFood");
        this.state.revsAvg.foodOptionDiversity = this.avg(revs, "foodOptionDiversity");
        this.state.revsAvg.nonAlcoholicOptions = this.majCheck(revs, "nonAlcoholicOptions");
        this.state.revsAvg.hasChangingTables = this.majCheck(revs, "hasChangingTables");
        this.state.revsAvg.hasFamilyRestroom = this.majCheck(revs, "hasFamilyRestroom");
        this.state.revsAvg.isWheelchairAccessible = this.majCheck(revs, "isWheelchairAccessible");
        this.state.revsAvg.parking = this.avg(revs, "parking");
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
    }

    majCheck(revs, prop) {
        cYes = 0;
        cNo = 0;
        revs.forEach((rev) => {
          if(rev[prop]) {
            cYes++;
          } else {
            cNo++;
          }
        });
        return cYes >= cNo;
    }

    reportFunction(reviewId) {
        if (isLoggedIn()) {
            Alert.alert(
                'Report Review',
                'Do you wish to report this review for inappropriate content?',
                [
                {text: 'No', style: 'cancel'},
                {text: 'Yes', onPress: () => reportReview(reviewId)},
                ],
                { cancelable: false });
        } else {
            Alert.alert(
                'You must be logged in to use this feature',
                'Login?',
                [
                {text: 'No', style: 'cancel'},
                {text: 'Yes', onPress: () => {this.props.navigation.navigate("Login", {brewery: ""})}},
                ],
                { cancelable: false });
        }
    }
}

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
  },
  image: {
    width: 240,
    height: 180,
    resizeMode: 'contain',
    margin: 10
}
});
