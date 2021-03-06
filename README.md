# Shelter Dog Sleuth
[![Build Status](https://travis-ci.org/rlynn523/shelter-dogs.svg?branch=master)](https://travis-ci.org/rlynn523/shelter-dogs)
##Link
https://mysterious-badlands-72714.herokuapp.com/

##Table of Contents
<li><a href='#purpose'>Purpose</a></li>
<li><a href='#landing-page'>Landing Page</a></li>
<li><a href='#search-pets'>Search Pets</a></li>
<li><a href='#search-shelters'>Search Shelters</a></li>
<li><a href='#doggie-dashboard'>Doggie Dashboard</a></li>
<li><a href='#tech-used'>Tech Used</a></li>
<li><a href='#what-does-the-future-hold'>What Does The Future Hold?</a></li>

##Purpose
I strongly believe in animal rescue and every dog I have ever had has been a resuce. I created an app that simplified the search for a shelter dog and that also connected them to local shelters in their area.

##Use
###Landing Page
<img src='https://github.com/rlynn523/shelter-dogs/blob/master/public/images/landing-page-laptop.png?raw=true' width='500'>
<img src=https://github.com/rlynn523/shelter-dogs/blob/master/public/images/landing-page-mobile.png?raw=true' height='400'>
<br>
<br>
This is the initial page that the user is connected to first. Users have the option of starting a search for pets, shelters, or visiting their dashboard to view saved search items.

###Search Pets
<img src='https://github.com/rlynn523/shelter-dogs/blob/master/public/images/search-pets-laptop.png?raw=true' width='500'>
<img src='https://github.com/rlynn523/shelter-dogs/blob/master/public/images/search-pets-mobile.png?raw=true' height='400'>

This page allows users to start a search for dogs based on breed and location. The results are appened below, and display with an image of the pet, their name, breed, age, and a description. If the user likes a profile for a dog, they can hover over the picture of the pet, and will be asked if they would like to save the profile. Upon clicking the image, the profile is now saved to their dashboard. Data is supplied by the Petfinder API
<br>
<br>
<img src='https://github.com/rlynn523/shelter-dogs/blob/master/public/images/save-profile.png?raw=true' width='500'>

###Search Shelters
<img src='https://github.com/rlynn523/shelter-dogs/blob/master/public/images/search-shelters.png?raw=true' width='500'>
<img src='https://github.com/rlynn523/shelter-dogs/blob/master/public/images/shelters-mobile.png?raw=true' height='400'>
<br>
<br>
This page allows users to start a search for shelters based on location. A search returns a shelter's name, city/state/zip code, and a email address. The user can click the email address to start an email, as well as click the checkmark image to save the shelter to the dashboard. Data is supplied by the Petfinder API.

###Doggie Dashboard
<img src='https://github.com/rlynn523/shelter-dogs/blob/master/public/images/dashboard.png?raw=true' width='500'>
<img src='https://github.com/rlynn523/shelter-dogs/blob/master/public/images/dashboard-mobile.png?raw=true' height='400'>
<br>
<br>
This page displays any saved data from the user. The user can review saved dog profiles, or delete them. The user is also able to delete or edit saved breeds. For example, if they save a mixed breed of "Labrador Retriever Pit Bull Terrier" but decide they just want to save "Labrador Retriever". They can click on the word and make the edit and the edit will be stored. Users are also able to edit and delete saved shelters.

##Tech Used
This app was built using Node.js, JavaScript, jQuery, HTML5, and CSS3. Data is supplied by the Petfinder API and users are able to store any saved profiles, breeds, etc. thanks to MongoDB, Mongoose, and mLab. The front end design and web resposiveness was created using Bootstrap. X-editable was used for inline editing of text in the dashboard. Unit testing of endpoints was conducted using Mocha and Chai, and Travis CI was utilized for continuous integration. 

##What Does The Future Hold?
This is just the first version of the app I have enivisoned. In the future I plan on adding the following updates:
* Allow the user to search for dog by temperment 
* Allow user to click on a breed and have facts about that breed available via Wolfram Alpha API
* Integrate Google Maps into the Search Shelters Page so the user can get see how far from their location the shelter is located

