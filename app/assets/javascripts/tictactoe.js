var turn = 0;
var currentGame = 1;

function cellValues(){
  var cellOne = $('[data-x="0"][data-y="0"]').html();
  var cellTwo = $('[data-x="1"][data-y="0"]').html();
  var cellThree = $('[data-x="2"][data-y="0"]').html();
  var cellFour = $('[data-x="0"][data-y="1"]').html();
  var cellFive = $('[data-x="1"][data-y="1"]').html();
  var cellSix = $('[data-x="2"][data-y="1"]').html();
  var cellSeven = $('[data-x="0"][data-y="2"]').html();
  var cellEight = $('[data-x="1"][data-y="2"]').html();
  var cellNine = $('[data-x="2"][data-y="2"]').html();
  values = [cellOne, cellTwo, cellThree, cellFour, cellFive, cellSix, cellSeven, cellEight, cellNine]
  return values;
}

function matchValues(values){
  if ( values[0] === player() && values[1] === player() && values[2] === player() ){
    return true;
  } else if ( values[3] === player() && values[4] === player() && values[5] === player() ) {
    return true;
  } else if ( values[6] === player() && values[7] === player() && values[8] === player() ){
    return true;
  } else if ( values[0] === player() && values[3] === player() && values[6] === player() ){
    return true;
  } else if ( values[1] === player() && values[4] === player() && values[7] === player() ){
    return true;
  } else if ( values[2] === player() && values[5] === player() && values[8] === player() ){
    return true;
  } else if ( values[0] === player() && values[4] === player() && values[8] === player() ){
    return true;
  } else if ( values[2] === player() && values[4] === player() && values[6] === player() ){
    return true;
  } else {
    return false;
  }
}

function attachListeners() {
  $('td').click(function(){
    doTurn(this);
  });
  $('#previous').click(function(){
    previousGame();
  });
  $('#save').click(function(){
    saveGame();
  });
}

function doTurn(event){
  updateState(event);
  if ( checkWinner() == true ) {
    resetGame();
  } else if ( checkTie() == true ) {
    resetGame();
  } else {
    turn += 1;
  }
}

function updateState(event){
  if ( $(event).html() === "" ) {
    $(event).html(player());
  }
}

function checkWinner(){
  var values = cellValues();
  if ( matchValues(values) == true ) {
    var winMessage = "Player " + player() + " Won!"
    message(winMessage);
    return true;
  } else {
    return false;
  }
}

function checkTie(){
  var values = cellValues();
  if ( matchValues(values) == false && $.inArray("", values) == -1) {
    var tieMessage = "Tie game"
    message(tieMessage);
    return true;
  } else {
    return false;
  }
}

function player(){
  if ( turn % 2 == 0 ){ 
    return "X";
  } else {
    return "O";
  }
}

function message(message){
  $('#message').html(message);
}

function resetGame(){
  turn = 0;
  saveGame();
  currentGame += 1;
  $('td').html("");
}

function saveGame(){
  $.ajax({
      url: '/games',
      method: 'post',
      data: "hello"
    }).done(function(response){
      $('#games').append("hello");
    });
}

function previousGame(){
  $.ajax({
      url: '/games',
      method: 'get',
    }).done(function(response){
      $('#games').html(response);
    });
}

$(document).ready(function() {
  attachListeners() 
});