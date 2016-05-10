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
// debugger;

  var gameState = $("td").map(function(){ 
    return $(this).text() 
  })

  
// debugger;
  
  // var taken = []
  // for (var i=0; i<gameState.length; i++){ 
  //   if (gameState[i] != ""){ 
  //     taken.push(gameState[i])}
  // }
  // debugger;

  var position = $(this)
  updateState(position)
  console.log(checkWinner(gameState))


  turn ++
  // then post game state
  // then check for winner
  // then change player

  // if (($("#game").attr("data-id")) === "curr"){
  //   $.post("games/", values
  // }

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
  // debugger;
  if (turn % 2 === 0){
    return "X"
  }else{
    return "O"
  }
}

function checkWinner(){
  if ($("tr:contains('X')").children(":contains('X')").length === 3){
    return true
  }else{
    return false
  }
}

// var empty = []
// for (var i=0; i<gameState.length; i++){ if (gameState[i]!=""){ empty.push(gameState[i])}}
