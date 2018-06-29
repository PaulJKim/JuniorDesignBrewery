/*
* Login Screen from the Family Friendly Brewery Tracker
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
import { Platform, BackHandler, StyleSheet, Button, Text, TextInput, ViewText, View, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import firebaseApp from '../firebase';
import { NavigationActions } from 'react-navigation';

export class LoginScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
        title: "Login",
        headerStyle:  { backgroundColor: "#2196F3", },
        headerTitleStyle: { color: "#FFFFFF" },
        headerLeft: null, 
    });


  constructor(props) {
    super(props);
    this.state = {
      email: "", 
      password: "",
      error: "",
      loginFailed: false,
      loginClicked: false,
    };
    global.main = false;
  }

  componentWillMount() {
    t = this;
    if(Platform.OS === 'android') {
        BackHandler.addEventListener('hardwareBackPress', function() {          
          this.props.navigation.dispatch(NavigationActions.back());
          return true;
        }.bind(this));
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

        <View style={{flex:1}}/>          

        <View style={{flex:1}}>
          <Text style={styles.logo}>Family Friendly Brewery Trackr</Text>
        </View>


        <KeyboardAvoidingView behavior="padding" style={{flex:4}}>

            <View style={{flex:3, alignItems:'center', paddingTop:70}}>

              <TextInput
                style={styles.textinput}
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
                placeholder="Email" 
                keyboardType={'email-address'}
                autoCapitalize={'none'}
                />

              <TextInput
                style={styles.textinput}
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                secureTextEntry={true}
                placeholder="Password" />

              <TouchableOpacity 
                  style={styles.button}
                  onPress={this.login.bind(this)}>
                  <Text style={{color:"#FFF", fontSize:16, fontWeight:'bold'}}>LOGIN</Text>
              </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
          <View style={{flex:2}}>
              <View>
                  { this.state.loginFailed && <Text style={{color: "#ff0000", textAlign:'center'}}>{this.state.error}</Text>}
              </View>
              <View>
                <TouchableOpacity
                  style={{width:'100%'}}
                  onPress={() => this.props.navigation.navigate("Register", {navigation: this.props.navigation})}>
                  <Text 
                    style={{color:'blue', textAlign:'center', marginVertical: 15}}> 
                    Need an account? Click here! 
                  </Text> 
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={{width:'100%'}}
                  onPress={this.returnToAppHandler.bind(this)}>
                  <Text 
                    style={{color:'blue', textAlign:'center', marginVertical: 15}}> 
                    Return to application 
                  </Text> 
                </TouchableOpacity>
              </View>
          </View>
      </View>
    );
  }

  returnToAppHandler() {
      this.props.navigation.dispatch(NavigationActions.back());
  }

  login() {
    this.setState({loginClicked: true, loginFailed: false});
    var s = firebaseApp.auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
      .then(() => {
        if (this.props.navigation.state.params.brewery !== undefined) {
          this.props.navigation.dispatch(NavigationActions.back());
        } else {
          this.props.navigation.navigate("Main", {navigation: this.props.navigation});
        }
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.setState({error: errorMessage, loginFailed: true, loginClicked: false});
    });
  }
}
const styles = StyleSheet.create({
  container: {
    display:'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  textinput: {
    height: 58,
    fontSize: 18, 
    minWidth: '87%',
    maxWidth: '87%', 
    marginBottom: 5,
    borderColor: 'gray', 
    borderWidth: 0
  },
  button: { 
    height: 40, 
    width:'87%', 
    marginVertical: 25, 
    backgroundColor:"#2196F3", 
    borderRadius:3, 
    alignItems:'center', 
    justifyContent:'center',
  },
  logo: {
    textAlign: 'center', 
    color:"#2196F3", 
    fontWeight: 'bold', 
    fontSize: 35, 
    marginVertical: 10,
  }
});
