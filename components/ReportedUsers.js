/*
* Reported Users Screen from the Family Friendly Brewery Tracker
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
import { ScrollView, StyleSheet, View, Text, Image, TouchableOpacity, TextInput, Button } from 'react-native';
import { Footer, Container, Icon, List, ListItem } from 'native-base';
import firebaseApp from '../firebase';
import { ImagePicker, LinearGradient } from 'expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { getReportedUsers, isAdmin, getUsersObject, approveUser, deleteUser } from '../lib/FirebaseHelpers';

console.disableYellowBox = true;

export class ReportedUsers extends React.Component {
    
    static navigationOptions = ({ navigation }) => ({
        title: "Reported Users",
        headerStyle:  { backgroundColor: "#2196F3", },
        headerTitleStyle: { color: "#FFFFFF" },
        headerTintColor: "white", 
    });

    constructor(props) {
        super(props);
        this.state = {
            isAdmin: false,
            users: null
        }
    }

    componentDidMount() {
        console.log("DID MOUNT");
        isAdmin().then((adminStatus) => {
            this.setState({isAdmin: adminStatus});
        });
        getReportedUsers().then((uids) => {
            this.setState({users: uids});
        });
    }

    render() {
        if (this.state.isAdmin) {
            return (
                <Container style={{width: '100%'}}>
                    {this.renderContent()}
                </Container>
            )
        } else {
            return null;
        }
    }

    renderContent() {
        return (
            <View style={{height: '100%'}}>
            <Spinner overlayColor={"rgba(0, 0, 0, 0.3)"} 
                        color={"rgb(66,137,244)"}
                        visible={this.state.reviews == null} 
                        textStyle={{color: '#000000'}} />
            <ScrollView style={{backgroundColor: '#fff'}}>

            <View style={styles.container}>
                <Text style={styles.title}>Reported Users</Text>
                           
                    <View>
                        <List style={styles.listStyle}>
                            <List>
                                {this.renderUsersList()}
                            </List>
                        </List>
                    </View>                
                
            </View>
            </ScrollView>
            
            </View>  
        );
    }

    renderUsersList() {
        if (this.state.users != null && this.state.users.length > 0) {
            return _.map(this.state.users, (user) => {
                return (
                    <View>
                        <ListItem key={new Date().getTime()}>
                            <TouchableOpacity style={{display: 'flex', flexDirection: 'row'}} onPress={() => this.props.navigation.navigate("ProfileView", {navigation: this.props.navigation, id: user})}>
                                <View style={{flex: 1, paddingTop: 7, paddingRight: 10}}>
                                    <Image style={{height: 50, width: 50, borderRadius: 100}} source={{uri:'data:image/png;base64,' + user.avatar.join('')}}></Image>
                                </View>
                                <View style={{flex: 5}}>
                                    <Text style={styles.list_item_title}>{user.username}</Text>
                                    <View>
                                        {this.state.isAdmin ? (
                                            <Button
                                            color="red"
                                            title="Delete User"
                                            onPress={this.deleteUser.bind(this, user)}
                                            >
                                            Delete
                                            </Button>

                                        ) : (
                                            null
                                        )}
                                    </View>

                                    <View>
                                        {this.state.isAdmin ? (
                                            <Button
                                                title="Approve User"
                                                color="green"
                                                onPress={this.approveUser.bind(this, user)}
                                            >
                                            </Button>
                                        ) : (
                                            null
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </ListItem>
                    </View>
                );
            }); 
        } else if(!this.state.spinnerVisible) {
            return (
                <Text style={{textAlign: 'center'}}>No Reported Users Yet!</Text>
            )
        }
    }

    // Delete button listener
    deleteUser(user, e) {
        deleteReview(user.userId)
        this.setState({users: this.state.users.filter((user_iter) => user_iter != user)});
        // Remove the deleted user from the screen
    }

    // Approve button listener
    approveUser(user, e) {
        approveReview(user.userId)
        this.setState({users: this.state.users.filter((user_iter) => user_iter != user)});
        // Remove the approved user from the screen
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
  image_style: {
    borderRadius: 100,
    width: 150,
    height: 150,
    marginTop: 20,
  },
  footer_style: {
      width: '100%'
  },
  title_style: {
      textAlign: 'center',
      fontSize: 22,
      fontWeight: 'bold',
      color: 'rgba(0, 0, 0, 0.95)',
  },
  subtitle_style: {
      fontSize: 15,
      color: 'rgba(0, 0, 0, 0.95)',
  },
  subtitle_style2: {
    fontSize: 17,
    color: 'rgb(0, 0, 0)',
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle_style3: {
    fontSize: 17,
    color: 'rgba(0, 0, 0, 0.7)',
  }
})