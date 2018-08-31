// Code your JavaScript / jQuery solution here
// $( "td:contains('x')" )
let turnCount = 0
const winCombinations = [
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[2,0],[1,1],[0,2]]
]

function isEven(n) {
   return n % 2 == 0;
}

function player(){
  return isEven(turnCount) ? 'X' : 'O'
}

function updateState(element){
  $(element).html(player())
}

function setMessage(player){
  $('#message').html(`Player ${player} Won!`)
}

function checkWinner(){
  let winner = ""
  let winningCombo = winCombinations.find( combo => {
    const value1 = $(`td[data-x='${combo[0][0]}'][data-y='${combo[0][1]}']`).html()
    const value2 = $(`td[data-x='${combo[1][0]}'][data-y='${combo[1][1]}']`).html()
    const value3 = $(`td[data-x='${combo[2][0]}'][data-y='${combo[2][1]}']`).html()
    winner = value1
    return value1 !== "" && value1 === value2 && value2 === value3
  })
    if (winningCombo) {
      setMessage(winner)
      return true
    } else {
      return false
    }
}
