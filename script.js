// list of CSUN locations to quiz on
// each one has a center point and a size for the bounding box
var locations = [
    {
        name: "the Oviatt Library",
        center: { lat: 34.2400, lng: -118.5294 }
    },
    {
        name: "Sierra Hall",
        center: { lat: 34.2384, lng: -118.5298 }
    },
    {
        name: "the University Student Union",
        center: { lat: 34.2393, lng: -118.5264 }
    },
    {
        name: "the Bookstore",
        center: { lat: 34.2406, lng: -118.5269 }
    },
    {
        name: "the Student Recreation Center",
        center: { lat: 34.2413, lng: -118.5262 }
    }
];

// how big the bounding box is around each location
var boxSize = 0.0008;

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

    // build a LatLngBounds for each location
    // this uses google.maps.LatLngBounds
    for (var i = 0; i < locations.length; i++) {
        var c = locations[i].center;
        var bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(c.lat - boxSize, c.lng - boxSize),
            new google.maps.LatLng(c.lat + boxSize, c.lng + boxSize)
        );
        locations[i].bounds = bounds;
    }

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

    var loc = locations[currentIndex];

    // use the LatLngBounds contains method to check the click
    var inside = loc.bounds.contains(event.latLng);

    if (inside) {
        drawRectangle(loc, "#00aa00");
        $("#prompts").append('<div class="correct">Your answer is correct!!</div>');
        correctCount++;
        runAnimation(loc);
    } else {
        drawRectangle(loc, "#cc0000");
        $("#prompts").append('<div class="wrong">Sorry wrong location.</div>');
    }

    currentIndex++;
    showNextQuestion();
}

// draws a colored rectangle over a location using the bounds
function drawRectangle(loc, color) {
    new google.maps.Rectangle({
        strokeColor: color,
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        map: map,
        bounds: loc.bounds
    });
}

// draws an animated polyline across the correct location
// this uses google.maps.Polyline
function runAnimation(loc) {

    if (animatedLine) {
        animatedLine.setMap(null);
    }

    var c = loc.center;

    animatedLine = new google.maps.Polyline({
        path: [
            { lat: c.lat - 0.0006, lng: c.lng - 0.0006 },
            { lat: c.lat + 0.0006, lng: c.lng + 0.0006 }
        ],
        map: map,
        strokeColor: "#0000ff",
        strokeWeight: 4
    });
}

// end of quiz display
function endQuiz() {
    clearInterval(timerInterval);
    var wrong = locations.length - correctCount;
    $("#finalScore").text(correctCount + " Correct, " + wrong + " Incorrect");

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
