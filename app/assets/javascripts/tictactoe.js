// Code your JavaScript / jQuery solution here
const winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

function attachListeners(tdElement) {
  document.body.addEventListener('click', function(element) {
    if 
  }
  tdElement.addEventListener('click', doTurn(tdElement))
}

//Begin helper functions
let board = function () {
  let array = Array.prototype.slice.call(document.querySelectorAll('td'))
  return array.map(function (i) {return i.innerHTML})
}

function positionTaken(index) {
  if (board()[index] !== "") { return true }
  else { return false }
}

function won(array) {
  //debugger
  if (positionTaken(array[0]) == true) {
    if (board()[array[0]] == board()[array[1]] && board()[array[0]] == board()[array[2]] &&
    board()[array[1]] == board()[array[2]]) { return true }
      else { return false }
  } else { return false }
}

function resetBoard() {
  let newBoard = Array.prototype.slice.call(document.querySelectorAll('td'))
  $('td').html("")
}

function fullBoard() {
  let notFull = function(e) {
    return e == ""
  }
  return !board().some(notFull)
}

function tieGame() {
  if (fullBoard() == true && checkWinner() == false) {
    return true
  } else {
    return false
  }
}

//End Helper Functions

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
  for (var i = 0; i < winCombinations.length; i++) {
    if (won(winCombinations[i]) == false) {
      continue
    } else {
      if (board()[winCombinations[i][0]] == 'X') {
        setMessage('Player X Won!')
      } else if (board()[winCombinations[i][0]] == 'O') {
        setMessage('Player O Won!')
      }
      return true
      break
    }
  }
  return false
}

function doTurn(cell) {
  updateState(cell)
  this.turn += 1
  if (checkWinner() == true) {
    checkWinner()
    this.turn = 0
    resetBoard()
  } else {
    if (tieGame() == true) {
      setMessage('Tie game.')
      resetBoard()
    }
  }
}
