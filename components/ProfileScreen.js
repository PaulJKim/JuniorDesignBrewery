/*
* Profile Screen from the Family Friendly Brewery Tracker
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
import { Footer, Container, Icon, Fab } from 'native-base';
import firebaseApp from '../firebase';
import { ImagePicker, LinearGradient, Permissions } from 'expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { getUserData, setUserData, isAdmin, getProfilePicture, setProfilePicture } from '../lib/FirebaseHelpers';

console.disableYellowBox = true;

export class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit_mode: false,
            user: null,
            image: null,
            isAdmin: false
        }
        this.old_vals = null;
        this.old_image = null;
        this.newImage = false
    }

    componentDidMount() {
        uid = firebaseApp.auth().currentUser.uid;
        getUserData(uid).then((user) => {
            this.old_vals = Object.assign({}, user);
            this.setState({user: user, image: user.image});
        })
        isAdmin().then((adminStatus) => {
            this.setState({isAdmin: adminStatus});
        });
    }

    render() {
         if (!this.state.edit_mode) {
            return (
                <Container style={{width: '100%'}}>
                    {this.renderContent()}
                </Container>
            )
        } else {
            return (
                <Container style={{width: '100%'}}>
                    {this.renderEditContent()}
                </Container>
            )
        }
    }

    renderContent() {
        return (
            <Container>
                <Spinner overlayColor={"rgba(0, 0, 0, 0.3)"}
                color={"rgb(66,137,244)"}
                visible={(this.state.user == null)}
                textStyle={{color: '#000000'}} />
                {this.state.user != null && <View style={{flex: 1, backgroundColor: '#fff'}}>
                    <View style={{alignItems: 'center'}}>
                        <LinearGradient colors={['#0066cc', '#2196F3']} style={{width:'100%', alignItems:'center'}}>
                        {this.state.image ?
                            <View>
                                    <Image source={{ uri: this.state.image}} style={styles.image_style} />
                            </View>
                            :
                            <View>
                                    <Image source={require('../resources/default_profile_picture.png')} style={styles.image_style} />
                            </View>
                        }

                        <View style={{marginBottom: 10}}/>
                        </LinearGradient>
                    </View>
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
                            {this.state.user.age < 18 ? " You entered an invalid age. To use the app you must be 18 years old minimum " : " " + this.state.user.age + " Years Old"}
                        </Text>}
                        <View style = {{flexDirection: 'row'}}>
                            <Text style={[styles.subtitle_style2]}>Children: </Text>
                            <Text style={[styles.subtitle_style]}>{(this.state.user.num_children == 0) ? "No Children" :
                                this.state.user.num_children == 1 ? " 1 Child" : " " + this.state.user.num_children + " Children"}
                            </Text>
                        </View>
                        <View style = {{flexDirection: 'row'}}>
                            <Text style={[styles.subtitle_style2]}>Pet: </Text>
                            <Text style={[styles.subtitle_style]}>{(this.state.user.num_pet == 0) ? "No Pets" :
                                this.state.user.num_pet == 1 ? " 1 Pet" : " " + this.state.user.num_pet + " pets"}
                            </Text>
                        </View>
                        <View style = {{flexDirection: 'row'}}>
                            <Text style={[styles.subtitle_style2]}>Reviews: </Text>
                            <Text style={[styles.subtitle_style]}>{(this.state.user.reviews == 0) ? "No Reviews" :
                                this.state.user.reviews == 1 ? " 1 Review" : " " + this.state.user.reviews + " Reviews"}
                            </Text>
                        </View>
                    </View>

                    <View>
                        {this.state.isAdmin ? (
                            <Button
                                style={{fontSize: 20, color: 'red'}}
                                // styleDisabled={{color: 'red'}}
                                title="Reported Reviews"
                                onPress={() => this.props.navigation.navigate('ReportedReviews')}
                                >
                            </Button>
                        ) : (
                            null
                        )}
                    </View>

                    <View>
                        {this.state.isAdmin ? (
                            <Button
                                style={{fontSize: 20, color: 'red'}}
                                // styleDisabled={{color: 'red'}}
                                title="Reported Users"
                                onPress={() => this.props.navigation.navigate('ReportedUsers')}
                                >
                            </Button>
                        ) : (
                            null
                        )}
                    </View>

                    <Fab
                        direction="up"
                        position="bottomRight"
                        style={{ backgroundColor: 'green'}}
                        onPress={() => {this.setState({edit_mode: true}); this.newImage = false}}
                    >
                        <Icon name="md-create" />
                    </Fab>
                </View> }
                {this.state.user == null && <View style={{flex:1}}/>}
                <Footer style={styles.footer_style}>
                    {this.props.renderTabs()}
                </Footer>
            </Container>
        );
    }

    renderEditContent() {
        return (
            <Container style={{backgroundColor: '#fff'}}>
            <ScrollView>
                <View style={{backgroundColor: '#fff', flex: 1}}>
                    <View style={{alignItems: 'center', marginTop: 30}}>
                        {
                          <TouchableOpacity onPress={this.pickImage.bind(this)}>
                            <View>
                            {this.state.image ?
                                <View>
                                        <Image source={{ uri: this.state.image}} style={styles.image_style} />
                                </View>
                                :
                                <View>
                                        <Image source={require('../resources/default_profile_picture.png')} style={styles.image_style} />
                                </View>
                            }
                            </View>
                          </TouchableOpacity>}

                        <Text style={styles.title_style}>{this.state.user.username}</Text>
                    </View>
                    <View style={{width: '100%', paddingLeft: 10, flexDirection: 'row', display: 'flex'}}>
                        <Text style={[styles.subtitle_style, {marginTop: 3, color: 'black', flex: 5}]}>Name:</Text>
                        <TextInput style= {{}} multiline={true} value={this.state.user.description} onChangeText={(description) => {this.state.user.description = description; this.setState({user: this.state.user})}}></TextInput>
                        <View style={{flex: 9}}></View>
                    </View>
                    <View style={{width: '100%', paddingLeft: 10, display: 'flex', flexDirection: 'row'}}>
                        <Text style={[styles.subtitle_style, {marginTop: 3, color:'black', flex: 5}]}>Age: </Text>
                        <TextInput style={{flex: 1, paddingBottom: 5, paddingLeft: 5}} keyboardType='numeric' value={this.state.user.age + ""} onChangeText={(age) => {this.state.user.age = age.replace(/[^0-9]/g, ''); this.setState({user: this.state.user})}}></TextInput>
                        <View style={{flex: 9}}></View>
                    </View>
                    <View style={{width: '100%', paddingLeft: 10, display: 'flex', flexDirection: 'row'}}>
                        <Text style={[styles.subtitle_style, {marginTop: 3, color:'black', flex: 5}]}>Pet: </Text>
                        <TextInput style={{flex: 1, paddingBottom: 5, paddingLeft: 5}} keyboardType='numeric' value={this.state.user.num_pet + ""} onChangeText={(num_pet) => {this.state.user.num_pet = num_pet.replace(/[^0-9]/g, ''); this.setState({user: this.state.user})}}></TextInput>
                        <View style={{flex: 9}}></View>
                    </View>
                    <View style={{width: '100%', paddingLeft: 10, display: 'flex', flexDirection: 'row'}}>
                        <Text style={[styles.subtitle_style, {marginTop: 3, color:'black', flex: 5}]}>Children: </Text>
                        <TextInput style={{flex: 1, paddingBottom: 5, paddingLeft: 5}} keyboardType='numeric' value={this.state.user.num_children + ""} onChangeText={(num_children) => {this.state.user.num_children = num_children.replace(/[^0-9]/g, ''); this.setState({user: this.state.user})}}></TextInput>
                        <View style={{flex: 9}}></View>
                    </View>
                    <View style={{width: '100%', paddingLeft: 10, display: 'flex', flexDirection: 'row'}}>
                        <Text style={[styles.subtitle_style, {marginTop: 3, color:'black', flex: 5}]}>Reviews: </Text>
                        <TextInput style={{flex: 1, paddingBottom: 5, paddingLeft: 5}} keyboardType='numeric' value={this.state.user.reviews + ""} onChangeText={(reviews) => {this.state.user.reviews = reviews.replace(/[^0-9]/g, ''); this.setState({user: this.state.user})}}></TextInput>
                        <View style={{flex: 9}}></View>
                    </View>
                </View>
                </ScrollView>
                <Fab
                        direction="up"
                        position="bottomRight"
                        style={{ backgroundColor: 'green', bottom: 110}}
                        onPress={this.confirmEdits.bind(this)}>
                    <Icon name="md-checkmark" />
                </Fab>
                <Fab
                    direction="up"
                    position="bottomRight"
                    style={{ backgroundColor: 'red', bottom: 50}}
                    onPress={() => this.setState({user: Object.assign({}, this.old_vals), edit_mode: false})}>
                    <Icon name="md-close" />
                </Fab>
                <Footer style={styles.footer_style}>
                    {this.props.renderTabs()}
                </Footer>
            </Container>
        );
    }

    confirmEdits() {

        this.old_vals = Object.assign({}, this.state.user);
        setUserData(this.state.user);
        if (this.newImage) {
          setProfilePicture(this.state.image);
        }
        this.setState({edit_mode: false});
    }

    async pickImage() {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        await Permissions.askAsync(Permissions.CAMERA);
        result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1]
        })
        this.handleImage(result);
    }

    handleImage(result) {
        if (!result.cancelled) {
            this.newImage = true;
            this.setState({image: result.uri});
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
    borderRadius: 75,
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
