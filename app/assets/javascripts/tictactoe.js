var turn = 0
const win_combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

function getBoard(){
  return $("td").toArray().map((e) => {return e.innerHTML})
}

function player(){
  if(turn % 2 === 0){
    return "X"
  } else {
    return "O"
  }
}

function updateState(element){
  element.innerHTML += player();
}

function setMessage(string){
  $('div#message')[0].innerHTML += string
}

function checkWinner(){
  let board = getBoard()

  for(c of win_combos){
    if (board[c[0]] === "X" && board[c[1]] === "X" && board[c[2]] === "X" ) {
    setMessage('Player X Won!')
    return true
  } else if (board[c[0]] === "O" && board[c[1]] === "O" && board[c[2]] === "O" ){
    setMessage('Player O Won!')
    return true
  }
} return false
}

function doTurn(){
  var board = getBoard()

  if (checkWinner() === false && turn <= 9){
    turn += 1
    updateState(player())
  }
}

function attachListeners(){

  doTurn()
  updateState()
  checkWinner()
}

$(document).ready(function(){
  attachListeners()
})
