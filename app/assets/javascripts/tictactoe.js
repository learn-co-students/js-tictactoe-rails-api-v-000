// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0

function player(){
  if (turn % 2 === 0){
    return "X"
  } else {
    return "O"
  }
}

function updateState(element){
  element.innerText = player()
}

function setMessage(message){
  $('#message').text(e => message)
}

function compareArrays(a, b) {
    return !a.some(function (e, i) {
        return e != b[i];
    });
}

function checkWinner(){
  var xArray = []
  var oArray = []
  var winner = false

  $("td").each(function( index ) {
    if (this.innerText === 'X'){
      xArray.push(index)
    }
    if (this.innerText === 'O'){
      oArray.push(index)
    }
  });

  WINNING_COMBOS.forEach(function (currentValue){
    var xWin = compareArrays(currentValue, xArray)
    var oWin = compareArrays(currentValue, oArray)
    if (xWin === true) {
      winner = true
      setMessage("Player X Won!")
    }
    if (oWin === true) {
      winner = true
      setMessage("Player O Won!")
    }
  });

  return winner
}

function doTurn(element){
  turn++
  updateState(element)
  if (turn === 9 && checkWinner() === false){
    setMessage("Tie game.")
  }
  if (checkWinner()){
    turn = 0
    for (let i = 0; i < 9; i++) {
      $('td')[i].innerHTML = '';
    }
  }
}
