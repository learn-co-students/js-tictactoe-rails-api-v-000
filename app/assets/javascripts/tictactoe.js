// Code your JavaScript / jQuery solution here
var turn = 0;

// var winningCombinations = [[combo1],[combo2],[combo3]]
const WIN_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

function player() {
  if (!!(turn % 2)) {
    return 'O'
  } else {
    return 'X'
  }
}

function updateState(el) {
  //el is the clicked element, so query for that and update text of element
  $(el).text(player())
}

function checkWinner() {
//grab current board
  var board = getBoard()
//compare board to winning combinations, return true or false
  WIN_COMBINATIONS.forEach(combo => {
     !!(board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]])
  })
}

function getBoard() {
  return $('td').map(td => td.text || '')
}

function setMessage(string) {
  $('#message').text(string)
}

function doTurn() {
  turn += 1
  updateState(el)
  checkWinner()
}

function attachListeners() {

//attach listeners to board and 3 buttons
//if board is clicked call doTurn(), else call button specific function
}

$(function() {
  attachListeners();
})