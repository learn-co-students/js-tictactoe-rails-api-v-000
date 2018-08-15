// Code your JavaScript / jQuery solution here
const winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

let board = function () {
  let array = Array.prototype.slice.call(document.querySelectorAll('td'))
  return array.map(function (i) {return i.innerHTML})
}

var turn = 0

function player() {
  if (this.turn % 2 == 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(cell) {
  let token = player()
  cell.innerHTML = token
}

function setMessage(string) {
  $("#message").html(string)
}

function checkWinner() {

}

function doTurn() {
  this.turn += 1
  checkWinner()
  updateState()
}

function attachListener() {

}
