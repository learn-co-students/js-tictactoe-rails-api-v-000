// Code your JavaScript / jQuery solution here

$(document).ready(function(){
//ONLY call this one if they click in table area!!!
  // document.addEventListener("click", function(){
  //   doTurn(event.toElement.id)
  // });
  attachListeners()

})

function attachListeners(){
  $('td').on('click', function(event){

    doTurn(event.target)
  })

  // document.getElementById("board").addEventListener("click", function(){
  //   doTurn(event.toElement.id)
  // })

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
         gameID = result.data.id
    }});
  }
  else{
    debugger
    var url = '/games/'+gameID
    $.ajax({
      type: 'PATCH',
      url: url,
      data: gameData,
       success: function(result){

       }

    })
  }
}

// retrieve current board
function getCurrentBoard(){
  var board = []
  board = $.map( $('td'), function( n ) {
    return n.innerHTML;
});
  return board
}

function getPreviousGames(){
  var games = $.get('/games', function(data){
    $('#games')[0].innerHTML = ''

    for(var index=0; index<data.data.length; index++){
      $('#games')[0].innerHTML += "Game " + data.data[index].id + ". <button onClick='restoreGame("+ data.data[index].id +")'>Select Game </button>"
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
  gameID = data.id
  })
}

function clearBoard() {
  board = $.map( $('td'), function( n ) {
    return n.innerHTML = '';
  });
  gameID = 0
  turn = 0
}

var turn = 0

function player(){
  if (turn === 0 || turn%2 === 0 ){
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(location){
    var token = player()
    location.innerHTML = token
}

function doTurn(location){
  if(location.innerHTML === ''){
    updateState(location)
    winner = checkWinner()
    turn++
    if (winner !== false) {
      saveGame()
      clearBoard()
      clearMessage()
      // var gameVar = setTimeout(function(){
      //
      // }, 2000)
    } else if (fullBoard() === -1){
      var gameOver = "Tie game."
      setMessage(gameOver)
      saveGame()
      clearBoard()
      clearMessage()
    }
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
  var full = fullBoard()
  for(var i=0; i<win_combinations.length; i++){

    win_position_1 = win_combinations[i][0]
    win_position_2 = win_combinations[i][1]
    win_position_3 = win_combinations[i][2]

    position_1 = state[win_position_1]
    position_2 = state[win_position_2]
    position_3 = state[win_position_3]

    if ((position_1 === "X" && position_2 === "X" && position_3 === "X") || (position_1 === "O" && position_2 === "O" && position_3 === "O")){
      Object.freeze(state)
      message = 'Player ' + position_1 + " Won!"
      setMessage(message)
      return true
      }
    }
   return false
  }

//checks if the boad is full
function fullBoard(){
  var state = getCurrentBoard()
  return $.inArray('', state)
}
