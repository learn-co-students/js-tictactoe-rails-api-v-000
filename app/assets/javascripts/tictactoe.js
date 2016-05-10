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
  checkWinner(gameState)


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

  // $("td[data-x=0]:contains('X')").length === 3 ///CHECKS FIRST VERT
  // $("td[data-x=1]:contains('X')").length === 3
  // $("td[data-x=2]:contains('X')").length === 3
  // $("td[data-y=0]:contains('X')").length === 3
  // $("td[data-y=1]:contains('X')").length === 3
  // $("td[data-y=2]:contains('X')").length === 3

  if ($("tr:contains('X')").children(":contains('X')").length === 3){
    console.log("true")
    message("Player X Won!")
    return true
  }else{
    console.log("false")
    return false
  }

  if ($("tr:contains('O')").children(":contains('O')").length === 3){
    return true
    console.log("true")
    message("Player X Won!")
  }else{
    console.log("false")
    return false
  }
}

function message(string){
  $("#message").html(string)
}

// var empty = []
// for (var i=0; i<gameState.length; i++){ if (gameState[i]!=""){ empty.push(gameState[i])}}
