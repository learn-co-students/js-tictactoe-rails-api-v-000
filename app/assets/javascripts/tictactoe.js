$(document).ready(function() {
  attachListeners()
})

var gameState = []
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
  checkWinner(event)
}

function updateState(event) {
  event.toElement.innerText = player()
}

function checkWinner(event) {
  winCombinations.forEach(function(combo) {
    debugger
    if (readBoard(combo[0]) != '') {
       if (readBoard(combo[0]) === readBoard(combo[1]) &&
       readBoard(combo[0]) === readBoard(combo[2])) {
       return message(`Player ${readBoard(combo[0])} Won!`)
     } else {
       return false
     }
    }
  })
}

function readBoard(position) {
  var x = position[0]
  var y = position[1]
  return $("td[data-x='" + x +"'][data-y='" + y +"']")[0].innerText;
}

function toXY(data) {
  return [event.toElement.dataset.x, event.toElement.dataset.y]
}
