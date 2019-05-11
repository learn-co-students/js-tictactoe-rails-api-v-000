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

//function updateState() {
	//$( "button" ).click( function() {
  //var value,
    //div = $( "div" )[ 0 ];
  //data-x
  //data-y
//}

function setMessage(string) {
   $( "#message").html(string);
   //div.text("string");

}

function checkWinner() {

}

function doTurn() {

}

function attachListeners() {

}