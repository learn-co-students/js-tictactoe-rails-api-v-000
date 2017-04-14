var turn = 0
var currentGame = 0
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

const player = () => {
  return (turn % 2 == 0)? 'X' : 'O'
}

const attachListeners = () => {
  $('td').click(function (e) {
    doTurn(e)
  })
} 

const doTurn = e => {
  updateState(e)
  checkWinner()
  turn++
}

const updateState = e => {
  return e.currentTarget.innerText = player()
}

const checkWinner = () => {
  debugger
}

$(() => {
  attachListeners()
})