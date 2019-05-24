// Code your JavaScript / jQuery solution here
var turn = 0

var WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function player(){
  if (turn%2 === 0){
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(element){
  element.innerHTML = player()
}

function setMessage(string){
  $('#message').text(string)
}

function checkWinner(){
  var winner = false
  var board = {}
  $('td').text((index, square) => (board[index] = square)) //what is this..?

  WIN_COMBINATIONS.forEach(function(position){
    if(board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] != "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })
  return winner
}

function doTurn(square){
  updateState(square)
  turn++;
  if (checkWinner()) {
    $('td').empty()
    turn = 0;
  } else if (turn === 9) {
    setMessage("Tie game.")
  }
}

function attachListeners(){
  $("td").click(function(e){
    doTurn(this)
  });
}

$(document).ready(function() {
  attachListeners()
});
