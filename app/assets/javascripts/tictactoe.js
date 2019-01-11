// Code your JavaScript / jQuery solution here
// $(document).ready(function() {
//     attachListeners();
//   })
//
// const WINNING_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
//
// var turn = 0;
// var game_id = 0;
//
//
// function player () {
//   if (turn % 2 === 0 ){
//     return `X`;
//   } else {
//     return `O`;
//   }
// }
//
// function updateState(square) {
//   var currentPlayer = player();
//   $(square).text(currentPlayer);
//
// }
//
// function setMessage(message) {
//   $(`#message`).text(message);
// }
//
// function checkWinner() {
//   var board = {};
//   var winner = false;
//
//   $('td').text((index, square) => board[index] = square);
//   WINNING_COMBOS.some(function(combo) {
//     if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
//       setMessage(`Player ${board[combo[0]]} Won!`);
//       winner = true;
//     }
//   });
//
//   return winner;
// }
//
// function doTurn(square) {
//   updateState(square);
//   turn++
//   if (checkWinner()){
//     saveGame();
//     $(`td`).empty();
//     turn = 0;
//   } else if (turn === 9){
//     setMessage(`Tie game.`);
//     $(`td`).empty();
//     saveGame();
//     turn = 0;
//     }
//   }
//
//   function attachListeners() {
//     $(`td`).on(`click`, function() {
//       if ((this.innerHTML === `` || ` ` === this.innerHTML) && checkWinner() === false && turn !== 9) {
//           doTurn(this);
//       };
//     });
//     $('#save').on('click', () => saveGame());
//     $('#clear').on('click', () => clearGame());
//     $('#previous').on('click', () => previousGame())
//   }
//
//   function saveGame() {
//     let board = [];
//     $('td').text((index, square) => board[index] = square);
//     let current_board = {state: board};
//
//      if (game_id) {
//
//          $.ajax({
//            type: 'PATCH',
//            url: `/games/${game_id}`,
//            data: current_board,
//            //dataType: `JSON`
//          });
//       } else {
//          $.post('/games', current_board, function(rep){
//            game_id = rep.data.id;
//         }
//       );
//     }
//   }
//
//   function clearGame() {
//     $('td').empty();
//     turn = 0;
//     game_id = 0;
//   }
//
//   function previousGame() {
//     $('#games').empty();
// //  let id = this.id - 1;
//     $.get(`/games`).done (function(games){
//       games.data.forEach(function(game){
//         $('#games').append(`<button id= "game_id-${game.id}">${game.id}</button>`)
//         $('#game_id-' + game.id).on('click',function(game){
//           id = game.target.innerHTML;
//         $.get(`/games/${id}`).done (function(state){
//
//
//           $('td').each(function(i, element){
//             element.innerHTML = state.data.attributes.state[i]
//          })
//         })
//       })
//      })
//    })
//   }

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
