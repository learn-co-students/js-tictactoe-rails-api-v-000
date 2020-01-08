// Code your JavaScript / jQuery solution here

var turn = 0;

var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

const WINNING_COMBOS = [
   [0,1,2],
   [3,4,5],
   [6,7,8],
   [0,3,6],
   [1,4,7],
   [2,5,8],
   [0,4,8],
   [2,4,6] ]

function player(){
  if (turn % 2) {
    return 'O';
  } else {
    return 'X';
  }
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9){
    setMessage('Tie game.')
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

    $('td').text((index, position) => board[index] = position);

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
      $(square).text(token)
  }

function setMessage(string) {
  $( "#message").append(string);
}

function saveGame() {
    let state = [];
    let gameData;

    $('td').text((index, square) => {
        state.push(square)
    });

    gameData = {state: state };

    if (currentGame) {
        $.ajax({
            type: 'PATCH',
            url: `/games/${currentGame}`,
            data: gameData
        });
    } else {
        $.post('/games', gameData, function(game) {
            currentGame = game.data.id;
            $('#games').append(`<button> id="gameid-${game.data.id}">${game.data.id}</button><br>`);
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


//  4) AJAX interactions with the Rails API Clicking a saved game button (in the div#games element) loads the saved game's state into the board:


//  3) AJAX interactions with the Rails API Clicking the button#save element
//when the current game has not yet been saved sends a POST request to the "/games" route:

//checkWinner()
// Returns true if the current board contains any winning combinations (three X
//   or O tokens in a row, vertically, horizontally, or diagonally). Otherwise,
//   returns false. If there is a winning combination on the board, checkWinner()
//   should invoke setMessage(), passing in the appropriate string based on who
//   won: 'Player X Won!' or 'Player O Won!'


//Accepts a string and adds it to the div#message element in the DOM.

//updateState()
//Invokes player() and adds the returned string ('X' or 'O') to the clicked
// square on the game board.
