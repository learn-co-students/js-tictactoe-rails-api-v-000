  var winCombinations = [
    [0,1,2], // Top row
    [3,4,5], // Middle row
    [6,7,8], // Bottom row
    [0,3,6], // Left Column
    [1,4,7], // Middle Column
    [2,5,8], // Right Column
    [0,4,8], // Diagnoal L to R
    [2,4,6]  // Diagnoal R to L
  ]

var turn = 0
var board = {}

var getBoard = () => {
  var index = 0
  document.querySelectorAll("[data-y='0']").forEach(function(row){
     board[index] = row
     index ++
  })
  document.querySelectorAll("[data-y='1']").forEach(function(row){
     board[index] = row
     index ++
  })
  document.querySelectorAll("[data-y='2']").forEach(function(row){
     board[index] = row
     index ++
  })
}

function updateState(e) {
  e.target.innerHTML = player()
}

var message = string => {
  document.getElementById('message').innerHTML = `<p>${string}</p>`
}

function player() { 
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function doTurn(e) {
  updateState(e)
  if (!checkWinner()){
    turn += 1
  } else {
    resetBoard()
  }
}

var resetBoard = () => {
  board = {}
  turn = 0 
}

function attachListeners() {
  $(document).ready(function() {
    $('td').on("click", function (e) {
      if (e.target.dataset && e.target.innerHTML == "") {
        e.target = doTurn(e)
      }
    }); 
  })
}

function checkWinner() {
  getBoard()
  winCombinations.forEach(function(row) {
    if (board[row[0]].innerText == board[row[1]].innerText && board[row[2]].innerText == board[row[1]].innerText && board[row[0]].innerText != ""){
      message(`Player ${board[row[0]].innerText} Won!`)
      return true
    }
  })
    if (checkTie()) {
      message('There is a tie')
    }
    return false
}

function checkTie() {
  for (var key in board) {
    if (board[key].innerText == ""){
      return false
    } 
  } 
    return true 
}

attachListeners()


