// Code your JavaScript / jQuery solution here

var turn = 0;
var currentGame = 0;

var combos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

$(document).ready(function() {
  attachListeners();
});

function player() {
  if ((turn % 2) === 0 ) {
    return 'X';
  } else {
    return 'O';
  }
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(message) {
  $("#message").text(message);
}

function checkWinner() {
  board = []
  winner = false
  
  for (var i = 0; i < 9; i++) {
    board.push($("td")[i].innerHTML)
  } 
  
  combos.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
    
  });
  
  return winner;
}


function doTurn(square) {
  updateState(square);
  turn ++
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $("td").empty();
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

function previousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(function (game) {
        $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
        $(`#gameid-${game.id}`).on('click', () => loadGame(game.id));
      });
    }
  });
}

function loadGame(gameId) {
  
    $('#message').empty();
    $.get(`/games/${theId}`, function(data) {
        var currentId = data.data.id;
        var currentState = data.data.attributes.state;
   
        let i = 0;
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                $(`[data-x="${x}"][data-y="${y}"]`).html(currentState[i])
                i++;
            }
        }

        turn = currentState.join('').length;
        currentGame = currentId;

        if (!checkWinner() && turn === 9) {
            setMessage("Tie game.")
        }
    });
}

function saveGame() {
  var state = [];
  var data = {state: state};
  
  $('td').text((index, square) => {
    state.push(square);
  });
  
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: data
    });
  } else {
    $.post('/games', data, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => loadGame(game.data.id));
    });
  }
}