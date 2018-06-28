/*
* Root App File from the Family Friendly Brewery Tracker
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
import Expo from 'expo';
import { StyleSheet, Button, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { BreweryApp } from './BreweryApp'
import { LoginScreen } from './components/LoginScreen';
import { MainScreen } from './components/MainScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { BreweryScreen } from './components/BreweryScreen';
import { AddReviewScreen } from './components/AddReviewScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { ViewProfileScreen } from './components/ViewProfileScreen';

class App extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <BreweryApp/>
      </View>
    );
  }
}

const AppNavigator = StackNavigator({
    Login: { screen: LoginScreen },
    Main: { screen: MainScreen },
    Register: { screen: RegisterScreen },
    Brewery: { screen: BreweryScreen },
    AddReview: { screen: AddReviewScreen },
    ReviewView: { screen: ReviewScreen },
    ProfileView : {screen : ViewProfileScreen },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default AppNavigator;