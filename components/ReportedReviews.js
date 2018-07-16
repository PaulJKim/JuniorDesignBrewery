/*
* Reported Reviews Screen from the Family Friendly Brewery Tracker
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
import { ScrollView, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Footer, Container, Icon, List, ListItem, Button } from 'native-base';
import firebaseApp from '../firebase';
import { ImagePicker, LinearGradient } from 'expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { getReportedReviews, isAdmin, getUsersObject, approveReview, deleteReview } from '../lib/FirebaseHelpers';
import { ReviewCard } from './ReviewCard';

console.disableYellowBox = true;

export class ReportedReviews extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Reported Reviews",
        headerStyle:  { backgroundColor: "#2196F3", },
        headerTitleStyle: { color: "#FFFFFF" },
        headerTintColor: "white",
    });

    constructor(props) {
        super(props);
        this.state = {
            isAdmin: false,
            userData: null,
            reviews: null
        }
    }

    componentDidMount() {
        isAdmin().then((adminStatus) => {
            this.setState({isAdmin: adminStatus});
        });
        getReportedReviews().then((reviews) => {
            this.setState({reviews: reviews});
            Uids = reviews.map((review) => review.userId);
            getUsersObject(Uids).then((userData) => {
                this.setState({userData: userData});
            });
        });
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
            </Container>
        )
    }

    renderContent() {
        if(this.state.reviews != null && this.state.reviews.length == 0 && !this.state.spinnerVisible && this.state.userData) {
            return(
                <View style={{height:'100%', width:'100%', alignContent:'center', alignItems:'center', backgroundColor:'white', display:'flex'}}>
                <View style={{flex:1}}/>
                <Text style={{textAlign: 'center', flex:1}}>No Reported Reviews Yet!</Text>
                </View>
            )
        }
        if(this.state.userData) {
          return (
              <ScrollView>
                  <List style={styles.listStyle}>
                      {this.renderReviewsList()}
                  </List>
              </ScrollView>
          );
        }
    }

    renderReviewsList() {
        if(this.state.reviews != null) {
            return _.map(this.state.reviews, (rev) => {
                return (
                    <View style={{width:'100%'}}>
                        <ReviewCard
                            review = {rev}
                            user = {this.state.userData[rev.userId]}
                            breweryName = {rev.breweryName}
                            navigation = {this.props.navigation}
                        />

                        <View style={styles.admin_container}>
                            <View style={styles.approve_button}>
                                <Button transparent dark 
                                    onPress={this.approveReview.bind(this, rev)}
                                >
                                    <Icon name="checkmark" type="Ionicons" />
                                    <Text>Approve Review</Text>
                                </Button> 
                            </View>
                            <View style={styles.delete_button}>
                                <Button transparent dark
                                    onPress={this.deleteReview.bind(this, rev)} 
                                >
                                    <Icon name="trash" type="Ionicons" />
                                    <Text>Delete Review</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                );
            });
        }
    }


    // Delete button listener
    deleteReview(rev, e) {
        deleteReview(rev.revId)
        this.setState({reviews: this.state.reviews.filter((review) => review != rev)});
        // Remove the deleted review from the screen
    }

    // Approve button listener
    approveReview(rev, e) {
        approveReview(rev.revId)
        this.setState({reviews: this.state.reviews.filter((review) => review != rev)});
        // Remove the approved review from the screen
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
  admin_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15
  },
  delete_button: {
    backgroundColor: 'red',
    width: '40%',
    height: 40
  },
  approve_button: {
    backgroundColor: 'green',
    width: '40%',
    height: 40
  }
});
