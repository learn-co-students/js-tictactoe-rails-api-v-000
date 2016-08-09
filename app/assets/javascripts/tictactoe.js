var turn = 0;
var winComb = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

function cellValues(){
  var cellOne = $('[data-x="0"][data-y="0"]').html();
  var cellTwo = $('[data-x="0"][data-y="1"]').html();
  var cellThree = $('[data-x="0"][data-y="2"]').html();
  var cellFour = $('[data-x="1"][data-y="0"]').html();
  var cellFive = $('[data-x="1"][data-y="1"]').html();
  var cellSix = $('[data-x="1"][data-y="2"]').html();
  var cellSeven = $('[data-x="2"][data-y="0"]').html();
  var cellEight = $('[data-x="2"][data-y="1"]').html();
  var cellNine = $('[data-x="2"][data-y="2"]').html();
  values = [cellOne, cellTwo, cellThree, cellFour, cellFive, cellSix, cellSeven, cellEight, cellNine]
  return values;
}

function matchValues(values){
  for ( i = 0; i < winComb.length; i++){
    if ( winComb[i].every(checkWin) === true ){
      return true
    }

  }
}

function checkWin(val) {
  debugger
  return val === player();
}

function attachListeners() {
  var selector = $('td');
  selector.click(function(){
    doTurn(this);
  });
}

function doTurn(event){
  turn += 1;
  checkWinner();
  updateState(event);
}

function updateState(event){
  var mark = player();
  if ( $(event).html() === "" ) {
    if ( mark === "X" ){ 
      $(event).html("X");
    } else {
      $(event).html("O");
    }
  }

}

function checkWinner(){
  var values = cellValues();
  // var match = matchValues(value);
  // if  (match === true) {
  //   return message();
  // }
  var winMessage = "Player " + player() + " won!"
  message(winMessage);
}

function freezeBoard(){
  // freezes the board when a player wins 
}

function player(){
  if ( turn % 2 == 0 ){ 
    return "O";
  } else {
    return "X";
  }
}

function message(message){
  $('#message').html(message);
}

function resetGame(){

}

$(document).ready(function() {
  attachListeners()
  
});