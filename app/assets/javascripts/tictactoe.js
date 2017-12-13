// Code your JavaScript / jQuery solution here
var turn = 0
const cellOne = $('*[data-x=0][data-y=0]')[0]
const cellTwo = $('*[data-x=1][data-y=0]')[0]
const cellThree = $('*[data-x=2][data-y=0]')[0]
const cellFour = $('*[data-x=0][data-y=1]')[0]
const cellFive = $('*[data-x=1][data-y=1]')[0]
const cellSix = $('*[data-x=2][data-y=1]')[0]
const cellSeven = $('*[data-x=0][data-y=2]')[0]
const cellEight = $('*[data-x=1][data-y=2]')[0]
const cellNine = $('*[data-x=2][data-y=2]')[0]

WIN_COMBINATIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]]

function player(){
  if(turn % 2 === 0) {
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(cell) {
  var token = player()
  cell.innerHTML = token
}

function setMessage(message) {
  document.getElementById("message").innerHTML = message
}

var state = []

function getBoardState() {
    const squares = window.document.querySelectorAll('td');
    for (let i = 0; i < 9; i++) {
      state.push(squares[i].innerHTML)
    }
    return state
}

function checkWinner(){
  var current = getBoardState()

  for (const of WIN_COMBINATIONS) {

  }

  WIN_COMBINATIONS. do |combo|
     combo.all?{|space| board.cells[space] == "X"} || combo.all?{|space| board.cells[space] == "O"}
   end

}
