// Code your JavaScript / jQuery solution here
var board = $('td')

var turn = 0

function player() {
  if (this.turn % 2 == 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(cell) {
  let index = cell - 1
  let token = player()
  if (board[index].innerHTML == "") {
    board[index].innerHTML = token
  } else {
    return error
  }
}

class Game {
  constructor(turn) {
    this.turn = turn
  }
}

function setMessage() {

}

function checkWinner() {

}

function doTurn() {

}

function attachListener() {

}
