// Code your JavaScript / jQuery solution here
// document.addEventListener("DOMContentLoaded", function(){
$(document).ready(attachListeners) ;

// win combos from ruby ttt
const winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

function player(){
  if (turn % 2 === 0 ){
    return 'X'
  } else {
    return 'O'
  }
}

function doTurn(square) {
  board = document.querySelectorAll("td")
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
   $('td').empty();
  // document.querySelector('td').innerHTML = ""
  turn = 0;
  currentGame = 0;
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGames());
  $('#clear').on('click', () => resetBoard());
}

function checkWinner() {
  // see tictactoeden.js for orig solution
  // create the board object
  var board = {};

  var winner = false;

  // All of the three jQuery methods above: text(), html(), and val(), also come with a callback function. The callback function has two parameters: the index of the current element in the list of elements selected and the original (old) value. You then return the string you wish to use as the new value from the function.
  // https://www.youtube.com/watch?v=veL0_Rb97dE
  $('td').text(
    function(index, td){
      return board[index] = td
      // board = {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: ""}
    })

  winningCombos.forEach(function(combo) {
    // iterate thru each wincombo and see if the 3 values of any of the arrays are equal. if so winner = true
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });
  // board = {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: ""}
  console.log(board)
  return winner;
}

function updateState(td) {
  var currentPlayer = player();
  $(td).text(currentPlayer);
}

// Accepts a string and adds it to the div#message element in the DOM.
function setMessage(message){
   var mess = document.getElementById("message")
   mess.innerHTML = message
  // winnerMessage = message
}

function saveGame() {
  var state = [];
  var gameData;

  //  -The result of the .text() method is a string containing the combined text of all matched elements.
  // -Get the combined text contents of each element in the set of matched elements, including their descendants.
  // .text(function)-A function returning the text content to set. Receives the index position of the element in the set and the old text value as arguments.
  // https://www.youtube.com/watch?v=veL0_Rb97dE (.text w/function)
  $('td').text((index, td) => {
    // put each of the td values into the state array to create the game's current state.
    state.push(td);

  });
  // this is the data to be posted in the ajax post/patch request
  gameData = { state: state };
 // if this game already exists simply update with a patch req.
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
    // otherwise create a new game with this state and set the game id using the post response data
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
      // when saving this game add the reload button to the screen
      $('#games').append(`<button id="gameid-${game.data.id}">Game No. ${game.data.id}</button><br>`);

      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}

// loads the previous games reload buttons
function previousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(createButton);
    }
  });
}

function createButton(game) {
  $('#games').append(`<button id="gameid-${game.id}">Game No. ${game.id}</button><br>`);

  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function reloadGame(gameid) {
  // document.getElementById('message').innerHTML = '';

  $("#message").empty
    $("#games").empty
    // request the game from the api
    $.get("/games/" + gameid,
      function(response){
        // console.log(response)
        // get the game id and the games saved state
        var id = response.data.id
        var state = response.data.attributes.state

    let index = 0;
    // starting at index 0, put each td value in its proper place
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML =
        // put the state value in index 0, then index 1, then ...
        state[index];
        index++;
      }
    }

    turn = state.join('').length;
    // console.log("State Length: " + state.length)
    // console.log("State: " + state.join('').length)


    // for this test: marks the newly-loaded game state such that clicking the "save" button after loading a game sends a PATCH request
     currentGame = id;
    //
    // if (!checkWinner() && turn === 9) {
    //   setMessage('Tie game.');
    // }
  });
}

//////////////////////////////////////////////
 // Some of my orig code. the rest is in tictactoeden.js
// function player(){
//   if (turn % 2 === 0 ){
//     return 'X'
//   } else {
//     return 'O'
//   }
// }
//
// function reloadGame(gameid){
//   $("#message").empty
//   $("#games").empty
//   $.get("/games/" + gameid,
//     function(response){
//
//       var id = response.data.id
//       var state = response.data.attributes.state
//       // console.log("GameID: ", state)
//
//     var index = 0;
//     for (let y = 0; y < 3; y++) {
//       for (let x = 0; x < 3; x++) {
//         document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
//         index++;
//         // document.querySelector("message".html).
//       }
//     }
//
//     turn = state.join('').length;
//     currentGame = id;
//
//     // if (!checkWinner() && turn === 9) {
//     //   setMessage('Tie game.');
//     // }
//   }
// )}
//
//
// // Accepts a string and adds it to the div#message element in the DOM.
// function setMessage(message){
//   var mess =  document.getElementById("message")
//   mess.innerHTML = message
//   winnerMessage = message
// }
