$(document).ready(function() {
  attachListeners()
})

var currentGame = 0
var turn = 0
const winCombinations = [
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[2,0],[1,1],[0,2]],
];

var attachListeners = function() {
  $('td').on('click', function(event) {
    doTurn(event)
  })
  $('#save').on('click', function() {
    saveGame()
  })
}

function player() {
  return turn % 2 === 0 ? "X" : "O"
}

function message(string) {
  $("#message")[0].innerText = string
}

function doTurn(event) {
  updateState(event)
  turn += 1
  checkWinner()
}

function updateState(event) {
  event.currentTarget.innerText = player()
}

function checkWinner() {
  winCombinations.forEach(function(combo) {
    if (readBoard(combo[0]) != '' &&
       readBoard(combo[0]) === readBoard(combo[1]) &&
       readBoard(combo[0]) === readBoard(combo[2])) {
       var winner = readBoard(combo[0])
       resetBoard()
       return message(`Player ${winner} Won!`)
     }
  })
  if (turn === 9) {
    resetBoard()
    return message(`Tie game`)
  } else {
    return false
  }
}

function resetBoard() {
  $('td').each(function() {
    this.innerText = ''
  })
  turn = 0
}

function readBoard(position) {
  var x = position[0]
  var y = position[1]
  return $("td[data-x='" + x +"'][data-y='" + y +"']")[0].innerText;
}

function saveGame() {
  var gameState = []
  $('td').each(function() {
    gameState.push(this.innerText)
  })

  $.post(
    '/games',
    {'game[state]': gameState},
    function(data) {
      var currentGame = $(data).filter('#game-id')[0].innerText
    })
}

function updateGame() {
  var gameState = []
  $('td').each(function() {
    gameState.push(this.innerText)
  })
  debugger
  $.patch('/games/')
}
