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
import { Content } from 'native-base';
import firebaseApp from '../firebase';
import { NavigationActions } from 'react-navigation';

export class ResetPassword extends React.Component {
  static navigationOptions = ({ navigation }) => ({
        title: "Reset Password",
        headerStyle:  { backgroundColor: "#2196F3", },
        headerTitleStyle: { color: "#FFFFFF" },
        headerLeft: null,
    });


  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
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
        <Content style={{backgroundColor:"white"}}>
            <View style={styles.container}>
                  {this.renderComponent()}
            </View>
        </Content>
    );
  }

  renderComponent() {
    return (
      <View style={styles.container}>

        <View style={{flex:1}}/>

        <View style={{flex:1}}>
          <Text style={styles.logo}>Family Friendly Brewery Tracker</Text>
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

              <TouchableOpacity
                  style={styles.button}
                  onPress={this.resetPassword.bind(this)}>
                  <Text style={{color:"#FFF", fontSize:16, fontWeight:'bold'}}>RESET</Text>
              </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
          <View style={{flex:2}}>
              <View>
                  { this.state.loginFailed && <Text style={{color: "#ff0000", textAlign:'center'}}>{this.state.error}</Text>}
              </View>
          </View>
      </View>
    );
  }

  resetPassword() {
    var s = firebaseApp.auth().sendPasswordResetEmail(this.state.email.trim())
      .then(() => {
        this.props.navigation.dispatch(NavigationActions.back());
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
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
