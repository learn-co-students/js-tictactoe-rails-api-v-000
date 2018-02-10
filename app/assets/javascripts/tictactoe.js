// Code your JavaScript / jQuery solution here

var turn = 0;
var currentGame = 0;
const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

$(function() {
   attachListeners();
})

//attach listeners
function attachListeners() {
  $('td').on('click', function() {
    if(!$.text(this) && !checkWinner() ) {
      doTurn(this);
    }
  });

  $("#save").on('click', () => saveGame());
  $("#previous").on('click', () => showPreviousGames());
  $("#clear").on('click', () => resetBoard());
}

//player
function player() {
  var player = "X";
  if(turn % 2 !== 0) {
    player = "O";
  }
  return player;
}

//update state - invokes player function, adds player token to passed-in td element
function updateState(square) {
  $(square).text(player());
}


//set message - set a provided string to message div
function setMessage(message) {
  $("#message").text(message);
}

//check winner
function checkWinner() {
  //get the state of the board
  var board = {}
  var winner = false;

  $('td').text((index, square) => board[index] = square);
  //iterate through win combination array and check to see if board matches any of them
  //grab the player from the matching squares and return
  WIN_COMBINATIONS.some(function(combo) {
    if(board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  })
  return winner;
}

//do turn
function doTurn(square) {
  //invokes the update state function
  if(square.innerHTML === "") {
    updateState(square);
    turn++;
  }
  if (checkWinner()) {
    //resets board and turn counter when the game is won
    saveGame();
    resetBoard();
  } else if (turn == 9) {
    //invokes the set message function w/ "Tie game." when game is tied
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

//save game
function saveGame() {
  var state = [];
  var gameData;
  $('td').text((index, square) => {
    state.push(square);
  });
  gameData = {state: state};
  if(currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
    });
  }
}

//reset board
function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

//show previous games
function showPreviousGames() {
  $('#games').empty();
  $.get('/games', function(data) {
    //console.log(data);
    for(var i = 0; i < data.data.length; i++) {
      $("#games").append(`<button data-id="${data.data[i].id}" onclick="restoreGame(${data.data[i].id})">Game # ${data.data[i].id}</button>`);
    }
  });
}

function restoreGame(id) {
  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${id}`, true);
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText).data;
    const id = data.id;
    const state = data.attributes.state;
    $('td').each(function(square) {
      $(this).text(state[square]);
    });
    turn = state.join('').length;
    currentGame = id;
  };
  xhr.send(null);
  // $.get(`/games/${id}`, function(game) {
  //   var board = game.data.attributes.state;
  //   $('td').each(function(square) {
  //     $(this).text(board[square]);
  //   });
  // });
}
