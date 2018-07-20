/*
* External Screen from the Family Friendly Brewery Tracker
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
import { StyleSheet, View, Text, Image, TouchableHighlight, TouchableOpacity, ScrollView, Button, Alert } from 'react-native';
import { Footer, Container, List, ListItem, Button as BaseButton, Icon } from 'native-base';
import { ImagePicker, LinearGradient } from 'expo';
import Spinner from 'react-native-loading-spinner-overlay';
import StarRating from 'react-native-star-rating';
import { getUserData, reportUser, isLoggedIn } from '../lib/FirebaseHelpers'
console.disableYellowBox = true;

export class ViewProfileScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Profile",
        headerStyle:  { backgroundColor: "#2196F3", },
        headerTitleStyle: { color: "#FFFFFF" },
        headerTintColor: "white",
    });

    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
        global.main = false;
    }

    componentDidMount() {
      getUserData(this.props.navigation.state.params.id).then((user) => {
          this.setState({user: user})
      });
    }

    render() {
        return (
            <ScrollView>
            <Container>
                <Spinner overlayColor={"rgba(0, 0, 0, 0.3)"}
                color={"rgb(66,137,244)"}
                visible={(this.state.user == null)}
                textStyle={{color: '#000000'}} />
                {this.state.user != null && <View style={{flex: 1, backgroundColor: '#fff'}}>
                    <View style={{alignItems: 'center'}}>
                        <LinearGradient colors={['#0066cc', '#2196F3']} style={{width:'100%', alignItems:'center'}}>
                        <TouchableHighlight>
                            <View>
                                {this.state.user.image != null ?
                                  <Image source={{ uri: this.state.user.image}} style={styles.image_style} />
                                  :
                                  <Image source={require('../resources/default_profile_picture.png')} style={styles.image_style} />
                                }

                            </View>
                        </TouchableHighlight>
                        <Text style={styles.title_style}>{this.state.user.username}</Text>

                        <View style={{marginBottom: 10}}/>
                        </LinearGradient>

                        <View style={{width: '100%', padding: 10}}>
                            <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={styles.title_style}>{this.state.user.username}</Text>
                          </View>
                          <View style = {{flexDirection: 'row'}}>
                                <Text style={[styles.subtitle_style2]}>Name: </Text>
                                <Text style={styles.subtitle_style3}>{this.state.user.description}</Text>
                            </View>
                                {this.state.user.age > 0 && <Text style={[styles.subtitle_style]}>
                                <Text style={[styles.subtitle_style2]}>Age: </Text>
                                {this.state.user.age < 18 ? " You entered an invalid age. To use the app you must be 18 years old minimum " : " " + this.state.user.age.toString() + " Years Old"}
                            </Text>}
                            <View style = {{flexDirection: 'row'}}>
                                <Text style={[styles.subtitle_style2]}>Children: </Text>
                                <Text style={[styles.subtitle_style]}>{(this.state.user.num_children == 0) ? "No Children" :
                                    this.state.user.num_children == 1 ? " 1 Child" : " " + this.state.user.num_children + " Children"}
                                </Text>
                            </View>
                            <View style = {{flexDirection: 'row'}}>
                                <Text style={[styles.subtitle_style2]}>Pets: </Text>
                                <Text style={[styles.subtitle_style]}>{(this.state.user.num_pet == 0) ? "No Pets" :
                                    this.state.user.num_pet == 1 ? " 1 Pet" : " " + this.state.user.num_pet + " pets"}
                                </Text>
                            </View>
                        </View>

                    </View>
                    <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <BaseButton danger bordered style={{margin:20}} onPress={this.reportFunction.bind(this)}>
                            <Icon name="flag" type="simpleLineIcons" style={{color:'#FF4136'}}/>
                        </BaseButton>
                    </View>
                </View> }
                {this.state.user == null && <View style={{flex:1}}/>}

            </Container>
            </ScrollView>
        );
    }

    reportFunction() {
        if (isLoggedIn()) {
            Alert.alert(
                'Report User',
                'Do you wish to report this review for inappropriate content?',
                [
                {text: 'No', style: 'cancel'},
                {text: 'Yes', onPress: () => reportUser(this.state.user.uid)},
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
          color: 'rgba(255, 255, 255, 0.95)',
      },
      subtitle_style: {
          fontSize: 15,
          color: 'rgba(0, 0, 0, 0.7)',
          marginTop: 10,
      },
      subtitle_style2: {
        fontSize: 15,
        color: 'rgb(0, 0, 0)',
        fontWeight: 'bold',
        marginTop: 10,
      },
      subtitle_style3: {
        fontSize: 15,
        color: 'rgba(0, 0, 0, 0.7)',
        marginTop: 10,
      }
})
