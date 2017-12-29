// Code your JavaScript / jQuery solution here
const WINNERS = new Set().add([0,1,2]).add([3,4,5]).add([6,7,8]).add([0,3,6]).add([1,4,7]).add([2,5,8]).add([0,4,8]).add([2,4,6])

var turn = 0

function player(){
  if (turn % 2 === 0){
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(square){
  $(square).text(player())
}

function setMessage(msg){
  $('#message').text(msg)
}

function checkWinner(){
  let won = false

  let currBoard = []
  for (let i = 0; i < 9; i++) {
    currBoard.push($('td')[i].innerHTML)
  }

  WINNERS.forEach((combo) => {
      if(currBoard[combo[0]]==='X' && currBoard[combo[1]]==='X' && currBoard[combo[2]] === 'X'){
        setMessage('Player X Won!')
        won = true
      }

      if(currBoard[combo[0]]==='O' && currBoard[combo[1]]==='O' && currBoard[combo[2]] === 'O'){
        setMessage('Player O Won!')
        won = true
      }
    })
  return won
}

function resetBoard(){
  for (let i = 0; i < 9; i++) {
    $('td')[i].innerHTML = ""
  }
}

function doTurn(square){
  turnsUp = turn > 9
  if (!turnsUp){
    updateState(square)
    turn++
    won = checkWinner()
    if (won) {
      resetBoard()
      turn = 0
    }
  }
  setMessage('Tie game.')
}