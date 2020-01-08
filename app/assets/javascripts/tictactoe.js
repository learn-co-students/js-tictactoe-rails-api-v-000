// // Code your JavaScript / jQuery solution here
//
// var turn = 0;
// var currentGame = 0;
// var winCombinations = [
//  [0,1,2], [3,4,5], [6,7,8], [0,3,6],
//  [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
//
// window.onload = function () {
//   attachListeners();
// };
//
// function attachListeners () {
//   [].forEach.call(document.querySelectorAll('td'), elem => {
//     elem.addEventListener('click', event => {
//       if (event.target.innerHTML == "" && !checkWinner()) {
//         doTurn(event.target);
//       }
//     })
//   })
//
//   document.getElementById("save").addEventListener('click', saveGame);
//   document.getElementById("previous").addEventListener('click', previousGame);
//   document.getElementById("clear").addEventListener('click', clearGame);
// }
//
// // function saveGame () {
// //   console.log("save game pressed");
// //   var state = [];
// //   var gameData;
// //
// //
// //
// //   [].forEach.call(document.querySelectorAll('td'), elem => {
// //     state.push(elem);
// //   })
// //   gameData = { state: state };
// //
// //   if (currentGame) {
// //     var request = new XMLHttpRequest();
// //     request.open('POST', `/games/${currentGame}`);
// //     request.onLoad = function () {
// //       console.log(this.response);
// //     }
// //     request.send(JSON.stringify(gameData));
// //
// //   } else {
// //     var request = new XMLHttpRequest();
// //     request.open('POST', '/games');
// //     request.onLoad = function (game) {
// //
// //       console.log("game saved " + gameData);
// //       currentGame = game.data.id;
// //       $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
// //       $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
// //     }
// //
// //     request.send(JSON.stringify(gameData));
// //   }
// // }
//
// function saveGame() {
//   var state = [];
//   var gameData;
//
//   $('td').text((index, square) => {
//     state.push(square);
//   });
//
//   gameData = { state: state };
//
//   if (currentGame) {
//     $.ajax({
//       type: 'PATCH',
//       url: `/games/${currentGame}`,
//       data: gameData
//     });
//   } else {
//     $.post('/games', gameData, function(game) {
//       currentGame = game.data.id;
//       $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
//       $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
//     });
//   }
// }
//
//
// function previousGame () {
//   $('#games').empty();
//   $.get('/games', (savedGames) => {
//     if (savedGames.data.length) {
//       savedGames.data.forEach(buttonizePreviousGame);
//     }
//   });
// }
//
// function buttonizePreviousGame(game) {
//   $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
//   $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
// }
//
// function clearGame () {
//   [].forEach.call(document.querySelectorAll('td'), elem => {
//     elem.innerHTML = "";
//   })
//   turn = 0;
//   currentGame = 0;
// }
//
// function player () {
//   return turn % 2 == 0 ? "X" : "O";
// }
//
// function updateState (square) {
//   var playerToken = player();
//   // var squares = window.document.querySelectorAll('td');
//
//   if (square.innerHTML == "" && turn < 9) {
//     square.innerHTML = playerToken;
//     return true;
//   }
// }
//
// function checkWinner () {
//   var boardSquares = window.document.querySelectorAll('td');
//   // var squares = window.document.querySelectorAll('td');
//   var winner = "";
//
//
//  winCombinations.forEach(checkCombination);
//
//  function checkCombination (combo, index) {
//    if (boardSquares[combo[0]].innerHTML == "X" && boardSquares[combo[1]].innerHTML == "X" && boardSquares[combo[2]].innerHTML == "X") {
//      winner = "X"
//    } else if (boardSquares[combo[0]].innerHTML == "O" && boardSquares[combo[1]].innerHTML == "O" && boardSquares[combo[2]].innerHTML == "O") {
//      winner = "O"
//    }
//  }
//
//  if (winner == "X" || winner == "O") {
//    setMessage(`Player ${winner} Won!`);
//    // turn = 0;
//    return true;
//  } else {
//    // debugger;
//    return false;
//  }
// }
//
// function setMessage(message) {
//   document.getElementById("message").innerHTML = message;
// }
//
// function doTurn (square) {
//   var updated = updateState(square);
//   var gameWon = checkWinner();
//
//   if (gameWon == true) {
//     // turn = 0;
//     saveGame();
//     clearGame();
//   } else if (gameWon == false && turn > 8){
//     saveGame();
//     setMessage("Tie game.");
//     // turn = 0;
//   } else if (updated == true){
//     setMessage("Tie game.");
//     saveGame();
//     turn += 1;
//   }
// }
//
// function reloadGame(gameID) {
//   document.getElementById('message').innerHTML = '';
//
//   const xhr = new XMLHttpRequest;
//   xhr.overrideMimeType('application/json');
//   xhr.open('GET', `/games/${gameID}`, true);
//   xhr.onload = () => {
//     const data = JSON.parse(xhr.responseText).data;
//     const id = data.id;
//     const state = data.attributes.state;
//
//     let index = 0;
//     for (let y = 0; y < 3; y++) {
//       for (let x = 0; x < 3; x++) {
//         document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
//         index++;
//       }
//     }
//
//     turn = state.join('').length;
//     currentGame = id;
//
//     if (!checkWinner() && turn === 9) {
//       setMessage('Tie game.');
//     }
//   };
//
//   xhr.send(null);
// }

// Code your JavaScript / jQuery solution here

const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

var player = () => turn % 2 ? 'O' : 'X';

function doTurn(square) {
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
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

function updateState(square) {
  var token = player();
  $(square).text(token);
}

function setMessage(string) {
  $('#message').text(string);
}

function saveGame() {
  var state = [];
  var gameData;

  $('td').text((index, square) => {
    state.push(square);
  });

  gameData = { state: state };

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame);
    }
  });
}

function buttonizePreviousGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function reloadGame(gameID) {
  document.getElementById('message').innerHTML = '';

  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${gameID}`, true);
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText).data;
    const id = data.id;
    const state = data.attributes.state;

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }

    turn = state.join('').length;
    currentGame = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  };

  xhr.send(null);
}
