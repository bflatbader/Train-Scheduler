// FUNCTIONS
function tableUpdate () {
    // Discard old information
    $('#trainTable').empty();
    
    // Grab information from database
    database.ref().on("child_added", function(snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();
        console.log(sv.trainName, sv.trainDestination, sv.trainStart, sv.trainFrequency);

        // Determine when the next train will arrive and how long 'til it arrives
        var timeConvert = moment(sv.trainStart, "HHmm").subtract(1, "years");
        var timeDifference = moment().diff(moment(timeConvert), "minutes");
        var timeRemaining = timeDifference % sv.trainFrequency;
        var timeAway = sv.trainFrequency - timeRemaining;
        var nextArrival = moment().add(timeAway, "minutes");
        var arrivalDisplay = moment(nextArrival).format("HH:mm");

        // Change the HTML to reflect
        trainInfo = `
        <tr>
        <td>${sv.trainName}</td>
        <td>${sv.trainDestination}</td>
        <td>${sv.trainFrequency}</td>
        <td>${arrivalDisplay}</td>
        <td>${timeAway}</td>
        </tr>
        `;

        // Add train info to the HTML document
        $('#trainTable').append(trainInfo);
        
        // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });
}

function timeUpdate () {
    // Get current time
    currentTime = moment();
    // Update clock
    $("#clock").text(currentTime.format("HH:mm:ss A"));
    // Update HTML document with train information
    tableUpdate();
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

// Initialize variables to use
var trainName = "";
var trainDestination = "";
var trainStart;
var trainFrequency;
// Get current time
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

// load train schedule table
tableUpdate();