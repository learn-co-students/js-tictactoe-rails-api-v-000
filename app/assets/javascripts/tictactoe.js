var board = [];
var turn = 0;
var gameId = 0;

const winCombos= [
  [0,1,2], [3,4,5], [6,7,8], //vertical
  [0,3,6], [1,4,7], [2,5,8], //horizontal
  [0,4,8], [2,4,6]  //diagonal
]

$(document).ready(function() {
  console.log("I am ready.");
  attachListeners();
})

function attachListeners() {
  console.log("I am listening...");
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner() ) {
      doTurn(this);
    }
  });

  $("#save").on('click', () => saveGame())
  $("#previous").on('click', () => previousGames())
  $("#clear").on('click', () => {
      resetBoard();
      gameId = 0;
      setMessage("");
  })
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(message_string) {
  $('#message').html(message_string);
}

function checkWinner() {
  var winner = false;
  $('td').text(function(index, oldVal) {
    board[index] = oldVal;
  })
  winCombos.forEach(function(combo) { //each combo is a 3 part array item eg: [ [0,1,2] ]
    if ((board[combo[0]] == board[combo[1]]) && (board[combo[1]] == board[combo[2]]) && (board[combo[0]] !== "")){
      winner = true;
      let token = board[combo[0]]
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner;
    }
  });
  return winner;
}

function resetBoard() {
  turn = 0;
  $('td').empty();
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner() == true ) {
    saveGame();
    resetBoard();
  } else if ( (turn == 9) ) {
    setMessage(`Tie game.`);
    saveGame();
    resetBoard();
  }
}

function saveGame() {
  let state = board
  if (gameId) {
      $.ajax({
        type: 'PATCH',
        url: `/games/${gameId}`,
        dataType: 'json',
        data: {state: state}
      });
  } else {
      $.post(`/games`, {state: state}, function(game) {
          gameId = parseInt(game.data.id);
      });
  };
};

function previousGames() {
  $('div#games').empty();
  $.get('/games', function(games) {
    if (games.data.length) {
      games.data.map(function(game) {
        $('div#games').append(`<button id="gameid-${game.id}">Get Game: #${game.id}</button><br>`)
        $("#gameid-"+game.id).on('click', () => loadGame(game.id))
      })
    }
  })
}

function loadGame(gameid) {
  $.get(`/games/${gameid}`, function(game) {
      let state = game.data.attributes.state;
      $('td').text((index, token) => state[index]);
      gameId = gameid
      turn = state.join('').length;
      checkWinner();
  });
};
