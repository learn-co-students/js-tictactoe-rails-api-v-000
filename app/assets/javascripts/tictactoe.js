var turn = 0
var currentGame = 0

var gameState


$(document).ready(function(){

  testState = $("td").map(function(){ 
    return $(this).text() 
  })

  attachListeners()
})


function attachListeners(){
  $("td").click(doTurn)

  $("#save").click(function(){
    persistGame(gameState)
  })

  $("#previous").click(getAllGames)
  
}


function doTurn(){

  gameState = $("td").map(function(){ 
    return $(this).text() 
  })

  var position = $(this)
  updateState(position)
  
  var winner = checkWinner()

  turn ++

  if (winner === true || winner === 'tie'){
    resetGame(gameState)
  }

  
}


function updateState(obj){
  var pos = obj
  pos.text(player)
}


function isAvailable(obj){
  var position = obj
  return position.val() === ""
}


function player(){
  if (turn % 2 === 0){
    return "X"
  }else{
    return "O"
  }
}

function checkWinner(){
  if (winCombos() === true){
    message("Player " + player() + " Won!")
    return true
  }else if(turn +1 === 9){
    message("Tie game") 
    return 'tie'
  }else{
    return false
  }
}

function message(string){
  $("#message").html(string)
}


function resetGame(gameState){

  persistGame(gameState)
  turn=0
  currentGame=0
  $("td").html("")

}

function persistGame(gameState){

  var gameParams = {game: gameState.toArray()}

  switch (currentGame) {
    case (0):
      $.post("/games", gameParams, function(response){
        var game = response["game"]
        // $("#game").attr("data-id", game["id"])
        currentGame = game["id"]
      })
      break;
    default:
      $.ajax({
      url: "/games/" + currentGame, 
      method: "patch",
      data: gameParams, 
      success: function(response){
        currentGame = response["game"]["id"]
      }
    })
  }
}


function getAllGames(){
  $.get('/games', function(response){
    // debugger;
    var games=response["games"]
    var gamesList = ""
    
    $.each(games, function(index, game){
      gamesList += "<li><a href='http://localhost:3000/games/" + game.id + "' data-gameid='" + game.id + "' >Game " + game.id + "</a></li>"
    })
    
    $("#games").html(gamesList)
  })
}


function winCombos() {
  
  switch (3) {
    case $("td[data-x=0]:contains('X')").length:
      return true
      break;
    case $("td[data-x=0]:contains('O')").length:
      return true
      break;
    case $("td[data-x=1]:contains('X')").length:
      return true
      break;
    case $("td[data-x=1]:contains('O')").length:
      return true
      break;
    case $("td[data-x=2]:contains('X')").length:
      return true
      break;
    case $("td[data-x=2]:contains('O')").length:
      return true
      break;
    case $("td[data-y=0]:contains('X')").length:
      return true
      break;
    case $("td[data-y=0]:contains('O')").length:
      return true
      break;
    case $("td[data-y=1]:contains('X')").length:
      return true
      break;
    case $("td[data-y=1]:contains('O')").length:
      return true
      break;
    case $("td[data-y=2]:contains('X')").length:
      return true
      break;
    case $("td[data-y=2]:contains('O')").length:
      return true
      break;
    case $("td[data-x='0'][data-y='0']:contains('O'), td[data-x='1'][data-y='1']:contains('O'), td[data-x='2'][data-y='2']:contains('O')").length:
      return true
      break;
    case $("td[data-x='0'][data-y='0']:contains('X'), td[data-x='1'][data-y='1']:contains('X'), td[data-x='2'][data-y='2']:contains('X')").length:
      return true
      break;
    case $("td[data-x='2'][data-y='0']:contains('O'), td[data-x='1'][data-y='1']:contains('O'), td[data-x='0'][data-y='2']:contains('O')").length:
      return true
      break;
    case $("td[data-x='2'][data-y='0']:contains('X'), td[data-x='1'][data-y='1']:contains('X'), td[data-x='0'][data-y='2']:contains('X')").length:
      return true
      break;
  }
}