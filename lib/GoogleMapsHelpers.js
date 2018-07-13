import { Location, Permissions } from 'expo';
import { getOverallAverage } from './FirebaseHelpers'

export function getPlaceDetails(placeId) {
  const url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='
  + placeId + "&key=" + Expo.Constants.manifest.android.config.googleMaps.apiKey
  + '&fields=name,geometry,address_component,photo'
  return fetch(url).then((response) => {
    return response.json()
  }).then((response) => {
    var brewery = {}
    brewery.placeId = placeId
    brewery.name = response.result.name
    brewery.latitude = response.result.geometry.location.lat
    brewery.longitude = response.result.geometry.location.lng
    response.result.address_components.forEach((component) => {
      if (component.types[0] == "locality") {
        brewery.city = component.short_name
      }
      if (component.types[0] == "administrative_area_level_1") {
        brewery.state = component.short_name
      }
    })
    brewery.photo = response.result.photos[0].photo_reference
    return Promise.resolve(brewery)
  });
}

export function getBreweries(lat, lng, radius) {
  const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/'
              + 'json?key=' + Expo.Constants.manifest.android.config.googleMaps.apiKey
              + '&location=' + lat + ',' + lng
              + '&radius=' + radius
              + '&name=brewery&keyword=brewery'
              + '&fields=name,geometry,place_id,photos'
  return fetch(url).then((response) => {
    return response.json();
  }).then((responseJSON) => {
      breweries = responseJSON.results.map((breweryResponse) => {
          let brewery = {};
          brewery.name = breweryResponse.name;
          brewery.latitude = breweryResponse.geometry.location.lat;
          brewery.longitude = breweryResponse.geometry.location.lng;
          brewery.placeId = breweryResponse.place_id;
          if (breweryResponse.photos) {
              brewery.photo = breweryResponse.photos[0].photo_reference;
          }
          return brewery;
      });
      return Promise.resolve(breweries);
  });
}

export function findLocation(query) {
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?'
              + 'address=' + query
              + '&key=' + Expo.Constants.manifest.android.config.googleMaps.apiKey
  return fetch(url).then((response) => {
    return response.json();
  }).then((responseJSON) => {
    return Promise.resolve(responseJSON.results[0].geometry.location);
  });
}

/*
  Calculates the distance between two points in miles
*/
export function calculateDistance(lat1, lng1, lat2, lng2) {
  return geolib.getDistance({latitude: lat1, longitude: lng1}, {latitude: lat2, longitude: lng2}) * 0.000621371;
}

export function getLocation() {
  return  Permissions.askAsync(Permissions.LOCATION).then(() => {
    return Location.getCurrentPositionAsync({});
  }).then((location) => {
    return Promise.resolve(location.coords);
  }).catch(() => {
    return Promise.resolve({latitude: 0, longitude: 0});
  })
}
