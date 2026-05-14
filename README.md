# CSUN Map Quiz

A location based quiz game using the Google Maps API. The map is centered on the CSUN campus
and the player is asked to double click on the location of different buildings.

Live site: 

## How to play

- A prompt shows up on the left side asking where a certain building is.
- Double click on the map where you think that location is.
- If you are right, a green box shows up on the building and you get a message saying your answer is correct.
- If you are wrong, a red box shows up on the actual location of the building and you get a message saying you got it wrong.
- After 5 locations, your final score is shown.

## Locations used

- Oviatt Library
- Sierra Hall
- University Student Union
- Bookstore
- Student Recreation Center

## Extra features

- A timer that runs while you play.
- A high score saved in local storage that only updates when you get a perfect score.
- A small animation on the map when you get an answer right.

## Google Maps features used

- google.maps.Polyline
- google.maps.SymbolPath

## How to run

1. Get a Google Maps JavaScript API key.
2. Open index.html and paste the key into the script tag at the bottom where it says YOUR_API_KEY_HERE.
3. Open index.html in Chrome.

## Files

- index.html
- style.css
- script.js
