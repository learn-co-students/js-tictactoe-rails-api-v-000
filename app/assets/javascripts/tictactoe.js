// Code your JavaScript / jQuery solution here
let turn = 0
function player() {
  if (turn % 2 == 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(element) {
  x = player()
}



function doTurn() {
  turn += 1
  updateState(element)
  checkWinner()
}
