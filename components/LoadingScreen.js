/*
* Load up Screen from the Family Friendly Brewery Tracker
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

import React, { Component } from 'react';
import { Text } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

export class LoadingScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
        headerStyle:  { backgroundColor: "#2196F3", },
        headerTitleStyle: { color: "#FFFFFF" },
        headerTintColor: "white"
    });

  constructor(props) {
    super(props);
  }

  componentDidMount() {
      const navAction = NavigationActions.navigate({routeName: "Main", params: {navigation: this.props.navigation}})
      const resetAction = StackActions.reset({
          index: 0,
          actions: [navAction]
      });

      this.props.navigation.dispatch(resetAction);
  }

  render() {
      return (
          <Text style={{fontSize:12}}></Text>
    );
  }
  }
