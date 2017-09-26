// Code your JavaScript / jQuery solution here

var winCombination = [
 [0,1,2],
 [3,4,5],
 [6,7,8],
 [0,3,6],
 [1,4,7],
 [2,5,8],
 [0,4,8],
 [2,4,6]
]

var board = ["", "", "", "", "", "", "", "", "" ]
var turn = 0


function player() {
  if (turn % 2 === 0) {
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(square) {
  $(square).text(player())
}

function setMessage(string) {
  $("div#message").html(string)
}

function checkWinner() {
  var board = window.document.querySelectorAll('td')
  for (var i = 0; i < winCombination.length; i++) {
    var combo = winCombination[i] // [0,1,2]
    var boardCombo1 = board[combo[0]].innerHTML
    var boardCombo2 = board[combo[1]].innerHTML
    var boardCombo3 = board[combo[2]].innerHTML
      if ((boardCombo1 === "X" && boardCombo2 === "X" && boardCombo3 === "X") ||
        (boardCombo1 === "O" && boardCombo2 === "O" && boardCombo3 === "O")) {
        setMessage(`Player ${boardCombo1} Won!`)
        return true
      }
    }
      return false
}

function doTurn() {
  updateState()
  turn += 1
  if (checkWinner()) {
    resetBoard()
  }
  else if (turn === 9) {
    setMessage("Tie game.")
    resetBoard()
  }
}

function resetBoard() {
  $('td').empty()
  turn = 0
}

$(document).ready(function() {
  attachListeners()
})

 function attachListeners() {
   $('td').on('click', function() {
     if (($(this).html() === "") && (!checkWinner())) {
       doTurn(this)
     }
   })
   $("#save").on("click", saveGame())
 }

 function saveGame() {
   $.get("/games").success(function(response) {
    $("div#save").html(response)
  });

 }
