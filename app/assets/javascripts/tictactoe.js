// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;

var player = () => ((turn % 2 === 0) ? "X" : "O")

var updateState = (tdElement) => {
  $(tdElement).text(player());
}

var setMessage = (msgString) => {
  $("#message").text(msgString)
  }

var checkWinner = () => {

}

var doTurn = (tdElement) => {
  turn ++;
  updateState(tdElement);
  checkWinner(tdElement);
}

$(function(){
  $("#save").on('click', function(){
    //do something here
  })
})
