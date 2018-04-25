// Code your JavaScript / jQuery solution here

var turn = 0
var currentGameId = 0

function attachListeners() {
  var squares = document.querySelectorAll('td')
  
  for(var i = 0; i < squares.length; i++) {
    squares[i].addEventListener('click', function(event) {
      if (!$.text(this) && !checkWinner()) {
      doTurn(this);
      }
    })
  }
  
  $('button#previous').on('click', showPreviousGames)
  $('button#save').on('click', saveGame)
  $('button#clear').on('click', clearBoard)
}

$(document).ready(() => {
  attachListeners()
})

function player() {
  if(turn%2 === 0){
    return "X"
  } else {
    return "O"
  }
}

function updateState(square) {
  var current_player = player()
  square.innerHTML = current_player
}

function fullBoard() {
  var squares_ndx = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  return squares_ndx.every(squareTaken)
}

function squareTaken(index) {
  if(cellValue(index).indexOf("X") > -1 || cellValue(index).indexOf("O") > -1) {
    return true
  } else {
    return false
  }
}

function cellValue(index) {
  var squares = document.querySelectorAll('td');
  return squares[index].innerHTML
}

function checkWinner() {
  var winnersArray = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ].some(function(combo) {
    if (cellValue(combo[0]) === cellValue(combo[1]) &&
        cellValue(combo[1]) === cellValue(combo[2]) &&
        squareTaken(combo[0])) {
      setMessage(`Player ${cellValue(combo[0])} Won!`);
      return true;
    } else {
      return false;
    }
  });
  
  return winnersArray;
}

function doTurn(square) {
  if(square.innerHTML === "" && !gameWon) {
    updateState(square)
    turn++
    var gameWon = checkWinner()
    var gameTie = fullBoard() && !gameWon
  
    if (gameWon || gameTie) {
      if (gameTie) {
        setMessage('Tie game.')  
      }
      saveGame()
      clearBoard()
     }
  }
}

function setMessage(string) {
  document.getElementById("message").append(string);
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

function compileGame() {
  var state = []
  for(var i = 0; i < 9; i++){
    state.push($('td')[i].innerHTML)
  }
  return state
}

function saveGame(){
  var data = {state: compileGame()}
  
  if(currentGameId === 0) {
    $.post('/games', data, function(game) {
      currentGameId = parseInt(game["data"]["id"])
    });
  } else {
    $.ajax({
      method: "PATCH",
      url: `/games/${currentGameId}`,
      data: data
    }).done(function(game) {
      setMessage('Saved');
    })
  }
}

function clearBoard() {
  if(currentGameId === 0) {
    turn = 0
    $('td').empty()
    setMessage('')
  } else {
    currentGameId = 0
    turn = 0
    $('td').empty()
    setMessage('')
  }
}

function reloadGame(gameId) {
  $.get(`/games/${gameId}`, (game) => {
    // debugger;
    board = game["data"].attributes.state
    for(var i = 0; i < 9; i++) {
      $('td')[i].innerHTML = board[i]
      if (squareTaken(i)) {
        turn++
      }
    }
    currentGameId = parseInt(game["data"].id)
  });
}



