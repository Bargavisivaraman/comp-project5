// list of CSUN locations to quiz on
// each one has a name and a bounding box (NE and SW corners)
var locations = [
    {
        name: "the Oviatt Library",
        ne: { lat: 34.2410, lng: -118.5285 },
        sw: { lat: 34.2395, lng: -118.5305 }
    },
    {
        name: "Sierra Hall",
        ne: { lat: 34.2390, lng: -118.5290 },
        sw: { lat: 34.2378, lng: -118.5310 }
    },
    {
        name: "the University Student Union",
        ne: { lat: 34.2400, lng: -118.5255 },
        sw: { lat: 34.2388, lng: -118.5275 }
    },
    {
        name: "the Bookstore",
        ne: { lat: 34.2412, lng: -118.5263 },
        sw: { lat: 34.2402, lng: -118.5278 }
    },
    {
        name: "the Student Recreation Center",
        ne: { lat: 34.2420, lng: -118.5253 },
        sw: { lat: 34.2407, lng: -118.5273 }
    }
];

// quiz state
var map;
var currentIndex = 0;
var correctCount = 0;
var timer = 0;
var timerInterval;
var animatedLine;

// runs when the API loads
function initMap() {

    // create the map centered on CSUN with all interactions disabled
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 34.2400, lng: -118.5280 },
        zoom: 17,
        disableDefaultUI: true,
        gestureHandling: "none",
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        draggable: false
    });

    // listen for double clicks on the map
    map.addListener("dblclick", handleDoubleClick);

    // show the first question
    showNextQuestion();

    // start the timer
    timerInterval = setInterval(function() {
        timer++;
        $("#timer").text(timer);
    }, 1000);

    // load any saved high score
    loadHighScore();
}

// display the current question prompt
function showNextQuestion() {
    if (currentIndex >= locations.length) {
        endQuiz();
        return;
    }
    var loc = locations[currentIndex];
    $("#prompts").append('<div class="prompt">Where is ' + loc.name + '?</div>');
}

// called when the user double clicks on the map
function handleDoubleClick(event) {

    if (currentIndex >= locations.length) {
        return;
    }

    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    var loc = locations[currentIndex];

    // check if the click is inside the location bounds
    var inside = (lat <= loc.ne.lat && lat >= loc.sw.lat &&
                  lng <= loc.ne.lng && lng >= loc.sw.lng);

    if (inside) {
        // correct answer, draw a green rectangle
        drawRectangle(loc, "#00aa00");
        $("#prompts").append('<div class="correct">Your answer is correct!!</div>');
        correctCount++;
        runAnimation(loc);
    } else {
        // wrong answer, draw a red rectangle on the actual location
        drawRectangle(loc, "#cc0000");
        $("#prompts").append('<div class="wrong">Sorry wrong location.</div>');
    }

    currentIndex++;
    showNextQuestion();
}

// draws a colored rectangle over a location
function drawRectangle(loc, color) {
    new google.maps.Rectangle({
        strokeColor: color,
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        map: map,
        bounds: {
            north: loc.ne.lat,
            south: loc.sw.lat,
            east: loc.ne.lng,
            west: loc.sw.lng
        }
    });
}

// animated polyline using a moving arrow symbol
// this uses google.maps.Polyline and google.maps.SymbolPath
function runAnimation(loc) {

    // remove the previous line if there is one
    if (animatedLine) {
        animatedLine.setMap(null);
    }

    var centerLat = (loc.ne.lat + loc.sw.lat) / 2;
    var centerLng = (loc.ne.lng + loc.sw.lng) / 2;

    // moving arrow symbol
    var arrow = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 4,
        strokeColor: "#0000ff"
    };

    // draw a short line near the correct location
    animatedLine = new google.maps.Polyline({
        path: [
            { lat: centerLat - 0.0005, lng: centerLng - 0.0005 },
            { lat: centerLat + 0.0005, lng: centerLng + 0.0005 }
        ],
        icons: [{
            icon: arrow,
            offset: "0%"
        }],
        map: map,
        strokeColor: "#0000ff",
        strokeWeight: 3
    });

    // animate the arrow along the line
    var count = 0;
    var animInterval = setInterval(function() {
        count = (count + 2) % 200;
        var icons = animatedLine.get("icons");
        icons[0].offset = (count / 2) + "%";
        animatedLine.set("icons", icons);
        if (count === 0) {
            clearInterval(animInterval);
        }
    }, 30);
}

// end of quiz display
function endQuiz() {
    clearInterval(timerInterval);
    var wrong = locations.length - correctCount;
    $("#finalScore").text(correctCount + " Correct, " + wrong + " Incorrect");

    // save high score if it was a perfect run
    if (correctCount === locations.length) {
        saveHighScore(timer);
    }
}

// high score handling using localStorage
function loadHighScore() {
    var saved = localStorage.getItem("csunMapHighScore");
    if (saved) {
        $("#highscore").text(saved + "s");
    }
}

function saveHighScore(time) {
    var saved = localStorage.getItem("csunMapHighScore");
    if (!saved || time < parseInt(saved)) {
        localStorage.setItem("csunMapHighScore", time);
        $("#highscore").text(time + "s (new!)");
    }
}
