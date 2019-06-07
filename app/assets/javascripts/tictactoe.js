// Code your JavaScript / jQuery solution here

var WINNING_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var turn = 0;
var currentGameId = 0


 $(document).ready(function() {
    attachListeners();
})

var player = function() {
   if (turn % 2) {
    return 'O' 
   } else {
    return 'X'
    }
}

function updateState(square) {
    var token = player();
    $(square).text(token);
}

function setMessage(message) {
    $('#message').text(message);
}

function checkWinner() {
    var winner = false;
    var board = {};
    $('td').text((index, square) => board[index] = square);

    WINNING_COMBOS.some( function(combo) {
    if ( board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        setMessage(`Player ${board[combo[0]]} Won!`);
        winner = true;
    }
});

    return winner;
}

function resetBoard(){
    turn = 0;
    $('td').empty();
    currentGameId = 0
  }
  
function doTurn(square) {
    updateState(square);
    turn ++;

    if (checkWinner()) {
      resetBoard();
    } else if (turn === 9) {
      setMessage("Tie game.");
      resetBoard();
    }
 }

function checkTurn(array) {
    turn = array.join("").length

    if(!checkWinner() && turn === 9){
       $('#message').text("Tie game.");
     }
      
}

function attachListeners() {
    $('td').on('click', function() {
      if ( !$.text(this) && !checkWinner())
      doTurn(this)
    });
  
    $('#save').on('click', () => saveGame());
    $('#previous').on('click', () => showPreviousGames());
    $('#clear').on('click', () => resetBoard());
  }

function saveGame() {
    var state = [];
    var gameData;
  
     $('td').text((index, square) => {
      state.push(square);
    });
  
     gameData = { state: state };
  
     if (currentGameId) {
      $.ajax({
        type: 'PATCH',
        url: `/games/${currentGameId}`,
        data: gameData
      });
    } else {
      $.post('/games', gameData, function(game) {
        currentGameId = game.data.id;
        $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
        $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
      });
    }
  }

  function showPreviousGames() {
    $('#games').empty();
    $.get('/games', function(resp) {
        resp.data.forEach(function(game) {
            $('#games').append(`<button data-id="${game.id}" onclick="loadGame(${game.id})">${game.id}</button>`);
        });
    });
};

function reloadGame(gameId) {
    $('#message').text("");
    $.get('/games/' + gameId, function(resp) {
      var index = 0;
      var state = resp.data.attributes.state;
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          $("[data-x='" + x + "'] [data-y='" + y + "']").html(state[index]);
          index++;
        }
      }
      currentGameIdGame = resp.data.id;
      checkTurn(state)
      if(!checkWinner() && turn === 9){
        $('#message').text("Tie game.");
      }
});

}
