// Code your JavaScript / jQuery solution here
$(function () {

  $('#save').click(function(event) {
    var dumbArray = []
    dumbArray.push(document.getElementsByTagName("td")[0]["textContent"])
    dumbArray.push(document.getElementsByTagName("td")[1]["textContent"])
    dumbArray.push(document.getElementsByTagName("td")[2]["textContent"])
    dumbArray.push(document.getElementsByTagName("td")[3]["textContent"])
    dumbArray.push(document.getElementsByTagName("td")[4]["textContent"])
    dumbArray.push(document.getElementsByTagName("td")[5]["textContent"])
    dumbArray.push(document.getElementsByTagName("td")[6]["textContent"])
    dumbArray.push(document.getElementsByTagName("td")[7]["textContent"])
    dumbArray.push(document.getElementsByTagName("td")[8]["textContent"])
    var values = dumbArray;
    $.ajax({
      url: '/games',
      type: "POST",
      // method: (game.exists) ? 'post' : 'patch',
      data: {state: values}
    });
    // debugger
})


 //  $('#save').click(function(event) {
 //    var dumbArray = []
 //    dumbArray.push(document.getElementsByTagName("td")[0]["textContent"])
 //    dumbArray.push(document.getElementsByTagName("td")[1]["textContent"])
 //    dumbArray.push(document.getElementsByTagName("td")[2]["textContent"])
 //    dumbArray.push(document.getElementsByTagName("td")[3]["textContent"])
 //    dumbArray.push(document.getElementsByTagName("td")[4]["textContent"])
 //    dumbArray.push(document.getElementsByTagName("td")[5]["textContent"])
 //    dumbArray.push(document.getElementsByTagName("td")[6]["textContent"])
 //    dumbArray.push(document.getElementsByTagName("td")[7]["textContent"])
 //    dumbArray.push(document.getElementsByTagName("td")[8]["textContent"])
 //    var values = dumbArray;
 //
 //    var posting2 = $.get('/games');
 //    posting2.done(function(data) {
 //      var games = data["data"]
 //      var posting = $.post('/games');
 //      posting.done(function(data) {
 //        var game = data["data"]["id"]
 //        var check = games.includes(function(game){
 //          if (game.id === game) {
 //            return true
 //          }})
 //        if (check === false) {
 //          var posting1 = $.ajax({
 //            url: '/games/' + game,
 //            type: 'post',
 //            method: 'patch',
 //            data: {state: values}
 //          });
 //        } else {
 //          var posting1 = $.ajax({
 //            url: '/games/' + game,
 //            type: 'post',
 //            method: 'post',
 //            data: {state: values}
 //          });
 //        }
 // posting1.done();
 //
 //  });})})

  $('#clear').click(function() {
    var x = document.getElementsByTagName("td")
    $(x).empty();
    window.turn = 0;
    $.post('/games').done();
  });

  $('#previous').click(function() {
    var posting = $.get('/games');
    posting.done(function(data) {
      var games = data["data"]
      $("#games").empty()
      games.forEach(function(game){
      var button = $('<button type="button" id="game-'+ game["id"] +'">Game ' + game["id"] + '</>');
      $("#games").append(button)})
    });
  });


  $("#games").on('click', ":button[id^='game-']", function() {
    // debugger;
    var posting = $.get('/games/' + this.id.substring(5));
    posting.done(function(data) {
      var game = data["data"]["attributes"]["state"]
      debugger;
      $("#tdbody").innerHTML = game
    });
  });


});

  function attachListeners() {
      $('td').click(function() {
        doTurn(this);
      })}

      $(document).ready(function() {
        attachListeners();
        })


var turn = 0;

function player(){
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(input) {
  // debugger;
  if (input.innerHTML === "") {
  input.innerHTML = player();
} else {
  messageCall("Choose another square")
  turn -= 1
}
}

function messageCall(string) {
  return document.getElementById("message").innerHTML = string
}

var winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

function checkWinner() {
  var dumbArray = []
  dumbArray.push(document.getElementsByTagName("td")[0]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[1]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[2]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[3]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[4]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[5]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[6]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[7]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[8]["textContent"])

  for (win of winCombinations) {
    if (dumbArray[win[0]] === dumbArray[win[1]] && dumbArray[win[1]] === dumbArray[win[2]] && dumbArray[win[0]] != ''){
      messageCall('Player ' + player() + ' Won!')
      return true }
    } return false
}

function doTurn(input) {
  updateState(input)

  if (checkWinner() === false) {
    turn +=1
  } else {
    turn = 0;
    $("#clear").click()
  }

  if (turn === 9 && checkWinner() === false){
    messageCall("Tie game.");
    turn = 0;
    $("#clear").click()
  }
}
