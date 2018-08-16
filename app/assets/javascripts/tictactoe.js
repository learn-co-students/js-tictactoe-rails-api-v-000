// Code your JavaScript / jQuery solution here
const winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

let board = function () {
  let array = Array.prototype.slice.call(document.querySelectorAll('td'))
  return array.map(function (i) {return i.innerHTML})
}

function positionTaken(index) {
  if (board()[index] != "") { return true }
  else { return false }
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

function won(array) {
  if (positionTaken(array[0]) == true) {
    if (board()[array[0]] == board()[array[1]] && board()[array[0]] == board()[array[2]] &&
    board()[array[1]] == board()[array[2]]) { return true }
      else { return false }
  } else { return false }
}

function checkWinner() {
  debugger
  let winner = winCombinations.find(function (e) {
    return won(e) == true
  })
}
//      if (won(e) == true) {
//        if (e[0] == 'X') {
//          setMessage('Player X Won!')
//        } else {
//          setMessage('Player O Won!')
//        }
//      } else {
//        setMessage('LOSE')
//      }
//  })
//}

//    board()[e[0]] == board()[e[1]] && board()[e[0]] == board()[e[2]] &&
//    board()[e[1]] == board()[e[2]] && board()[0] != "" && board()[1] != ""
//  })
//  return winningArray()
//}

//def won?
//    WIN_COMBINATIONS.detect do |win_combo|
//      @board[win_combo[0]] == @board[win_combo[1]] && @board[win_combo[0]] == @board[win_combo[2]] && position_taken?(win_combo[0])
//    end
//  end
function doTurn() {
  this.turn += 1
  checkWinner()
  updateState()
}

function attachListener() {

}
