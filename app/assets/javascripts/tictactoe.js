const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
//Increment after turn, so start at 1 vs. 0
var turn = 0;
//This is how we'll track & display the clickable game number on-screen
var currentGame = 0;

//call to listener function when document is loaded
$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  //if box is clicked, check if there is text & check if the game has a winner
  //if both are false then call to the turn function
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  //if any of the other buttons are clicked, call to functions
  $('#save').on('click', () => saveGame());
  // $('#save').on('click', function() {
  //   saveGame();
  // });
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

//The below is that same as: var player = () => turn % 2 ? 'O' : 'X';
function player() {
  return (turn % 2 ? "O" : "X");
}

//update element clicked on
function updateState(tdElement) {
  let token = player();
  $(tdElement).text(token);

}

function setMessage(msg) {
  $('#message').text(msg);

}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  });
  return winner;
}

function doTurn(tdElement) {
  updateState(tdElement);
  turn ++;
  //checked before move, now check for winner after move
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function saveGame() {
  var state = [];

  $('td').text((index, square) => {
    state.push(square);
  });

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: { state: state }
    });
  } else {
    $.post('/games', { state: state }, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => showPreviousGames(game.data.id));
    });
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function showPreviousGames() {
  let post = $.get('/games', {}, function(response){
    response["data"].forEach(function(game){
      if (!$(`button#gameid-${game.id}`).length){
        $("#games").append(`<button id="gameid-${game.id}">${game.id}</button><br>`)
        $(`#gameid-${game.id}`).on('click', function () {
          loadGame(game.id)
        })
      }
    })
  })
}

function loadGame(id) {
  $.get('/games/' + id, {}, function(response){
    let loadState = response["data"]["attributes"]["state"]
    window.turn = 9 - loadState.filter(cell => cell === '').length
    currentGame = parseInt(response["data"]["id"])
    let squares = $('td')
    for (let i = 0; i < 9; i++) {
      squares[i].innerHTML = loadState[i]
    }
    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  })
}
