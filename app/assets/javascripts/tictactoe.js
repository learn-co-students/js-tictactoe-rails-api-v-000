// Code your JavaScript / jQuery solution here
// $( "td:contains('x')" )
var turn = 0
const newGame = $("table")
const winCombinations = [
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[2,0],[1,1],[0,2]]
]

function isEven(n) {
   return n % 2 == 0;
}

function player(){
  return isEven(turn) ? 'X' : 'O'
}

function updateState(element){
  $(element).html(player())
}

function setMessage(message){
  $('#message').html(message)
}

function checkWinner(){
  let winner = ""
  let winningCombo = winCombinations.find( combo => {
    const value1 = $(`td[data-x='${combo[0][0]}'][data-y='${combo[0][1]}']`).html()
    const value2 = $(`td[data-x='${combo[1][0]}'][data-y='${combo[1][1]}']`).html()
    const value3 = $(`td[data-x='${combo[2][0]}'][data-y='${combo[2][1]}']`).html()
    winner = value1
    return value1 !== "" && value1 === value2 && value2 === value3
  })
    if (winningCombo) {
      setMessage(`Player ${winner} Won!`);
      return true;
    } else {
      return false;
    }
}

function checkTie(){
  let board = []
  $("td").each(function(index, item){
    board.push(item.innerHTML)
  })
  const tie = board.findIndex(element => {
    return element === ""
  })
 return tie < 0 ? true : false
}

function doTurn(element){
  updateState(element)
  turn += 1
  if (checkWinner()) {
    $('td').text("");
    turn = 0
  } else if (checkTie()) {
    setMessage("Tie game.");
    $('td').text("");
    turn = 0
  }
}

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  })
}
