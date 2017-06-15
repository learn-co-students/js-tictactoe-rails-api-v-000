var turn = 0
var currentGame = 0
var htmlMap=["data-x=0 data-y=0 ","data-x=1 data-y=0 ","data-x=2 data-y=0 ","data-x=0 data-y=1 ","data-x=1 data-y=1 ","data-x=2 data-y=1 ","data-x=0 data-y=2 ","data-x=1 data-y=2 ","data-x=2 data-y=2 "]
var gameState 


$(document).ready(function(){

  gameState = $("td").map(function(){ 
    return $(this).text() 
  })

  attachListeners()
})


function attachListeners(){
  // $("tr").children().click(doTurn)
  // $("td").on('click', doTurn)
  $("td").click(function(){
    doTurn(this);
  })

  $("#save").click(function(){
    persistGame(gameState, function(response){
        var game = response["game"]
        $("#game").attr("data-id", game["id"])
        currentGame = game["id"]
    })
  })

  $("#previous").click(getAllGames)
  
}


function doTurn(obj){
  var position = obj
  updateState(position)

debugger;
  gameState = $("td").map(function(){ 
    return $(this).text() 
  })

  
  
  var winner = checkWinner()

  turn ++

  if (winner === true || winner === 'tie'){
    resetGame(gameState)
  }

  
}


function updateState(obj){
  $(obj).text(player)
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
  var state=gameState
  turn = 0
  currentGame=0
  $("#game").attr("data-id", "curr")
  $("td").html("")
  persistGame(state)


}

function persistGame(gameState, callback){
  var gameParams = {state: gameState.toArray()}


  switch (currentGame) {
    case (0):
      $.post("/games", gameParams, function(response){
      }).done(callback)
      break;

    default:
      $.ajax({
      url: "/games/" + currentGame, 
      method: "patch",
      data: gameParams, 
      success: function(response){
        console.log("updated")
        currentGame = response["game"]["id"]
        return "updated"
      }
    })
  }
}


function getAllGames(){
  $.get('/games', function(response){
      var games=response["games"]
      var gamesList = ""
      
      $.each(games, function(index, game){
        gamesList += "<li><button data-gamestate='" + JSON.stringify(game.state) + "' data-gameid='" + game.id + "' >Game " + game.id + "</button>"
    })
    
    $("#games").html(gamesList)
    $("#games button").click(getOldGame)
  })
}

function getOldGame(){

  var id = $(this).attr("data-gameid")
  var state = JSON.parse($(this).attr("data-gamestate"))
  var assembled=["<tr>"]
  
  for (var i = 0; i < state.length; i++){ 
    assembled.push("<td " + htmlMap[i] + ">" + state[i] + "</td>")
  }

  assembled.splice(4, 0, "</tr><tr>")
  assembled.splice(8, 0, "</tr><tr>")
  assembled.push("</tr>")
  var assJoin = assembled.join("")
  currentGame = id
  $("#game").attr("data-id", currentGame)
  $("tbody").html(assJoin)

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