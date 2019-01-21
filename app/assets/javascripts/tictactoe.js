// Code your JavaScript / jQuery solution here

var WINNING_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;
var currentGame = 0;

$(function() {
  attachListeners(); 
});

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
  
  $('button#save').on('click', () => saveGame());
  $('button#previous').on('click', () => showPrevGames());
  $('button#clear').on('click', () => clearGame());
}

function saveGame() {
    var state = populateState();
    var gameState = { "state": state }

     if (currentGame) {
        $.ajax({
            url : `/games/${currentGame}`,
            data : gameState,
            type : 'PATCH'
        });
    } else {
        $.post('/games', gameState, function(game) {
            currentGame = game['data']['id'];
        });
    }        
}

function showPrevGames() {  
    $.get('/games', function(games) {
        var gameList = games['data'];
        $('div#games').html("");
         gameList.forEach(function(game) {
            $('div#games').append(`<button id="${game['id']}" onclick="loadGame(this)">${game['id']}</button>`)
        });
    });
}

function loadGame(data) {
    board = $('td');
    $.get(`/games/${data["id"]}`, function(game) {

        currentGame = parseInt(game['data']['id']);
        state = game.data.attributes.state
        turn = state.reduce((acc, val) => {
            if (val === 'X' || val === 'O') {
                acc += 1
            }
            return acc
        }, 0); 

         for (let i = 0; i < state.length; i++) {
            board[i].innerHTML = state[i]
        }
    });
    setMessage('Game successfully loaded.');
}

function clearGame() {
  resetBoard();
}

function player() {
  return (turn % 2 === 0 ? "X" : "O");
}

function updateState(square) {
  if (square.textContent === "") {
    $('div#message').html("")
    $(square).text(player());
    turn += 1;
  } else {
    setMessage("Invalid Move");
    return;
  }
}

function setMessage(message) {
  $('div#message').html(`<p>${message}</p>`)
  setTimeout(function() { $('div#message').html("");}, 3000);
}

function checkWinner() {
  var state = populateState();
  var winner = false;
  
  WINNING_COMBINATIONS.some(function(combination) {
    if (state[combination[0]] !== "" && state[combination[0]] === state[combination[1]] && state[combination[0]] === state[combination[2]]) {
      setMessage(`Player ${state[combination[0]]} Won!`);
      return winner = true;
    }
  })
  return winner;
}

function doTurn(square) {
  updateState(square);
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage('Tie game.');
    saveGame();
    resetBoard();
  }
}

function populateState() {
  state = []
  $('table').each(function() {
    $(this).find('td').each(function() {
      state.push($(this).text())
    });
  });
  return state;
}

function resetBoard() {
    $('table').each(function() {
        $(this).find('td').each(function() {
            $(this).text("");
        });
    });
    turn = 0;
    currentGame = 0;
}
