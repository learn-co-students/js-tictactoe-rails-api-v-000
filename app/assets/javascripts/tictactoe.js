var turn = 0;
var gameId = 0;
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var player = ()  => turn % 2 ? 'O' : 'X';

function attachListeners() {
  $('td').on("click", function() {
    if(!$.text(this) && !checkWinner()) {
      // console.log(this)
      doTurn(this)
    }
  });
  $('#save').on("click", () => saveGame());
  $('#previous').on("click", () => displayPreviousGames());
  $('#clear').on("click", () => resetGame());
}

function doTurn(cell) {
  updateState(cell)
  turn++;
  if (checkWinner()) {
    saveGame();
    resetGame();
  } else {
    checkTieGame();
  }
}

function checkTieGame() {
  if (turn === 9) {
    saveGame();
    resetGame();
    setMessage("Tie game.")
  }
}

function updateState(cell) {
  $(cell).text(player())
}

function setMessage(message) {
  $('#message').text(message)
}

function resetGame() {
  $('td').each(function() {
    $(this).text('');
  });
  turn = 0;
  gameId = 0;
}

function checkWinner() {
  var board = [];
  var winner = false;
  
  //This will push current cell values into board
  $('td').each(function() {
    board.push(this.textContent);
  })
  // This will check if board matches WINNING_COMBOS
  WINNING_COMBOS.some(function(combo) {
    if (board[(combo[0])] !== '' && board[(combo[0])] === board[(combo[1])] && board[(combo[1])] === board[(combo[2])]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;     
    }
  });

  return winner;
}
  
function saveGame() {
  var state = []
  $('td').each(function() {
    state.push(this.textContent);
  });

  if(gameId) {
    $.ajax({
      method: 'PATCH',
      url: `/games/${gameId}`,
      data: { state: state }
    })
  } else {
    var posting = $.post('/games', { state: state })
    posting.done(function(response) {
      gameId = response.data.id
      // console.log(gameId)
    })
  }

}

function displayPreviousGames() {
  $.get('/games').done(function(response) {
    if (response.data.length !== 0) {
      response.data.forEach(function(game) {
        if (game.id > $('#games button:last').text()) {
          $('#games').append(`<button onclick="getBoard.call(this);" data-id="${game.id}">${game.id}</button> `)
        }
      });
    }
  });
}

function getBoard() {
  var clickedGame = $(this).data("id")
  $.get(`/games/${clickedGame}`).done(function(response) {
      var retrievedState = response.data.attributes.state
      var currentState = document.querySelectorAll('td')
      for (let i = 0; i < 9; i++) {
          currentState[i].innerHTML = retrievedState[i];
          if (retrievedState[i] !== '') {
              turn++;
          }
      }
      gameId = response.data.id; 
  });
}

$(document).ready(function() {
  attachListeners();
});