// Code your JavaScript / jQuery solution here


var turn = 0

var gameID = 0

var WINNING_COMBOS = [
   [0,1,2],
   [3,4,5],
   [6,7,8],
   [0,3,6],
   [1,4,7],
   [2,5,8],
   [0,4,8],
   [2,4,6]
 ]

// Return correct player: if turn is even, return X, otherwise O
 function player() {
 if (turn % 2 === 0) {
   return 'X';
  } else {
  return 'O';
  }
}

// Update the state of the game
function updateState(square) {
  var currentPlayer = player();
  $(square).text(currentPlayer);
}

// Set message for end game
function setMessage(message) {
  $('#message').text(message);
}

// Check board for any winning combos and return winner
function checkWinner() {
 var winner = false;
 var board = {};  //board is an empty object

 $('td').text((index, square) => board[index] = square);

 WINNING_COMBOS.forEach(function(position) {
   if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
     setMessage(`Player ${board[position[0]]} Won!`)
     return winner = true;
   }
 })

 return winner;
}

function doTurn(location){
  if(location.innerHTML === ''){
    updateState(location)
  }
    winner = checkWinner()
    turn = getTurnCount()
    if (winner !== false) {
      saveGame()
      clearBoard()
    } else if (fullBoard() === -1){
      var gameOver = "Tie game."
      saveGame()
      setMessage(gameOver)
      clearBoard()
    }
}

// When document ready, call function attach Listeners for click functionality
$(document).ready(function(){
  attachListeners()
})

// Attach listeners for buttons on click and call functions
function attachListeners(){
  $('td').on('click', function(event){
    if (!checkWinner() || !fullBoard()){
      doTurn(event.target)
    }
  })
  document.getElementById("save").addEventListener("click", function(){
    saveGame()
  })
  document.getElementById("previous").addEventListener("click", function(){
    getPreviousGames()
  })
  document.getElementById("clear").addEventListener("click", function(){
    clearBoard()
  })
}

// Save game
function saveGame() {
  var state = getCurrentBoard()
  var gameData = {state: state}

  if (gameID === 0){
    $.ajax({
      type: 'POST',
      url: "/games",
      data: gameData,
       success: function(result){
         gameID = result.data.id
    }});
  } else {
    var url = '/games/'+gameID

    $.ajax({
      url: url,
      type: 'PATCH',
      data: {gameData: gameData, gameID: gameID, _method: "PATCH",
        success: function(result){
        console.log(result)
       }
    }})
  }
}

// get current board
function getCurrentBoard(){
  var board = []
  board = $.map( $('td'), function( n ) {
    return n.innerHTML;
});
  return board
}

// Get previous games
function getPreviousGames(){
  var games = $.get('/games', function(data){
    $('#games')[0].innerHTML = ''

    for(var index=0; index<data.data.length; index++){
      $('#games')[0].innerHTML += "Game " + data.data[index].id + ". <button onClick='restoreGame("+ data.data[index].id +")'>Select Game </button>"
    }
  })
}

//restore a game
function restoreGame(id){
  var game = $.get('/games/'+id)

  game.done(function(data) {
    var tags = $('td')
  for(var index=0;index<data.data.attributes.state.length;index++){
    tags[index].innerHTML = data.data.attributes.state[index]
  }
  gameID = data.data.id
  turn = getTurnCount()
  })
}

function getTurnCount(){
  var board = getCurrentBoard()
  var turnNumber = board.filter(function(el){
    return(el === '')
  })
  return 9 - turnNumber.length
}

function clearBoard() {
  board = $.map( $('td'), function(n) {
    return n.innerHTML = '';
  });
  gameID = 0;
  turn = 0;
}

//checks if the board is full
function fullBoard(){
  var state = getCurrentBoard()
  return $.inArray('', state)
}