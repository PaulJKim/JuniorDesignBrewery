/*
* Favorite Module from the Family Friendly Brewery Tracker
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

export default class Review {
    username;
    overallRating = 0;

    kidFriendly = 0;
    strollerKids = 0;
    kThroughSix = 0;
    teenagers = 0;

    environment = 0;
    safety = 0;
    petFriendly = 0;
    soundLevel = 0 ;
    isSmokingPermitted = 0;
    seatingArrangements = 0;
    cleanliness = 0;

    overallFood = 0;
    foodOptionDiversity = 0;
    nonAlcoholicOptions = 0;

    hasChangingTables = 0;
    hasFamilyRestroom = 0;
    isWheelchairAccessible = 0;

    comments;
    parking;
    breweryId;
    breweryName;
    latitude = 0;
    longitude = 0;
    photo = null;
    userId = "";

    merge(res) {
        this.overallRating = res.overallRating;
        this.username = res.username;
        this.hasChangingTables = res.hasChangingTables;
        this.hasFamilyRestroom = res.hasFamilyRestroom;
        this.isWheelchairAccessible = res.isWheelchairAccessible;
        this.seatingArrangements = res.seatingArrangements;
        this.kidFriendly = res.kidFriendly;
        this.safety = res.safety;
        this.petFriendly = res.petFriendly;
        this.foodOptionDiversity = res.foodOptionDiversity;
        this.nonAlcoholicOptions = res.nonAlcoholicOptions;
        this.soundLevel = res.soundLevel;
        this.isSmokingPermitted = res.isSmokingPermitted;
        this.strollerKids = res.strollerKids;
        this.kThroughSix = res.kThroughSix;
        this.teenagers = res.teenagers;
        this.comments = res.comments;
        this.brewerId = res.breweryId;
        this.breweryName = res.breweryName;
        this.parking = res.parking;
    }
}
