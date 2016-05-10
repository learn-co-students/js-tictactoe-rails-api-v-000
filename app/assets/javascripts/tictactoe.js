var turn = 0

$(document).ready(function(){
  attachListeners()
})


function attachListeners(){
  $("td").click(doTurn)

  $("#save").click(function(){
    console.log("another ajax call!")
  })

  $("#previous").click(function(){
    console.log("and another ajax call, to game create/game save")
  })
}


function doTurn(){

  var gameState = $("td").map(function(){ 
    return $(this).text() 
  })
debugger;
  var position = $(this)
  updateState(position)
  checkWinner()

  if ($('#message').html() !== ""){
    resetGame(gameState)
  }

  turn ++

  // POST GAME STATE HERE
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
// debugger;
  var state=gameState
  // get id for game: $("div").attr("data-id")
  // persist game
  // call games#create

}

function persistGame(gameState){

  // switch ($("#game").attr("data-id") {
  //   // case "curr"
  // })
}



function winCombos() {
  // debugger;
  switch (3) {
    case $("td[data-x=0]:contains('X')").length:
    // debugger;
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