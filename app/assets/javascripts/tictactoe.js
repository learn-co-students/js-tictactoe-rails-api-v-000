
var turn = 0;

// var winCombos = [
//   [[0, 0],[1,0],[2, 0],  //Top row
//   [3,4,5],  // Middle row
//   [6,7,8],  // Bottom row
//   [0,3,6],  // Vertical row
//   [1,4,7],  // Vertical Middle row
//   [2,5,8],  // Vertical row
//   [0,4,8],  // Diagonal Row
//   [6,4,2]   // Diagonal Row
//   ]
  

$(function() {
  attachListeners();
});

function attachListeners(){
  $('td').on("click", function(){
    var x = $(this).data("x");
    var y = $(this).data("y");
    doTurn(x, y);
  });
}

function doTurn(x, y){
  updateState(x, y);
  checkWinner();
  turn += 1;
}

function checkWinner(){
  // winCombos.forEach(function(){
  //   $('td[data-x="' + x + '"][data-y="' + y + '"]').text
  // })
}

function updateState(x, y){
  var token = player();
  $('td[data-x="' + x + '"][data-y="' + y + '"]').text(token);
}

function player(){
  if (turn % 2 === 0){
    return "X";
  } else {
    return "O";
  }
}

function message(string){
  $('#message').html(string);
}