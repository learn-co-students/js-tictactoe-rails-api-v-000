// $(function() {
//   attachListeners();
// })

var turn = 0
const winningCombos = [ //these combos are for x, y coordinates in the readme - there may be a better way
  [[0,0],[1,0],[2,0]], //this is the combo for the top row - 0, 0 = top left; 1, 0 = top center; 2, 0 = top right 
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]], 
  [[0,0],[1,1],[2,2]], 
  [[0,0],[0,1],[0,2]], 
  [[2,0],[2,1],[2,2]], 
  [[1,0],[1,1],[1,2]], 
  [[2,0],[1,1],[0,2]]
  ]


//GAME FUNCTIONALITY

function attachListeners() {
  $('td').on('click', function(e) {
    e.PreventDefault();
    doTurn(e)
  })
}

function doTurn(e) {
  turn += 1
  updateState(e)
  checkWinner()
}

function player() {
  return (turn % 2 === 0) ? "X" : "O"; //if no remainder then x 
}

function updateState(e) { //I changed it to "e" to follow the convention from doTurn()
  var player = player() //calls player() and captures return value
  $(e.target).html(player) //inserts the value of var player in the location of the clicked target
}

function checkWinner() { //I started building this - not sure it's on the right track yet
  winningCombos.forEach(function(combo) { //iterates over Combos array
    if (winner(combo) == true) { //checks combo against function 
      message("Player " + player() + " Won!") //calls message() based on current player
    }
  })
}

function message() {

}

var winner = function() {
  //this method can be used to check against checkWinner
}