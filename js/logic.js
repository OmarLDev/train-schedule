$(document).ready(function(){

    //Function to validate hours input
    // $("#firstTrainTime").keydown(function(){
    //     var e = event || window.event;
    //     var key = event.keyCode || e.which;
    //     // allowing numbers, backspace and delete
    //     if(((key>=48)&&(key<=57))||(key==8)||(key == 46)||(key == 186)){
    //         if (e.preventDefault) e.preventDefault(); 
    //         console.log(key);
    //         // e.returnValue = false; 
    //     }
    // });

    var trainSchedule = {};

    var firebaseConfig = {
        apiKey: "AIzaSyCcm-CAQmIGS1FKkg0iE5Au0TRfJiv0l-A",
        authDomain: "train-schedule-959e4.firebaseapp.com",
        databaseURL: "https://train-schedule-959e4.firebaseio.com",
        projectId: "train-schedule-959e4",
        storageBucket: "train-schedule-959e4.appspot.com",
        messagingSenderId: "790418550461",
        appId: "1:790418550461:web:30ba54f001ce791b74d1d4"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      // Database reference
      var database = firebase.database();
      // Database object reference
      var train = database.ref("trains");

      $("#addTrain").on("click", function(){
        // Retrieving input from the form
        trainSchedule.name = $("#trainName").val().trim();
        trainSchedule.destination = $("#destinationText").val().trim();
        trainSchedule.firsTrainTime = $("#firstTrainTime").val().trim();
        trainSchedule.frequency = $("#frequencyMins").val().trim();
        // adding a new train to the DB
        train.push(trainSchedule);
      });

      train.on("child_added", function(snapshot){
        var newRow = $("<tr>");
        
        var frequency = snapshot.val().frequency;
        var firstTrainTime = snapshot.val().firsTrainTime;
        var nextArrival = getNextArrivalTime(firstTrainTime,frequency);
        // console.log(nextArrival);
        var minsAway = moment().to(moment(nextArrival,"HH:mm"));
        
        newRow.append("<td>"+snapshot.val().name+"</td>");
        newRow.append("<td>"+snapshot.val().destination+"</td>");
        newRow.append("<td>"+frequency+"</td>");
        newRow.append("<td>"+moment(nextArrival).format("HH:mm")+"</td>");
        newRow.append("<td>"+minsAway+"</td>");

        $("#trainsTable").append(newRow);
      });

      // Function to calculate the next arrival time
      function getNextArrivalTime(hour, frequency){
          var nextArrival = moment(hour,"HH:mm");

          while(nextArrival.isSameOrBefore(moment())){
            console.log("Initial: "+moment(nextArrival).format("HH:mm"));  
            nextArrival = moment(nextArrival,"HH:mm").add(frequency,"minutes");
            console.log("Final: "+moment(nextArrival).format("HH:mm"));
          }
          return nextArrival;
      }
});