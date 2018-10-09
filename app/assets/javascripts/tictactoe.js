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
  var wonGame = WINNING_COMBOS.filter(function(winCombo){
    var position_1 = $('td')[winCombo[0]].textContent
    var position_2 = $('td')[winCombo[1]].textContent
    var position_3 = $('td')[winCombo[2]].textContent

    return (position_1 ==="X" && position_2 === "X" && position_3 === "X") || (position_1 === "O" && position_2 === "O" && position_3 === "O")
  })
  if (wonGame[0]){
    var token = $('td')[wonGame[0][0]].textContent
    setMessage(`Player ${token} Won!`)
    return true
  } else {
    return false
  }
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
