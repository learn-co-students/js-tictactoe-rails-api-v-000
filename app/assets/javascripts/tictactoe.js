// Code your JavaScript / jQuery solution here

$(document).ready(function(){
//ONLY call this one if they click in table area!!!
  // document.addEventListener("click", function(){
  //   doTurn(event.toElement.id)
  // });

  document.getElementById("board").addEventListener("click", function(){
    doTurn(event.toElement.id)
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

})

var win_combinations = [
   [0,1,2],
   [3,4,5],
   [6,7,8],
   [0,3,6],
   [1,4,7],
   [2,5,8],
   [0,4,8],
   [2,4,6]
 ]
var gameID = 0

function saveGame() {
  // event.preventDefault()
  var state = getCurrentBoard()
  var gameData = {state: state}
  if (gameID === 0){

    $.ajax({
      type: 'POST',
      url: "/games",
      data: gameData,
       success: function(result){

    }});

    // var posting = $.post('/games', { 'state': state } );
    // posting.done(function(data) {
    //   gameID = data.data.id
    //
    //   //data.id = game id
    //   console.log(data.state)
    // })
  }
  else{
    var posting = $.post('/games/' + gameID, { _method: 'PATCH' }, { 'state': state, 'gameID': gameID } );

    posting.done(function(data){
    })

  }
}

// retrieve current board
function getCurrentBoard(){
  var board = []
  board = $.map( $('td'), function( n ) {
    return n.innerText;
});
  return board
}

function getPreviousGames(){
  var games = $.get('/games')
  games.done(function(data){
    $('#games')[0].innerHTML = ''

  for(var index=0; index<data.data.length; index++) {

    $('#games')[0].innerHTML += "<p>Game " + data.data[index].id + ". <button onClick='restoreGame("+ data.data[index].id +")'>Select Game </button></p>"
  }
  })
}

function restoreGame(id){
  var game = $.get('/games/'+id)

  game.done(function(data) {

    var tags = $('td')
  for(var index=0;index<data.data.attributes.state.length;index++){
    tags[index].innerHTML = data.data.attributes.state[index]
  }
  })
}

function clearBoard() {
  board = $.map( $('td'), function( n ) {
    return n.innerHTML = '';
  });
  gameID = 0
  turnCount = 0
}

var turnCount = 0
function player(){
  if (turnCount === 0 || turnCount%2 === 0 ){
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(location){
    var turn = player()
    $('#'+location)[0].innerHTML = turn
    return turn
}

function doTurn(location){
  if($('#'+location)[0].innerHTML === ''){
    updateState(location)

    if (checkWinner() !== false) {
      setMessage("We have a winner")
      saveGame()
      var gameVar = setTimeout(function(){
        clearBoard()
        clearMessage()
      }, 2000)
    } else if (fullBoard() === -1){
      var gameOver = "Cats game"
      setMessage(gameOver)
      saveGame()
      var endVar = setTimeout(function(){
        clearBoard()
        clearMessage()
      }, 2000)
    }
    turnCount++
  }
}

function setMessage(msg){
  $('#message')[0].innerHTML = msg
}

function clearMessage() {
  $('#message')[0].innerHTML = ''
}

function checkWinner(){
  var state = getCurrentBoard()
  var winner
  var full = fullBoard()
  for(var i=0; i<win_combinations.length; i++){
    win_position_1 = win_combinations[i][0]
    win_position_2 = win_combinations[i][1]
    win_position_3 = win_combinations[i][2]

    position_1 = state[win_position_1]
    position_2 = state[win_position_2]
    position_3 = state[win_position_3]
    if ((position_1 === "X" && position_2 === "X" && position_3 === "X") || (position_1 === "O" && position_2 === "O" && position_3 === "O")){
      return true
    // winner = 'Player ' + position_1 + " Won!"
    // return winner
  } else { return false }
    }
  }

//checks if the boad is full
function fullBoard(){

  var state = getCurrentBoard()
  return $.inArray('', state)
}
