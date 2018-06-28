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
import { NavigationActions } from 'react-navigation';

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
                Alert.alert(
                'Log Out',
                'Are you sure you want to log out?',
                [
                {text: 'No', style: 'cancel'},
                {text: 'Yes', onPress: () => {navigation.state.params.parent.signOutUser()}},
                ],
                { cancelable: false }
            ); }}>
                <View style={{marginLeft: 15}}>
                    <Icon name='md-arrow-back' style={{color:'white'}}/>
                </View>
            </TouchableOpacity>
        ),
         headerRight: (
            <View style={{width:80, display:'flex', flexDirection:'row'}}>

                <TouchableOpacity style={{flex: 1}}
                    onPress={() => {global.mapVisible = !global.mapVisible; navigation.state.params.parent.setState({}); navigation.setParams({});}}>                 
                <Icon name={(global.mapVisible) ? "list" : "md-map"} style={{color: [(navigation.state.params.tab == MAP_TAB) ? 'white' : '#2196F3']}}/>
                </TouchableOpacity>

                <View style={{flex:1, marginRight: 15}}>
                {(navigation.state.params.tab !== PROFILE_TAB && navigation.state.params.tab !== FAVORITES_TAB) 
                        && <ModalDropdown dropdownStyle = {{flexDirection:'row', height:127}} 
                        dropdownTextStyle={{fontWeight:'bold', fontSize:16, color:'black'}}
                        options={['Distance', 'Name', 'Rating']}
                        onSelect = {(index, value) => {navigation.state.params.sortClick(index)}}>                        
                        <Icon style={{paddingLeft: 20, color:"#FFFFFF"}}name="md-more"/>
                    </ModalDropdown>}
                </View>
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

  componentWillMount() {
    t = this;
    if(Platform.OS === 'android') {
        BackHandler.addEventListener('hardwareBackPress', function() {          
              if(global.main) {
                Alert.alert(
                    'Log Out',
                    'Are you sure you want to log out?',
                    [
                    {text: 'No', style: 'cancel'},
                    {text: 'Yes', onPress: () => {t.signOutUser()}},
                    ],
                    { cancelable: false }
                );        
            } else {
                t.props.navigation.dispatch(NavigationActions.back());
            } 
            return true;
        }.bind(this));
    }
  }
  _sortClick(index) {
    if(index == 0)
        this.setState({sort:"Distance"})
    else if(index == 1)
        this.setState({sort:"Alphabetical"})
    else if(index == 2)
        this.setState({sort:"Rating"})    
    this.forceUpdate()
  }

  signOutUser = async () => {
    try {
        await firebaseApp.auth().signOut();
        this.props.navigation.dispatch(NavigationActions.back());
    } catch (e) {
    }
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
                    onPress={() => this.changeTab(FAVORITES_TAB)}
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
                    onPress={() => this.changeTab(YOUR_REVIEWS_TAB)}
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
                    onPress={() => this.changeTab(PROFILE_TAB)}
                    style={{backgroundColor: '#2196f3'}}
                >
                    <Icon name="md-person" style={{color: 'rgba(255, 255, 255, 0.5)'}}/>
                </Button>}
            </FooterTab>
        </Footer>
      </Container>
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