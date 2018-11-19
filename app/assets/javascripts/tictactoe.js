const WIN_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6] ];

var turn = 0;
var gameID = 0;

var player = () => (turn % 2 === 0) ? "X" : "O";

function updateState(element){
  $(element).text(player());
};

function setMessage(message){
  $(`#message`).text(message);
};

function checkWinner() {
  var winner = false
  var board = $('td').toArray().map(square => square.textContent)

  WIN_COMBINATIONS.forEach(function(combo){
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] &&
    board[combo[1]] === board[combo[2]]){
      winner = true
      setMessage(`Player ${board[combo[0]]} Won!`)
      }
    })
    return winner
};


function validMove(element){
  return ($(element).textContent === "X" || $(element).textContent ===  "O") ?
  false : true
}

function doTurn(move){
  if (validMove(move)) {
    updateState(move)
    turn++
  }
   if (checkWinner()){
     saveGame()
     resetBoard()
   } else if (turn === 9) {
     setMessage("Tie game.")
     saveGame()
     resetBoard()
   }
};

function resetBoard(){
  $('td').empty()
  turn = 0
  gameID = 0
};

function saveGame(){
  var state = $('td').toArray().map(e => e.textContent)
  var gameData = {state: state}

  if (gameID) {
    $.ajax({
      type: 'patch',
      url: `/games/${gameID}`,
      data: gameData
    })
  } else {
    $.post('/games', gameData, function(game){
      gameID = game.data.id
    })
  }
};

function attachListeners(){
  $('td').on('click', function(){
    if (this.textContent === '' && !checkWinner()){
      doTurn(this)
    }
  })

  $('#previous').on('click', function(){
    previousGames()
  })

  $('#save').on('click', function(){
    saveGame()
  })

  $('#clear').on('click', function(){
    resetBoard()
  })

};

function previousGames(){
  $('#games').empty();
  $.get('/games', function(response){
    if (response.data.length > 0) {
      response.data.forEach(game => {
        if ($(`#game-${game.id}`).length === 0) {
          $('#games').append(`<button id="game-${game.id}">Game#: ${game.id}</button>`)
          $(`#game-${game.id}`).on('click', () => getGame(game))
        }
        }
      )
    }
  })
  }


function getGame(game){
  var board = $('td').toArray()
  $.get(`/games/${game.id}`, function(response){
    var state = response.data.attributes.state
    turn = state.filter(e => (e != "")).length
    gameID = game.id
    for (var i = 0; i < 9; i++) {
      board[i].innerHTML = state[i];
      }
  })
};

$(function(){
  attachListeners();
});
