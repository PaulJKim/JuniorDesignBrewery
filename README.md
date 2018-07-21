# Family Friendly Brewery Trackr

Version 2.0

Family Friendly Brewery Trackr allows users to view and contribute to crowd sourced reviews for breweries based on family friendly criteria.

Coming Soon to the Apple Appstore and Google Play Store!

Release Notes:
- Features:
  - Find local breweries or search for one in another city
  - Breweries are rated based on kid-friendliness, pet-friendliness, cleanliness, food options, etc
  - Add your own reviews
  - Favorite breweries
  - Create a username and profile
  - Users can view other user's reviews and profiles in full

 - Changelog:
   - Features
     - Updated UI of brewery, review, and profile screens
     - Review comments are automatically screened for profanity
     - Pictures can not be added to reviews
     - Updated in app icons to improve user experience
     - Added password reset
     - Added application terms and conditions
     - Added page which includes license information for app icons
     - Minor UI adjustments throughout app
   - Bugfixes
     - App prompts login instead of crashing if reporting a review when not logged in
     - App no longer crashes if a search contains special characters
     - On Android, the back button now only prompts logout if on one of the main screens
     - After logging out, it is no longer possible to see user data of the previously logged in user using the back button on Android
     - On login, registration, profile, and add review screens, turning the phone sideways no longer removes critical content from the screen
     - It is no longer possible to load the same page multiple times by clicking a button multiple sometimes

  - Known bug/defects
    - Keyboard can sometimes block on screen content
    - When a review is submitted, the brewery page's review list doesn't automatically update
    - Occasionally, icons on map do not display and are represented by default pin instead
    - Due to performance issues, brewery filtering is not included in this release

  - Future Work
    - No settings function - can't change search distance on map or color theme of app
    - Add beer preferences to profile
    - Social media integration
    - Upvote reviews
    - Make app icon and re-name app
    - Limit users to one review per brewery
    - Allow users to edit their reviews


App Installation and Build Guide:

1. Navigate to https://github.com/PaulJKim/JuniorDesignBrewery where you can find the code repository for the project

2. Install npm (Node Package Manager), the steps to do this are located here along with some more information about npm - https://www.npmjs.com/get-npm
  Note: Using npm requires basic familiarity with the terminal (Mac/Linux) or Command Line (Windows)

3. Download or clone the Git repository to your computer
  If you are experienced not experienced with git, simply download the ZIP to your computer and extract its contents

4. Navigate to the folder you created by cloning or downloading the repository using the terminal/command line and run ‘ npm install ‘ – this can take a long time

5. Install the Expo XDE on your computer and the Mobile Client on your iOS or Android Device - https://docs.expo.io/versions/latest/introduction/installation

6. Under the Local Development Tool header on the webpage select the appropriate download for your computer.

7. Under Mobile Client select the appropriate download for your smartphone

8. If you do not have a Firebase project or Google maps key associated with the project, follow the Firebase and Google maps setup, and modify the files firebase.js and app.json as directed.

9. Open the Expo XDE on your computer and create an account. Then login to both your Expo XDE on the computer as well on your Expo mobile app.

10. In the Expo XDE, select the Open an Existing Project button
  Navigate to the code repository folder on your computer in the pop-up file explorer and select Open
  When you open the project in the Expo XDE it should start the build automatically
  When the build is complete on iOS you will see the option to open the app on the Projects Screen

  On Android, select the Share button in the Expo XDE and scan the QR code from the Expo Mobile App on your Android phone to    open the app

NOTE: If you run into errors with building on your Expo XDE or Expo Mobile Client, first try selecting the restart button in the Expo XDE. Then try fully closing the Expo XDE application and re-opening it. Also, fully closing the Expo Mobile Client and re-opening can help.

11. To build the stand alone apps for submitting to the Apple Appstore and Google Play Store follow this guide as it is the most up to date - https://docs.expo.io/versions/latest/distribution/building-standalone-apps
  NOTE: This step cannot be done from the Expo XDE and requires terminal/command line use



Firebase Setup:
1. Navigate to console.firebase.com in a web browser.
2. Select the add project option. Select a name for the project, and create the project with the default options.
3. Click the “Add Firebase to your web app” button, and note the configuration values.
4. In the root folder of the application, create a file named firebase.js. Enter the following text into firebase.js:

import * as firebase from 'firebase';  
 var config = {  
  apiKey: "",  
  authDomain: "",  
  databaseURL: "",  
  projectId: "",  
  storageBucket: "",  
  messagingSenderId: ""  
};  
export default firebaseApp = firebase.initializeApp(config);

5. Copy the configuration values from firebase into the corresponding set of double quotes in firebase.js.
6. Select the authentication tab in the sidebar of the Firebase console. Click the “Set up sign-in method” button, and enable email/password authentication.
7. Select the database tab in the sidebar of the Firebase console. Click the “Create database” button under the Realtime Database header (not Cloud Firestore), and select the rules tab on the database page. In the application folder, go to the database folder and open database_rules.json. Copy the contents of database_rules.json into the text box of the database rules page.
8. Select the storage tab in the sidebar of the Firebase console. Click the “Get started” button, and select the rules tab on the cloud storage page. In the application folder, go to the database folder and open storage_rules.json. Copy the contents of storage_rules.json into the text box of the storage rules page.


Google Maps Setup:
1. Navigate to console.cloud.google.com in a web browser.
2. In the navigation bar, select the name you gave to this project in Firebase.
3. In the sidebar, select the APIs and services tab.
4. Click the “Enable APIs and services” button.
5. Search for and enable the Places API and the Geocoding API.
6. Return to the main API page by clicking the APIs and services tab of the sidebar.
7. Select the Places API and choose the credentials tab.
8. Note the browser key for the Places API
9. In the application folder, open app.json. Find the apiKey line and enter the key from the Places API.

This application is licensed under the GNU General Public License v3.0

The icon for the application is attributed to "brewery by Vicons Design from the Noun Project" used under the Creative Commons license https://creativecommons.org/licenses/by/3.0/legalcode


Content Filtering is enabled using the bad-words library
https://github.com/web-mech/badwords

The MIT License (MIT)
Copyright (c) 2013 Michael Price
