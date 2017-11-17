var turn = 0;
const spots = document.querySelectorAll('td')

function box(num) {
  return spots[num - 1].innerHTML
}

function horizontalWin() {
  if (
    box(1) != "" && box(1) === box(2) && box(1) === box(3)){
    return true
  } else if (box(4) != "" && box(4) === box(5) && box(4) === box(6)) {
    winner = box(4)
  } else if (box(7) != "" && box(7) === box(8) && box(7) === box(9)) {
    winner = box(7)
  } else {
    return false
  }
}

function verticalWin() {
  if (
    box(1) != "" && box(1) === box(4) && box(1) === box(7)){
    return true
  } else if (box(2) != "" && box(2) === box(5) && box(2) === box(8)) {
    return true
  } else if (box(3) != "" && box(3) === box(6) && box(3) === box(9)) {
    return true
  } else {
    return false
  }
}

function diagonalWin() {
  if (
    box(1) != "" && box(1) === box(5) && box(1) === box(9)){
    return true
  } else if (box(3) != "" && box(3) === box(5) && box(3) === box(7)) {
    return true
  } else {
    return false
  }
}

function isEven(num) {
  return num % 2 === 0;
}

function player() {
  if (isEven(turn)) {
    return "X"
  } else {
    return "O"
  }
}


function updateState(spot) {
  spot.innerHTML = player()
}

function setMessage(string) {
  $("#message").html(string)
}

function checkWinner() {
  if (horizontalWin() || verticalWin() || diagonalWin()) {
    return true
    var winner = player()
    var string = `Player ${winner} Won!`
    setMessage(string)
  } else {
    return false
  }
}

function doTurn(spot) {
  turn += 1
  if (checkWinner() === true) {

  } else {
    updateState(spot)
  }
}

function attachListeners() {

}

$(document).ready(

 attachListeners()
)
