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
      } else if(this.state.username.trim().length > 20) {
        this.setState({errorMessage: "Username must be less than 20 characters", registerFailed: true});
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

        firebaseApp.database().ref("Users/" + currentUser.uid).set({
          metadata:{
            viewable: true
          },
          publicData:{
            age: 18,
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
          age: 18,
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
