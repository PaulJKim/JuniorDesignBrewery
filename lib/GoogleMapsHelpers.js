
export function getPlaceDetails(placeId) {
  var url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='
  + placeId + "&key=" + Expo.Constants.manifest.android.config.googleMaps.apiKey
  + '&fields=name,geometry,address_component,photo'
  return fetch(url).then((response) => {
    return response.json()
  }).then((response) => {
    var brewery = {}
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
