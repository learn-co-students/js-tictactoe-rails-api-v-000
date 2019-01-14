// Code your JavaScript / jQuery solution here

const WIN_COMBINATIONS = [
  [0, 1, 2], 
  [3, 4, 5], 
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

var turn = 0
// if turn modulus 2 = 0, that means it will be falsey, and therefore returns the right side (X), and any odd number % 2 = 1, so it would be truthy, and then return the left side (O)
var player = () => turn % 2 == 0 ? "X" : "O" 



var updateState = (square) => {
  var token = player();
  $(square).text(token);
}

let doTurn = () => turn++
function setMessage(string) {
  $("#message").text(string)
  // string = 'Player X Won!'
  // $("#message").innerHTML = string
}

function checkWinner() {
  let td = []
  let winner = false

  $("td").text(function (index, text) { td.push(text) })

  WIN_COMBINATIONS.forEach(function (combo) {
    if( td[combo[0]] == td[combo[1]] &&
      td[combo[1]] == td[combo[2]] &&
      td[combo[0]] != ""){
      var winnerToken = td[combo[0]]
      winner = true;
      setMessage(`Player ${winnerToken} Won!`)
    }
  }) ;
  
  return winner;
}