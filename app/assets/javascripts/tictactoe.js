var turn = 0

// $(document).ready(function(){
//   attachListenters()
// })


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
  
  var taken = []
  for (var i=0; i<gameState.length; i++){ 
    if (gameState[i] != ""){ 
      taken.push(gameState[i])}
  }

  $(this).text(player(taken.length))

  // then post game state
  // then check for winner
  // then change player

  // if (($("#game").attr("data-id")) === "curr"){
  //   $.post("games/", values
  // }

}

function isAvailable(obj){
  var position = obj
  return position.val() === ""
}

function player(turn){
  var check = turn
  // debugger;
  if (check % 2 === 0){
    return "X"
  }else{
    return "O"
  }
}

// var empty = []
// for (var i=0; i<gameState.length; i++){ if (gameState[i]!=""){ empty.push(gameState[i])}}
