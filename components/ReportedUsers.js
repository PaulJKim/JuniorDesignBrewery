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
import { ScrollView, StyleSheet, View, Text, Image, TouchableOpacity, Button } from 'react-native';
import { Footer, Container, Icon, List, ListItem} from 'native-base';
import firebaseApp from '../firebase';
import { ImagePicker, LinearGradient } from 'expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { getReportedUsers, isAdmin, approveUser, deleteUser } from '../lib/FirebaseHelpers';

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
        isAdmin().then((adminStatus) => {
            this.setState({isAdmin: adminStatus});
        });
        getReportedUsers().then((uids) => {
            this.setState({users: uids});
        });
    }

    render() {
        return (
            <View style={{height: '100%'}}>
            <Spinner overlayColor={"rgba(0, 0, 0, 0.3)"}
                        color={"rgb(66,137,244)"}
                        visible={this.state.users == null}
                        textStyle={{color: '#000000'}} />
            <ScrollView style={{backgroundColor: '#fff'}}>
            <View style={styles.container}>

                <View>{this.renderContent()}</View>
            </View>
            </ScrollView>
            </View>
        )
    }


    renderContent() {
        return (
            <List style={styles.listStyle}>
                <List>
                    {this.renderUsersList()}
                </List>
            </List>
        );
    }

    renderUsersList() {
        if (this.state.users != null && this.state.users.length > 0) {
            return _.map(this.state.users, (user) => {

                return (
                    <ListItem key={new Date().getTime()}>
                        <TouchableOpacity style={{display: 'flex', flexDirection: 'row'}} onPress={() => this.props.navigation.navigate("ProfileView", {id: user.uid})}>
                            <View style={{flex: 1, paddingTop: 7, paddingRight: 10}}>
                                {user.image ?
                                        <Image style={{height: 50, width: 50, borderRadius: 100}} source={{ uri: user.image}} />
                                    :
                                        <Image style={{height: 50, width: 50, borderRadius: 100}} source={require('../resources/default_profile_picture.png')} />
                                }
                            </View>
                            <View style={{flex: 5}}>
                                <Text style={styles.list_item_title}>{user.username}</Text>
                                <Text style={{width: '100%'}}>"{user.description}"</Text>
                                <View>
                                    {this.state.isAdmin ? (
                                        <Button
                                        title="Delete User"
                                        onPress={this.deleteUser.bind(this, user)}
                                        color="red"
                                        >
                                        Delete
                                        </Button>
                                    ) : (
                                        null
                                    )}
                                </View>
                                <Button
                                    title="Approve User"
                                    color="green"
                                    onPress={this.approveUser.bind(this, user)}
                                >
                                </Button>
                            </View>
                        </TouchableOpacity>
                    </ListItem>
                );
            });
        } else if(this.state.users != null && this.state.users.length == 0 && !this.state.spinnerVisible) {
            return (
                <Text style={{textAlign: 'center'}}>No Reported Users Yet!</Text>
            )
        }
    }

    // Delete button listener
    deleteUser(user, e) {
        deleteUser(user.uid)
        this.setState({users: this.state.users.filter((user_iter) => user_iter != user)});
        // Remove the deleted user from the screen
    }

    // Approve button listener
    approveUser(user, e) {
        approveUser(user.uid)
        this.setState({users: this.state.users.filter((user_iter) => user_iter != user)});
        // Remove the approved user from the screen
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  }
});
