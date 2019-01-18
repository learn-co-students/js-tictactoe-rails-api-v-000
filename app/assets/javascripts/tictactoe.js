// Code your JavaScript / jQuery solution here
var turn = 0
var currentGame = 0

WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]




$(document).ready(function() {
  attachListeners()
})

function player() {
  return turn % 2 === 0 ? "X":"O"
}

function updateState(square) {
  $(square).text(player(square))
}

function setMessage(message) {
  $("#message").text(message)
}

function checkWinner() {
  var winner = false;
  var board = {}

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.forEach(function(position) {
   if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "" ) {
     setMessage(`Player ${board[position[0]]} Won!`)
     saveGame()
     winner = true;
   }
  })
  return winner;
 }


function doTurn(square) {
  updateState(square)
  turn++
  if (checkWinner()) {
   saveGame()
   resetGame()
  } else if (tieGame()) {
   setMessage("Tie game.")
   resetGame()
  }
}

function tieGame() {
  if (turn === 9) {
    saveGame();
    return true;
  };
};

function attachListeners() {
  $('td').on('click', function() {              //attach listener on click of a square in 'td'
    if(!$.text(this) && !checkWinner()) {     //if there is no text in this square & we don't have a winner
    //console.log(this)
      doTurn(this)                              //call the turn function
    }
  })
  $('#clear').on('click', () => resetGame());
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGame());
}

function resetGame() {
  $('td').empty()
  turn = 0
  //setMessage('')
  currentGame = 0
}

function saveGame() {
  //saves current game state
  //if already exists in db, update the game state  *possibly using PATCH
  //if not, will save to db          *possibly using POST
  //have a div w/id = 'games'
  var state = []    //set up an array to hold the state of the game
  var gameData;
  $('td').text((i, square) => {           //grab the text that's in the square
    state.push(square)             //push the text that's in the square into the state array
  })
    //console.log(state)
  gameData = {state: state}  //put the current games state into gameData hash
    //console.log(gameData)
    if(currentGame) {
     $.ajax({
       type: "PATCH",
       url: `/games/${currentGame}`,
       data: gameData
      });
     } else {
      $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
    })
  }
}

function previousGame() {
  //must grab all saved games from the database & create a button for each one
  //that when clicked, returns that game's state to the board
  //all of the buttons s/b added to the div#games element in the DOM
  $.get('/games', function(savedGames) {
      $('#games').empty();
      savedGames.data.forEach(function(game) {
      if (savedGames.data.length !== 0) {
        $("#games").append(`<button id="gameId-${game.id}">Game: ${game.id}</button><br>`);
        $("#gameId-" + game.id).on('click', function() {
        showGame(game.id)
        })
      }
    })
  })
}

function showGame(id) {
  //click the saved game button
  //sends Get request to "/games/:id" route
  //loads the saved game into the board
  //marks the newly loaded game so if saved again, it will send a PATCH request instead of a POST
  $.get(`/games/${id}`, function(game) {
  $("#games").empty();
  gameID = game.data.id;
  state = game.data.attributes.state;
  turn = state.join("").length
  i = 0;
  state.forEach(function(element) {
    $('td')[i].innerHTML = element;
    i++;
  })
  })
  currentGame = id
}
