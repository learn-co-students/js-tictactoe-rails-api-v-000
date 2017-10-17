// Code your JavaScript / jQuery solution here

// document Ready
$(document).ready(function() {
  attachListeners();
});

// Turn & CurrentGame variables
var turn = 0;
var currentGame = 0;

//TTT Functions
var player = () => turn % 2 ? "O" : "X";

var updateState = element => {
    $(element).text(player());
}

var message = string => $('#message').text(string);

var checkWinner = () => {
    
    var WINNING_COMBOS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [1,4,7],
    [2,5,8]
    ]
    
    var winner = false;
    
    // turn index to key and inner text to value for board array
    var board = {};
    $('td').text((index, square) => board[index] = square);
    
    WINNING_COMBOS.some(combo => {
        if (board[combo[0]] !== "" &&
        board[combo[0]] === board[combo[1]] &&
        board[combo[1]] === board[combo[2]]) {
            // changes winner to TRUE if combo is present
            winner = true;
            
            message(`Player ${board[combo[0]]} Won!`);
        }
    })
    
    return winner;
}

var resetBoard = () => {
    turn = 0;
    $('td').empty();
    currentGame = 0;
}

// Event Functions
var doTurn = (element) => {
    updateState(element);
    turn++;
    
    if (checkWinner()) {
        saveGame();
        resetBoard();
    } else if (turn === 9) {
        message("Tie game.");
        saveGame();
        resetBoard();
    }
};

var previousGameButtons = (game) => {
    $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
    $(`#gameid-${game.id}`).on('click', () => loadGame(game.id));
}

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(previousGameButtons);
    }
  });
}

var saveGame = () => {
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

var loadGame = (gameId) => {
    document.getElementById('message').innerHTML = `Loading game #${gameId}`;
    const req = new XMLHttpRequest();
    
    req.open('GET', `/games/${gameId}`);
    
    req.onload = () => {
        var game = JSON.parse(req.responseText).data;
        var id = game.id;
        var state = game.attributes.state;
        
        var index = 0;
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
                index++;
            }
        }
        
        turn = state.join('').length;
        currentGame = id;
        
        if (!checkWinner() && turn === 9) {
            message('Tie game.');
        }
    };
    
    req.send();
};

//Attach listeners
var attachListeners = () => {
    $('td').on('click', function() {
        if (!$.text(this) && !checkWinner()) {
            doTurn(this);
        }
    });
    
    $('#previous').on('click', () => showPreviousGames());
    $('#save').on('click', () => saveGame());
    $('#clear').on('click', () => resetBoard());
};


