/*
* Registration Screen from the Family Friendly Brewery Tracker
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
import {
  StyleSheet,
  Button,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
 } from 'react-native';
import { CheckBox, ListItem } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebaseApp from '../firebase';

const default_profile_picture = "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";

export class RegisterScreen extends React.Component {


  static navigationOptions = ({ navigation }) => ({
        title: "Register",
        headerStyle:  { backgroundColor: "#2196F3", },
        headerTitleStyle: { color: "#FFFFFF" },
        headerTintColor: "white"
    });


  constructor(props) {
    super(props);
    global.main = false;
    this.state = {
      email: "",
      password: "",
      username: "",
      registerClicked: false,
      registerFailed: false,
      errorMessage: "",
      ageAgreementChecked: false,
      userPolicyChecked: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text style={{textAlign:'left', color:'gray'}}>You'll use your email and password to login in</Text>
        <Text style={{textAlign:'left', color:'gray'}}>Your username will appear alongside your reviews</Text>

        <TextInput
            style={styles.textinput}
            onChangeText={(username) => this.setState({username})}
            value={this.state.username}
            placeholder="Username" />
          <TextInput
            style={styles.textinput}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            keyboardType={'email-address'}
            placeholder="Email"
            autoCapitalize={'none'}
            />
          <TextInput
            style={styles.textinput}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            secureTextEntry={true}
            placeholder="Password" />

          <View style={styles.checkboxContainer}>
            <CheckBox checked={this.state.ageAgreementChecked}
                      onPress={()=>this.setState({ageAgreementChecked: !this.state.ageAgreementChecked})} />
            <Text style={styles.checkboxText}>I am 18 years or older</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox checked={this.state.userPolicyChecked}
                      onPress={()=>this.setState({userPolicyChecked: !this.state.userPolicyChecked})} />
            <Text style={styles.checkboxText}>I have read and agree to the&nbsp;
              <Text onPress={()=>{this.props.navigation.navigate("Policy", {navigation: this.props.navigation, policyType: "Privacy Policy"});}} style={styles.policyLinks}>privacy</Text>&nbsp;policy
            </Text>
          </View>


          { this.state.registerClicked && <ActivityIndicator size="large" style={{marginTop: 10}} color="#00ff00"/>}
          <TouchableOpacity
            style={styles.button}
            onPress={this.register.bind(this)}>
            <Text style={{color:"#FFF", fontSize:16, fontWeight:'bold'}}>REGISTER</Text>
          </TouchableOpacity>
          { this.state.registerFailed && <Text style={{color: "#ff0000"}}>{this.state.errorMessage}</Text>}
        </KeyboardAvoidingView>
      </View>
    );
  }

  renderLoadingDialog(){
        return (
            <LoadingDialog
                dialogProps={{
                    isOpen: this.requestId != null && this.requestStore.getRequestStatus(this.requestId) === RequestStatus.Pending,
                    title: "Creating...",
                    animationType: "fade"
                }}
                subtitle="Creating client..."

            />
        );
    }

  register() {

      if(!this.state.username || this.state.username.trim().length == 0) {
        this.setState({errorMessage: "Please enter a username", registerFailed: true});
        return;
      } else if(!this.state.ageAgreementChecked)  {
        this.setState({errorMessage: "Please confirm you are over 18 years old", registerFailed: true});
        return;
      } else if(!this.state.userPolicyChecked) {
        this.setState({errorMessage: "Please agree to the user and privacy agreements", registerFailed: true});
        return;
      }
      this.setState({registerClicked: true, registerFailed: false});
      var s = firebaseApp.auth().createUserWithEmailAndPassword(this.state.email.trim(), this.state.password).then(() => {
        currentUser = firebaseApp.auth().currentUser;
        av = []
        av.push(default_profile_picture);

        firebaseApp.database().ref("Users/" + currentUser.uid).set({
          metadata:{
            viewable: true
          },
          publicData:{
            age: -1,
            avatar: av,
            description: "None",
            num_children: 0,
            num_pet: 0,
            reviews: 0,
            username: this.state.username.trim()
          },
          privateData:{
            email: this.state.email.trim()
          }
        });

        this.state.user = {
          username: this.state.username.trim(),
          email: this.state.email.trim(),
          description: "None",
          avatar: av,
          age: -1,
          num_children: 0,
          num_pet: 0,
          reviews: 0,
        }
        this.state.registerClicked = false;
        this.setState({});
        this.props.navigation.navigate("Main", {navigation: this.props.navigation});
      }).catch((error) => {
          this.setState({registerClicked: false});
          this.setState({registerFailed: true});
          this.setState({errorMessage: error.message})
      });
  }

}

const styles = StyleSheet.create({
  container: {
    display:'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100%'
  },
  checkboxContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    minWidth: '80%',
    maxWidth: '80%',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10
  },
  checkbox: {
    marginRight: 5,
    marginLeft: 5
  },
  checkboxText: {
    maxWidth: '100%',
    marginLeft: 20,
    fontSize: 14
  },
  textinput: {
    height: 58,
    fontSize: 18,
    minWidth: '80%',
    maxWidth: '80%',
    marginTop: 5,
    marginBottom: 5,
    borderColor: 'gray',
    borderWidth: 0
  },
  policyLinks: {
    color:"blue",
    textDecorationLine: "underline"
  },
  button: {
    height: 40,
    width: 220,
    marginVertical: 10,
    backgroundColor:"#2196F3",
    borderRadius:3,
    alignItems:'center',
    justifyContent:'center' }
});
