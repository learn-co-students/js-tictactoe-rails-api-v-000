// Code your JavaScript / jQuery solution here
$(function () {

  $('#save').click(function(event) {
    // debugger;
    // retrieve the current board state into an array
    var values = []
    for (let i = 0; i < 9; i++) {
      values.push(document.getElementsByTagName("td")[i]["textContent"]);
    }
    //find out if this game has been persisted
    var gameId = document.getElementsByTagName("table").game
    //if it has been persisted, send a patch request
    if (gameId) {
      $.ajax({
        url: '/games/' + gameId,
        method: 'patch',
        data: {state: values}
      });
    } else {
      //if it has not been persisted, send a post request
    $.ajax({
      url: '/games',
      method: 'post',
      data: {state: values}
    }).done(function(data){
      //once the previously unsaved game has been persisted, attach its game id to the document
      document.getElementsByTagName("table").game = data["data"]["id"]
    })
  }
})

  $('#clear').click(function() {
    //grab all the td DOM elements
    var x = document.getElementsByTagName("td")
    //find out if the game has been persisted
    var gameId = document.getElementsByTagName("table").game
    //if the game has been persisted, reset the board and create a new game
    if (gameId) {
      gameId = ""
      $(x).empty();
      turn = 0;
      $.post('/games').done();
    } else {
      //if the game has not been persisted, just reset the board
      $(x).empty();
      turn = 0;
    }
  });

  $('#previous').click(function() {
    //get all the saved games and add a button for each
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
    var posting = $.get('/games/' + this.id.substring(5));
    posting.done(function(data) {
      // debugger;
      var game = data["data"]["attributes"]["state"]
      document.getElementsByTagName("table").game = this.url.substring(7)
      $("td:eq(0)").text(game[0])
      $("td:eq(1)").text(game[1])
      $("td:eq(2)").text(game[2])
      $("td:eq(3)").text(game[3])
      $("td:eq(4)").text(game[4])
      $("td:eq(5)").text(game[5])
      $("td:eq(6)").text(game[6])
      $("td:eq(7)").text(game[7])
      $("td:eq(8)").text(game[8])
      if (checkWinner() === true) {
        turn = game.filter(Boolean).length - 1;
        $('td').unbind("click")
      } else {
        attachListeners();
        turn = game.filter(Boolean).length;
      }
    });
  });

  attachListeners();
});

  function attachListeners() {
      $('td').click(function() {
        doTurn(this);
      })}

var turn = 0;

function player(){
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(input) {
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
  var values = []

  for (let i = 0; i < 9; i++) {
    values.push(document.getElementsByTagName("td")[i]["textContent"]);
  }

  for (win of winCombinations) {
    if (values[win[0]] === values[win[1]] && values[win[1]] === values[win[2]] && values[win[0]] != ''){
      messageCall('Player ' + player() + ' Won!')
      $("#save").click()
      return true }
    } return false
}

function doTurn(input) {
  //this version allows the user to win, load the won game again, and click an input that persists
  // $('td').bind("click")

  updateState(input)

  if (checkWinner() === true){
    // debugger;

    var x = document.getElementsByTagName("td")
    $(x).empty()
    turn = 0
    // $("#clear").click()
  } else {
    turn +=1
        }
  if (turn === 9 && checkWinner() === false){
     $("#save").click()
     messageCall("Tie game.");
    //  $("#clear").click()
    var x = document.getElementsByTagName("td")
    $(x).empty()
    turn = 0
   }

   //this version allows the user to win, and doesn't allow them to reload the game and enter another input
  //  but it calls checkWinner() too many times for the test
  //
  //   if (checkWinner() === false && turn < 9) {
  //     updateState(input)
  //
  //   if (checkWinner() === true){
  //     // debugger;
  //
  //     var x = document.getElementsByTagName("td")
  //     $(x).empty()
  //     turn = 0
  //     // $("#clear").click()
  //   } else {
  //     turn +=1
  //         }
  // }
  //   if (turn === 9 && checkWinner() === false){
  //      $("#save").click()
  //      messageCall("Tie game.");
  //     //  $("#clear").click()
  //     var x = document.getElementsByTagName("td")
  //     $(x).empty()
  //     turn = 0
  //    }


}
