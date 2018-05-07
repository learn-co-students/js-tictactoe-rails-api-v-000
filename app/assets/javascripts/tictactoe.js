var turn = 0;

$(function(){

  attachListeners();


});


function saveGame(){
  $("#save").click(function(e){
    e.preventDefault();

  })
}

function player(){
  var token
    if (turn % 2 == 0){
      token = "X"
    } else {
      token = "O"
    }
  return token
}

// function turnIsEven(){
//ASK WHY CAN"T I USE THIS HELPER
// FUNCTION IN MY PLAYER()????
//
//   return turn % 2 == 0;
// }


function doTurn(){
  turn += 1;

  updateState($(this));
}

function updateState(clickedElement){
  var token = player();
  debugger;
  clickedElement.html(token)
}

function setMessage(){

}

function checkWinner(){

}

function attachListeners(){

  $("td").click(doTurn)

  saveGame();

}
