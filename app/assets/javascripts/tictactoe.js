// Code your JavaScript / jQuery solution here
var turn = 0
var win_combinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

$( document ).ready( attachListeners )

var player = () => turn % 2 === 0 ? "X" : "O"


function doTurn(td) {
  console.log('start turn #: ${turn}')
  updateState(td)
  checkWinner()
  turn ++
}

function updateState(td) {
  $(td).text(player())

}

function setMessage(string) {
  $("#message").text(string)
}

function checkWinner() {
  var board = []

}

function attachListeners() {
  $("td").on('click', function() {
    doTurn(this)
  })
}
