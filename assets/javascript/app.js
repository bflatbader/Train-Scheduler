// FUNCTIONS
function timeUpdate () {
    currentTime = moment();
    $("#clock").text(currentTime.format("HH:mm:ss A"));
}

// VARIABLES
var firebaseConfig = {
    apiKey: "AIzaSyAwz5ch4lcMy_NU0rOla5PNzqPvTelI8Bc",
    authDomain: "train-scheduler-fba15.firebaseapp.com",
    databaseURL: "https://train-scheduler-fba15.firebaseio.com",
    projectId: "train-scheduler-fba15",
    storageBucket: "train-scheduler-fba15.appspot.com",
    messagingSenderId: "885672027873",
    appId: "1:885672027873:web:78df1fcb81d35b17dbb9a0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

var trainName = "";
var trainDestination = "";
var trainStart;
var trainFrequency;
var currentTime = moment();

// When Submit button is clicked
$('#addTrain').click(function(){
    
    // Prevent form submission
    event.preventDefault();

    // Get values from form
    trainName = $('#train-name').val().trim();
    trainDestination = $('#train-destination').val().trim();
    trainStart = $('#train-start').val().trim();
    trainFrequency = $('#train-frequency').val().trim();

    // Push to database
    database.ref().push({
        trainName: trainName,
        trainDestination: trainDestination,
        trainStart: trainStart,
        trainFrequency: trainFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // Clear form
    $("#train-name").val("");
    $("#train-destination").val("");
    $("#train-start").val("");
    $("#train-frequency").val("");

});

// Initialize time / set to update clock
$("#clock").text(currentTime.format("HH:mm:ss A"));
setInterval(timeUpdate, 1000);

// Grab information from database
database.ref().on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();
    console.log(sv.trainName, sv.trainDestination, sv.trainStart, sv.trainFrequency);

    // Change the HTML to reflect
    trainInfo = `
    <tr>
    <td>${sv.trainName}</td>
    <td>${sv.trainDestination}</td>
    <td>${sv.trainFrequency}</td>
    <td></td>
    <td></td>
    </tr>
    `;

    $('#trainTable').append(trainInfo);
    
    // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
});