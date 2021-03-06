/*
* Main Screen from the Family Friendly Brewery Tracker
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
import { Platform, TouchableOpacity, StyleSheet, Text, TextInput, View, BackHandler, Alert } from 'react-native';
import { MapView } from 'expo';
import { FooterTab, Icon, Button, Footer, Container } from 'native-base';
import { MapScreen } from './MapScreen';
import { FavoritesScreen } from './FavoritesScreen';
import { YourReviewsScreen } from './YourReviewsScreen';
import { ProfileScreen } from './ProfileScreen';
import ModalDropdown from 'react-native-modal-dropdown';
import firebaseApp from '../firebase';
import { NavigationActions, StackActions } from 'react-navigation';
import { isLoggedIn } from '../lib/FirebaseHelpers';
import { LoginScreen } from './LoginScreen';
import { AndroidBackHandler } from 'react-navigation-backhandler';

const MAP_TAB = "Breweries";
const FAVORITES_TAB = "Your Favorites";
const YOUR_REVIEWS_TAB = "Your Reviews";
const PROFILE_TAB = "Your Profile";

export class MainScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.tab,
        headerStyle:  { backgroundColor: "#2196F3", },
        headerTitleStyle: { color: "#FFFFFF" },
        headerTintColor: "white",
        headerLeft: (
            <TouchableOpacity onPress={() => {
                if(isLoggedIn()) {
                    Alert.alert(
                    'Log Out',
                    'Are you sure you want to log out?',
                    [
                    {text: 'No', style: 'cancel'},
                    {text: 'Yes', onPress: () => {navigation.state.params.parent.signOutUser()}},
                    ],
                    { cancelable: false });
                } else {
                    navigation.navigate("Login", {navigation: navigation, brewery: ""});
                }
            }}>
                <View style={{marginLeft: 15}}>
                    {
                        isLoggedIn() ?
                        <Icon name='md-log-out' style={{color:'white'}}/>
                        :
                        <Icon name='md-log-in' style={{color:'white'}}/>
                    }

                </View>
            </TouchableOpacity>
        ),
         headerRight: (
            <View style={{display:'flex', flexDirection:'row', marginRight: 30}}>
                {navigation.state.params.tab == MAP_TAB &&
                    <TouchableOpacity style={{flex: 1}}
                    onPress={() => {global.mapVisible = !global.mapVisible; navigation.state.params.parent.setState({}); navigation.setParams({});}}>
                <Icon name={(global.mapVisible) ? "list" : "md-map"} style={{color:"white"}}/>
                </TouchableOpacity>}
                <TouchableOpacity style={{flex: 1, marginLeft:20}}
                    onPress={()=>{navigation.navigate("Policy", {navigation: navigation, policyType: "License"});}}>
                <Icon name="md-information-circle" style={{color: "white"}}/>
                </TouchableOpacity>
            </View>),
    });
    componentDidMount() {
        // set handler method with setParams
        this.props.navigation.setParams({
          sortClick: this._sortClick.bind(this),
          tab: this.state.selectedTab,
          parent: this,
        });
        global.main = true;
        firebaseApp.auth().onAuthStateChanged(function(user) {
            if (user) {
                global.main = true;
            } else {
                global.main = false;
            }
          });
    }
  constructor(props) {
    super(props);
    this.state = {
        selectedTab: MAP_TAB,
        title: "Map",
        sort:"Alphabetical",
    };
    global.main = true;

  }

  // componentWillMount() {
  //   t = this;
  //   if(Platform.OS === 'android') {
  //       BackHandler.addEventListener('hardwareBackPress', function() {
  //             if(isLoggedIn()) {
  //               Alert.alert(
  //                   'Log Out',
  //                   'Are you sure you want to log out?',
  //                   [
  //                   {text: 'No', style: 'cancel'},
  //                   {text: 'Yes', onPress: () => {t.signOutUser()}},
  //                   ],
  //                   { cancelable: false }
  //               );
  //           } else {
  //               // Need to exit the app instead?
  //               this.props.navigation.navigate("Login", {navigation: this.props.navigation, brewery: ""});
  //           }
  //           return true;
  //       }.bind(this));
  //   }
  // }

    onBackButtonPressAndroid() {
        /*
        *   Returning `true` from `onBackButtonPressAndroid` denotes that we have handled the event,
        *   and react-navigation's lister will not get called, thus not popping the screen.
        *
        *   Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.
        * */
        if(isLoggedIn()) {
            Alert.alert(
                'Log Out',
                'Are you sure you want to log out?',
                [
                {text: 'No', style: 'cancel'},
                {text: 'Yes', onPress: () => {this.signOutUser()}},
                ],
                { cancelable: false }
            );
            return true;
        } else {
            return false;
        }
    };

  _sortClick(index) {
    if(index == 0)
        this.setState({sort:"Distance"})
    else if(index == 1)
        this.setState({sort:"Alphabetical"})
    else if(index == 2)
        this.setState({sort:"Rating"})
    this.forceUpdate()
  }

  signOutUser = () => {
    // const resetAction = NavigationActions.reset({
    //   index: 1,
    //   key: null,
    //   actions: [
    //     // NavigationActions.navigate({ routeName: 'Main' }),
    //     NavigationActions.navigate({ routeName: 'MapScreen' }),
    //     NavigationActions.navigate({ routeName: 'Login' }),
    //   ],
    // });

    // firebaseApp.auth().signOut().then(() => {
    //     this.props.navigation.dispatch(resetAction);
    // }).catch(function(error) {
    //     //An error occured on signout
    // });
    firebaseApp.auth().signOut().then(() => {
        const mainAction = NavigationActions.navigate({routeName: "Main", params: {navigation: this.props.navigation}});
        const loginAction = NavigationActions.navigate({routeName: "Login", params: {navigation: this.props.navigation}});
        const resetAction = StackActions.reset({
            index: 1,
            actions: [mainAction, loginAction]
        });
        this.props.navigation.dispatch(resetAction);
    }).catch(function(error) {
        //An error occured on signout
    });

    // this.props.navigation.navigate("Login", {navigation: this.props.navigation});
}
  render() {
    return (
      <View style={styles.container}>
        {this.renderComponent()}
      </View>
    );
  }

  renderComponent() {
    return (
      <View style={styles.container}>
          {this.renderPageContent()}
      </View>
    );
  }

  renderPageContent() {
    // this.props.navigation.setParams({
    //     tab: this.state.selectedTab
    // });
        switch (this.state.selectedTab) {
            case MAP_TAB:
                return (
                    <MapScreen
                        renderTabs={() => this.renderTabs()}
                        navigation={this.props.navigation}
                        sort={this.state.sort}
                    />
                );
            case FAVORITES_TAB:
                return (
                <FavoritesScreen
                        renderTabs={() => this.renderTabs()}
                        navigation={this.props.navigation}
                        sort={this.state.sort}
                    />
                );
            case YOUR_REVIEWS_TAB:
                return (
                <YourReviewsScreen
                        renderTabs={() => this.renderTabs()}
                        navigation={this.props.navigation}
                        sort={this.state.sort}
                    />
                );
            case PROFILE_TAB:
                return (
                <ProfileScreen
                        renderTabs={() => this.renderTabs()}
                        navigation={this.props.navigation}
                    />
                );

            default: return null;
        }

  }

  renderTabs() {
    return (
    <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid.bind(this)}>
      <Container>
        <Footer>
            <FooterTab tabActiveBgColor="#FFFFF" style={{backgroundColor: '#2196f3'}}>
                {this.state.selectedTab == MAP_TAB && <Button
                    active={this.state.selectedTab === MAP_TAB}
                    onPress={() => this.changeTab(MAP_TAB)}
                    style={{backgroundColor: '#2196f3'}}
                >
                    <Icon name="md-beer" style={{color: "#FFF"}}/>
                </Button>}

                {this.state.selectedTab != MAP_TAB && <Button
                    active={this.state.selectedTab === MAP_TAB}
                    onPress={() => this.changeTab(MAP_TAB)}
                    style={{backgroundColor: '#2196f3'}}
                >
                    <Icon name="md-beer" style={{color: 'rgba(255, 255, 255, 0.5)'}}/>
                </Button>}

                {this.state.selectedTab == FAVORITES_TAB && <Button
                    active={this.state.selectedTab === FAVORITES_TAB}
                    onPress={() => this.changeTab(FAVORITES_TAB)}
                    style={{backgroundColor: '#2196f3'}}
                >
                    <Icon name="star" style={{fontSize: 28, color: '#FFF'}}/>
                </Button>}

                {this.state.selectedTab != FAVORITES_TAB && <Button
                    active={this.state.selectedTab === FAVORITES_TAB}
                    onPress={() => {
                        if (isLoggedIn()) {
                            this.changeTab(FAVORITES_TAB);
                        } else {
                            this.props.navigation.navigate("Login", {navigation: this.props.navigation, brewery: ""});
                        }
                    }}
                    style={{backgroundColor: '#2196f3'}}
                >
                    <Icon name="star" style={{fontSize: 28, color: 'rgba(255, 255, 255, 0.5)'}}/>
                </Button>}

                {this.state.selectedTab == YOUR_REVIEWS_TAB && <Button
                    active={this.state.selectedTab === YOUR_REVIEWS_TAB}
                    onPress={() => this.changeTab(YOUR_REVIEWS_TAB)}
                    style={{backgroundColor: '#2196f3'}}
                >
                    <Icon name="list" style={{color: "#FFF"}}/>
                </Button>}

                {this.state.selectedTab != YOUR_REVIEWS_TAB && <Button
                    active={this.state.selectedTab === YOUR_REVIEWS_TAB}
                    onPress={() => {
                        if (isLoggedIn()) {
                            this.changeTab(YOUR_REVIEWS_TAB);
                        } else {
                            this.props.navigation.navigate("Login", {navigation: this.props.navigation, brewery: ""});
                        }
                    }}
                    style={{backgroundColor: '#2196f3'}}
                >
                    <Icon name="list" style={{color: 'rgba(255, 255, 255, 0.5)'}}/>
                </Button>}

                {this.state.selectedTab == PROFILE_TAB && <Button
                    active={this.state.selectedTab === PROFILE_TAB}
                    onPress={() => this.changeTab(PROFILE_TAB)}
                    style={{backgroundColor: '#2196f3'}}
                >
                    <Icon name="md-person" style={{color: "#FFF"}}/>
                </Button>}

                {this.state.selectedTab != PROFILE_TAB && <Button
                    active={this.state.selectedTab === PROFILE_TAB}
                    onPress={() => {
                        if (isLoggedIn()) {
                            this.changeTab(PROFILE_TAB);
                        } else {
                            this.props.navigation.navigate("Login", {navigation: this.props.navigation, brewery: ""});
                        }
                    }}
                    style={{backgroundColor: '#2196f3'}}
                >
                    <Icon name="md-person" style={{color: 'rgba(255, 255, 255, 0.5)'}}/>
                </Button>}
            </FooterTab>
        </Footer>
      </Container>
  </AndroidBackHandler>
    );
  }

  changeTab(tabName) {
    this.props.navigation.setParams({tab: tabName})
        this.setState({selectedTab: tabName, title: tabName});
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
});
