import firebaseApp from '../firebase';
import { getPlaceDetails } from './GoogleMapsHelpers'

export function getUserData(uid) {
	databaseReference = firebaseApp.database().ref("/Users/" + uid + "/publicData");
	return Promise.all([databaseReference.once("value"), getProfilePicture(uid)]).then(([snapshot, image]) => {
		var userData = snapshot.val();
		userData.uid = uid;
		userData.image = image
		return Promise.resolve(userData);
	});
}

export function setUserData(userData) {
	uid = firebaseApp.auth().currentUser.uid;
	databaseReference = firebaseApp.database().ref("/Users/" + uid + "/publicData");
	return databaseReference.set(userData);
}

/*
To ensure that people don't report the same user more than once, the reports
list consists of a list of uids of users that did reports.
*/
export function reportUser(uid) {
    ourUid = firebaseApp.auth().currentUser.uid;
    databaseReference = firebaseApp.database().ref("Users/" + uid + "/metadata/reports/" + ourUid);
    return databaseReference.set(true).then(() => {
        databaseReference = firebaseApp.database().ref("ReportedUsers/" + uid);
        return databaseReference.set(true);
    });
}

/*
To ensure that people don't report the same review more than once, the reports
list consists of a list of uids of users that did reports.
*/
export function reportReview(reviewId) {
    ourUid = firebaseApp.auth().currentUser.uid;
    databaseReference = firebaseApp.database().ref("Reviews/" + reviewId + "/metadata/reports/" + ourUid);
    return databaseReference.set(true).then(() => {
        databaseReference = firebaseApp.database().ref("ReportedReviews/" + reviewId);
        return databaseReference.set(true);
    });
}

/*
Gets a list of all reviews of a brewery. Reviews that are not viewable are not
added to the list.
*/
export function getBreweryReviews(breweryId) {
	databaseReference = firebaseApp.database().ref("Breweries/" + breweryId + "/reviews/");
	return databaseReference.once("value").then((reviewIds) => {
		if (reviewIds.exists()) {
			reviewPromises = [];
			Object.keys(reviewIds.val()).forEach((reviewId) => {
				reviewPromises.push(getReview(reviewId));
			});
			return Promise.all(reviewPromises);
		} else {
			return Promise.resolve([]);
		}
	}).then((reviews) => {
		return Promise.resolve(reviews.filter((review) => review != null));
	});
}

export function getOverallAverage(breweryId) {
	databaseReference = firebaseApp.database().ref("Breweries/" + breweryId + "/reviews/");
	return databaseReference.once("value").then((reviewIds) => {
		if (reviewIds.exists()) {
			reviewPromises = [];
			Object.keys(reviewIds.val()).forEach((reviewId) => {
				reviewPromises.push(getOverallRating(reviewId));
			});
			return Promise.all(reviewPromises);
		} else {
			return Promise.resolve([]);
		}
	}).then((ratings) => {
		ratings.filter((rating) => rating != null)
		sum = 0;
		num_ratings = 0;
		ratings.forEach((rating) => {
			if (rating != null) {
				sum += rating;
				num_ratings += 1;
			}
		});
		if (num_ratings == 0) {
			return Promise.resolve(null);
		} else {
			return Promise.resolve(sum / num_ratings);
		}
	});
}

export function getOverallRating(reviewId) {
	databaseReference = firebaseApp.database().ref("Reviews/" + reviewId + "/metadata");
	return databaseReference.once("value").then((metadata) => {
		if (metadata.val().viewable) {
			databaseReference = firebaseApp.database().ref("Reviews/" + reviewId + "/data/overallRating");
			return databaseReference.once("value").then((review) => {
				return Promise.resolve(review.val());
			});
		} else {
			return Promise.resolve(null);
		}
	});
}

/*
Gets a list of all reviews submitted by a user. Reviews that are not viewable
are not added to the list.
*/
export function getUserReviews() {
	ourUid = firebaseApp.auth().currentUser.uid;
	databaseReference = firebaseApp.database().ref("Users/" + ourUid + "/privateData/reviews");
	return databaseReference.once("value").then((reviewIds) => {
		if (reviewIds.exists()) {
			reviewPromises = [];
			Object.keys(reviewIds.val()).forEach((reviewId) => {
				reviewPromises.push(getReview(reviewId));
			});
			return Promise.all(reviewPromises);
		} else {
			return Promise.resolve([]);
		}
	}).then((reviews) => {
		return Promise.resolve(reviews.filter((review) => review != null));
	});
}

/*
Gets the data and metadata of a review mergesd as a single object. The metadata
is merged in mostly so that we get the uid of the writer. If the review is not
viewable, null is retured.
*/
export function getReview(reviewId) {
	databaseReference = firebaseApp.database().ref("Reviews/" + reviewId + "/metadata");
	return databaseReference.once("value").then((metadata) => {
		if (metadata.val().viewable) {
			databaseReference = firebaseApp.database().ref("Reviews/" + reviewId + "/data");
			return databaseReference.once("value").then((review) => {
				merged = Object.assign(metadata.val(), review.val());
				return Promise.resolve(merged);
			});
		} else {
			return Promise.resolve(null);
		}
	});
}

export function setFavoriteState(breweryId, favoriteState) {
	uid = firebaseApp.auth().currentUser.uid;
	databaseReference = firebaseApp.database().ref("Users/" + uid + "/privateData/favorites/" + breweryId);
	if (favoriteState) {
		return databaseReference.set(true);
	} else {
		return databaseReference.remove();
	}
}

export function getFavoriteState(breweryId) {
	uid = firebaseApp.auth().currentUser.uid;
	databaseReference = firebaseApp.database().ref("Users/" + uid + "/privateData/favorites/" + breweryId);
	return databaseReference.once("value").then((snapshot) => {
		return Promise.resolve(snapshot.exists());
	});
}

export function getFavorites() {
	var ourUid = firebaseApp.auth().currentUser.uid;
	var databaseReference = firebaseApp.database().ref("Users/" + ourUid + "/privateData/favorites");
	return databaseReference.once("value").then((breweryIds) => {
		if (breweryIds.exists()) {
			var breweryPromises = [];
			Object.keys(breweryIds.val()).forEach((breweryId) => {
				breweryPromises.push(getBreweryInfo(breweryId));
			});
			return Promise.all(breweryPromises);
		} else {
			return Promise.resolve([]);
		}
	});
}

export function getBreweryInfo(breweryId) {
	return Promise.all([getPlaceDetails(breweryId), getOverallAverage(breweryId)]).then(([placeDetails, averageRating]) => {
		placeDetails.rating = averageRating;
		return Promise.resolve(placeDetails);
	});
}

export function deleteReview(reviewId) {
	databaseReference = firebaseApp.database().ref("Reviews/" + reviewId + "/metadata/viewable");
	return databaseReference.set(false).then(() => {
        databaseReference = firebaseApp.database().ref("ReportedReviews/" + reviewId);
        return databaseReference.remove();
    });
}

export function deleteUser(uid) {
	databaseReference = firebaseApp.database().ref("Users/" + uid + "/metadata/viewable");
	return databaseReference.set(false).then(() => {
        databaseReference = firebaseApp.database().ref("ReportedUsers/" + uid);
        return databaseReference.remove();
    });
}

/*
Given a list of uids, this returns a object whose keys are the uids and whose
values are the user data for the corresponding user. The uid list will only
fetch user data once if a uid is duplicated.
*/
export function getUsersObject(Uids) {
	users = {};
	userPromises = [];
	Uids.forEach((Uid) => {
		if (users[Uid] == undefined) {
			// this is to make sure we don't get the same user data twice
			users[Uid] = {};
			userPromise = getUserData(Uid).then((userData) => {
				users[Uid] = userData;
				return Promise.resolve();
			});
			userPromises.push(userPromise);
		}
	});
	return Promise.all(userPromises).then(() => {
		return Promise.resolve(users);
	})
}

/*
Checks whether the current user is an admin.
*/
export function isAdmin() {
	if (!isLoggedIn()) {
		return Promise.resolve(false);
	}
	ourUid = firebaseApp.auth().currentUser.uid;
	databaseReference = firebaseApp.database().ref("Admins/" + ourUid);
	return databaseReference.once("value").then((snapshot) => {
		return Promise.resolve(snapshot.exists());
	})
}

/*
Checks whether there is a user currently loggin in.
*/
export function isLoggedIn() {
	return firebaseApp.auth().currentUser != null;
}

export function writeReview(breweryId, reviewData) {
	var databaseReference = firebaseApp.database().ref("Reviews");
	var uid = firebaseApp.auth().currentUser.uid;
	return databaseReference.push().then((reviewReference) => {
		var reviewId = reviewReference.key;
		var updates = {};
        updates["Reviews/" + reviewId + "/metadata"] = {
            breweryId: breweryId,
            userId: uid,
            viewable: true
        };
        updates["Reviews/" + reviewId + "/data"] = reviewData
        updates["Users/" + uid + "/privateData/reviews/" + reviewId] = true
        updates["Breweries/" + breweryId + "/reviews/" + reviewId] = true
        return Promise.all([firebaseApp.database().ref().update(updates), setReviewPicture(reviewData.image, reviewId)]);
    });
}

export function getReportedReviews() {
	databaseReference = firebaseApp.database().ref("ReportedReviews");
	return databaseReference.once("value").then((reviewIds) => {
		if (reviewIds.exists()) {
			reviewPromises = [];
			Object.keys(reviewIds.val()).forEach((reviewId) => {
				reviewPromises.push(getReview(reviewId));
			});
			return Promise.all(reviewPromises);
		} else {
			return Promise.resolve([]);
		}
	}).then((reviews) => {
		return Promise.resolve(reviews.filter((review) => review != null));
	});
}

export function getReportedUsers() {
	databaseReference = firebaseApp.database().ref("ReportedUsers");
	return databaseReference.once("value").then((uids) => {
		if (uids.exists()) {
			userPromises = [];
			Object.keys(uids.val()).forEach((uid) => {
				userPromises.push(getUserData(uid));
			});
			return Promise.all(userPromises);
		} else {
			return Promise.resolve([]);
		}
	}).then((users) => {
		return Promise.resolve(users.filter((user) => user != null));
	});
}

/*
Used by admin to mark a reported reivew as ok.
*/
export function approveReview(reviewId) {
	databaseReference = firebaseApp.database().ref("ReportedReviews/" + reviewId);
    return databaseReference.remove();
}

/*
Used by admin to mark a reported user as ok.
*/
export function approveUser(uid) {
	databaseReference = firebaseApp.database().ref("ReportedUsers/" + uid);
    return databaseReference.remove();
}

export function setProfilePicture(pictureURI) {
	var uid = firebaseApp.auth().currentUser.uid;
	var storageReference = firebaseApp.storage().ref("Users/" + uid + "/profilePicture");
	fetch(pictureURI).then((picture) => {
		return picture.blob()
	}).then((blob) => {
		return storageReference.put(blob)
	})
}

export function getProfilePicture(uid) {
	var storageReference = firebaseApp.storage().ref("Users/" + uid + "/profilePicture");
	return storageReference.getDownloadURL().catch(() => {
		return Promise.resolve(null);
	});
}

export function setReviewPicture(pictureURI, reviewId) {
	console.log("setting picture")
	if (pictureURI == null) {
		console.log("picture null")
		return Promise.resolve();
	}
	var storageReference = firebaseApp.storage().ref("Reviews/" + reviewId + "/picture0");
	fetch(pictureURI).then((picture) => {
		return picture.blob()
	}).then((blob) => {
		return storageReference.put(blob)
	})
}

export function getReviewPicture(reviewId) {
	var storageReference = firebaseApp.storage().ref("Reviews/" + reviewId + "/picture0");
	return storageReference.getDownloadURL();
}
