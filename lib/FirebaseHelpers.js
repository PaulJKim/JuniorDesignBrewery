import firebaseApp from '../firebase';

export function getUserData(uid) {
	databaseReference = firebaseApp.database().ref("/Users/" + uid + "/publicData");
	return databaseReference.once("value").then((snapshot) => {
		var userData = snapshot.val();
		userData.uid = uid;
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
				return Promise.resolve(null);
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