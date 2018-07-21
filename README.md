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
   - Updated UI throughout app
   - Review comments are automatically screened for profanity
   - add pictures to reviews
   - Updated in app icons to improve user experience
   - password reset
   
  - Known bug/defects
    - Keyboard can sometimes block on screen content
    - When a review is submitted, the brewery page's review list doesn't automatically update
    - Occasionally, icons on map do not display and are represented by default pin instead
  
  - Future Works
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

8. Obtain Firebase key and set up the firebase.js file (Please see the backend set-up guide for help with this)

9. Open the Expo XDE on your computer and create an account. Then login to both your Expo XDE on the computer as well on your Expo mobile app. 

10. In the Expo XDE, select the Open an Existing Project button
  Navigate to the code repository folder on your computer in the pop-up file explorer and select Open
  When you open the project in the Expo XDE it should start the build automatically
  When the build is complete on iOS you will see the option to open the app on the Projects Screen
  
  On Android, select the Share button in the Expo XDE and scan the QR code from the Expo Mobile App on your Android phone to    open the app

NOTE: If you run into errors with building on your Expo XDE or Expo Mobile Client, first try selecting the restart button in the Expo XDE. Then try fully closing the Expo XDE application and re-opening it. Also, fully closing the Expo Mobile Client and re-opening can help.

11. To build the stand alone apps for submitting to the Apple Appstore and Google Play Store follow this guide as it is the most up to date - https://docs.expo.io/versions/latest/distribution/building-standalone-apps
  NOTE: This step cannot be done from the Expo XDE and requires terminal/command line use


  
This application is licensed under the GNU General Public License v3.0
  
The icon for the application is attributed to "brewery by Vicons Design from the Noun Project" used under the Creative Commons license https://creativecommons.org/licenses/by/3.0/legalcode


Content Filtering is enabled using the bad-words library
https://github.com/web-mech/badwords

The MIT License (MIT)
Copyright (c) 2013 Michael Price
