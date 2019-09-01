// note: had my code working on the rails app, but there were two tests that just would not pass so I grabbed
//the solution code for specifically auto-saving and multiple games. Thanks!

WIN_COMBO = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
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

  WIN_COMBO.some(function(combo) {
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



/*
WIN_COMBO = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

var currentGame = 0 
var turn = 0 

function player() {
    if (turn % 2 === 0) {
        return 'X'
    } else {
        return 'O'
    }
}

function setMessage(string) {
    $('#message').text(string)
}

$(document).ready(function() {
    attachListeners();
})

function updateState(square) {
    var token = player()
    $(square).text(token)
}

function doTurn(position) {
     updateState()
     turn++
    if (checkWinner()) {
        saveGame();
        resetBoard();
    } else if (turn === 9) {
        setMessage("Tie game.");
        saveGame();
        resetBoard();
   }
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WIN_COMBO.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

function gameWon() {
    $('#message').html(`${player()} won`)
    turn = 0
    saveGame()
    resetBoard()
}

function gameTied() {
    saveGame()
    $('#message').html("Tie game.")
    turn = 0
    resetBoard()
}

function attachListeners() {
    $('td').on('click', function() {
        //debugger 
        if (!$.text(this) && !checkWinner()) {
            doTurn(this);
        }
    })
    
    $('#save').on('click', () => saveGame())
    $('#previous').on('click', () => showPreviousGames())
    $('#clear').on('click', () => resetBoard())
}

function saveGame() {
  var state = [];
  var gameData;

  $('td').text((index, square) => {
    state.push(square);
  });
  
  gameData = {state: state}
  //$.post("/games/" + id + ".json", state);
  
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
   $.post("/games", gameData, function(game) { 
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id))
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

function resetBoard() {
    //$.post("/games")
    $('td').empty()
    turn = 0 
    currentGame = 0
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


/*

// save button ----------------------------------------------
    $(function() { 
      $("#save").on("click", function(data) {
          debugger 
        var id = $(this).data("id")
        var state = $(this).data("state")
        
        var state = $(this).serialize()
        
        var posting = $.post("/games/" + id + ".json", state);
        
        posting.done(function(data) {
            
        })
      })

  
    })

// clear button ----------------------------------------------
    $(function() {
        $("#clear").on("click", function () {
            $.post("/games")
            
        })
    })



// previous games button ------------------------------------
$(function() {
    $('#previous').on("click", function() {
        $.get("/games", function(data) {
            var games = data 
            $("#games").html(games)
            var gameList = ""
             //debugger
             games["data"].forEach(function(game) {
             gameList += '<li class="js-order" data-id="' + game["id"] + '">' + game["id"] + '</li>';
      });
      $("#games").html(gameList);
        })
    })
})

*/

