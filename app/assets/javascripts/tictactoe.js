// Code your JavaScript / jQuery solution here
WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
]

var turn = 0;
var player = () => turn % 2 ? 'O' : 'X';

function updateState(square) {
	var token = player();
  $(square).text(token);
}

function setMessage(string) {
   $( "#message").html(string);
   //div.text("string");

}

function checkWinner(board) {
  //$.each( WIN_COMBINATIONS, function( index, value ){
  //  .each(board, function());
//});
 
}

function doTurn(square) {
  turn ++;
  updateState(square);
  //checkwinner(board);
}

function attachListeners() {

}