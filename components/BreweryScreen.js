import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Image, ScrollView } from 'react-native';
import { Footer, Container, Icon, List, ListItem } from 'native-base';
import _ from 'lodash';
import Brewery from '../models/Brewery';
import firebaseApp from '../firebase';
import FAB from 'react-native-fab';


export class BreweryScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Brewery Details",
        headerStyle:  { backgroundColor: "#2196F3", },
        headerTitleStyle: { color: "#FFFFFF" },
        headerTintColor: "blue"
    });

    constructor(props) {
        super(props);
        this.state = {
            brewery: this.props.navigation.state.params.brewery,
            reviews: [],
        }
        firebaseApp.database().ref("Reviews").on('value', (snapshot) => {
            this.state.reviews = [];
            var keys = Object.keys(snapshot.val());
            keys.forEach((key) => {
                if (snapshot.val()[key].brewery == this.state.brewery.placeId) {
                    this.state.reviews.push(snapshot.val()[key]);
                }
            });
            this.setState({reviews: this.state.reviews});
        });
    }

    render() {
        return (
            <ScrollView style={{backgroundColor: '#fff'}}>
            <View style={styles.container}>
                <Image
                    style={{width: '100%', height: 200}}
                    source={{uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&key=AIzaSyDiooLoAXwvs42CPdgVKhqRwjqiUHok8gs&photoreference=' + this.state.brewery.photo}}
                />

                <Text style={styles.title}>{this.state.brewery.name}</Text>

                <Text style={styles.subtitle}>Reviews</Text>
                {this.renderContent()}
                
                <Button title="Add Review" onPress={() => this.props.navigation.navigate("AddReview", {navigation: this.props.navigation, brewery: this.state.brewery})}></Button>
            </View>
            </ScrollView>
            
        )
    }

    renderContent() {
        return (
            <List style={styles.listStyle}>
                <List>
                    {this.renderReviewsList()}
                </List>
            </List>
        );
    }

    renderReviewsList() {
        console.log(this.state.reviews);
        return _.map(this.state.reviews, (rev) => {
                return (
                    <ListItem key={new Date().getTime()}>
                        <View style={{width: '100%'}}>
                        <Text style={styles.list_item_title}>{rev.username}</Text>
                        <Text style={{width: '100%'}}>{rev.comments}</Text>
                        </View>
                    </ListItem>
                )
            })
    }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  list_item_title: {
      fontWeight: 'bold',
  }
});