const win_combos = = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

function player() {
  return (window.turn % 2) === 0 ? 'X' : 'O'
}

function updateState($td) {
  const playerToken = window.player()
  // cannot user innerText bc tests
  $td.innerHTML = playerToken
}

function setMessage(message) {
  document.getElementById('message').innerHTML = message
}

function checkWinner() {
  // const $grid = document.querySelectorAll('[data-x]')
  // const grid = Array.from($grid).map($square => $square.innerHTML)
  //
  // for (let i = 0; i <= 6 ; i = i + 3 ) {
  //   if ((grid[i] === grid[i + 1] === grid[i + 2])
  //       && (grid[i] !== "")) {
  //     return true
  //   }
  // }

}

function doTurn() {

}

function attachListeners() {

}

function checkLine() {

}
