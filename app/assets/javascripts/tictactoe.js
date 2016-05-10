var turn = 0
var currentGame

var gameState


$(document).ready(function(){

  testState = $("td").map(function(){ 
    return $(this).text() 
  })

  currentGame = $('#game').attr("data-id")


  attachListeners()
})


function attachListeners(){
  $("td").click(doTurn)

  $("#save").click(function(){
    persistGame(gameState)
    console.log("another ajax call!")
  })

  $("#previous").click(function(){
    console.log("and another ajax call, to game create/game save")
  })
}


function doTurn(){

  gameState = $("td").map(function(){ 
    return $(this).text() 
  })

  var position = $(this)
  updateState(position)
  persistGame(gameState)
  checkWinner()


  if ($('#message').html() !== ""){
    resetGame(gameState)
  }

  turn ++


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
  }else if(turn +1 === 9){
    message("Tie game") 
  }else{
    return false
  }
}

function message(string){
  $("#message").html(string)
}


function resetGame(gameState){

  var state=gameState
  // get id for game: $("div").attr("data-id")
  // persist game
  // call games#create

}

function persistGame(gameState){
  // debugger;
  var gameParams = {game: gameState.toArray()}

  switch (currentGame) {
    case ("curr"):
      $.post("/games.json", gameParams, function(response){
        console.log(response)
        var game = response["game"]
        // $("#game").attr("data-id", game["id"])
        currentGame = game["id"]
      })
      break;
    default:
    
      $.ajax({
        url: "games/" + currentGame + ".json",
        method: "PATCH",
        data: gameParams, 
        success: function(response){
        var game = response["game"]
        console.log(game["state"])
        }
      })
    }
}



function winCombos() {
  
  switch (3) {
    case $("td[data-x=0]:contains('X')").length:
    
      return true
      // message("Player X Won!")
      break;
    case $("td[data-x=0]:contains('O')").length:
      return true
      // message("Player X Won!")
      break;
    case $("td[data-x=1]:contains('X')").length:
      return true
      // message("Player X Won!")
      break;
    case $("td[data-x=1]:contains('O')").length:
      return true
      // message("Player X Won!")
      break;
    case $("td[data-x=2]:contains('X')").length:
      return true
      // message("Player X Won!")
      break;
    case $("td[data-x=2]:contains('O')").length:
      return true
      // message("Player X Won!")
      break;
    case $("td[data-y=0]:contains('X')").length:
      return true
      // message("Player X Won!")
      break;
    case $("td[data-y=0]:contains('O')").length:
      return true
      // message("Player X Won!")
      break;
    case $("td[data-y=1]:contains('X')").length:
      return true
      // message("Player X Won!")
      break;
    case $("td[data-y=1]:contains('O')").length:
      return true
      // message("Player X Won!")
      break;
    case $("td[data-y=2]:contains('X')").length:
      return true
      // message("Player X Won!")
      break;
    case $("td[data-y=2]:contains('O')").length:
      return true
      // message("Player X Won!")
      break;
    case $("td[data-x='0'][data-y='0']:contains('O'), td[data-x='1'][data-y='1']:contains('O'), td[data-x='2'][data-y='2']:contains('O')").length:
      return true
      // message("Player X Won!")
      break;
    case $("td[data-x='0'][data-y='0']:contains('X'), td[data-x='1'][data-y='1']:contains('X'), td[data-x='2'][data-y='2']:contains('X')").length:
      return true
      // message("Player X Won!")
      break;
    case $("td[data-x='2'][data-y='0']:contains('O'), td[data-x='1'][data-y='1']:contains('O'), td[data-x='0'][data-y='2']:contains('O')").length:
      return true
      // message("Player X Won!")
      break;
    case $("td[data-x='2'][data-y='0']:contains('X'), td[data-x='1'][data-y='1']:contains('X'), td[data-x='0'][data-y='2']:contains('X')").length:
      return true
      // message("Player X Won!")
      break;
  }
}