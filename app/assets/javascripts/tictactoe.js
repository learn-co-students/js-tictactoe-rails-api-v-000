// Code your JavaScript / jQuery solution here
//
var turn = 0

function player(){
  if (turn % 2 === 0){
    return 'X'
  } else {
    return 'O'
  }
};


function updateState(element){
  debugger
  $(element).text(player())
}

function setMessage(msg){
  let $messageDiv =  $("#message")
  $messageDiv.text(msg)
}

function checkWinner(){

}

function doTurn(){

}

function attachListeners(){
  let $theBoard = $("td")

  for (let i of $theBoard){
    $(i).on("click", function(e){
      updateState(this)
    })
  }
}

$(function(){
  attachListeners();
});
