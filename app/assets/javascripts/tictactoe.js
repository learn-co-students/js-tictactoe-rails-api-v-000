// Code your JavaScript / jQuery solution here
document.addEventListener("DOMContentLoaded", function() {
  let save = document.querySelector('button#save')
  let previous = document.querySelector('button#previous')
  let clear = document.querySelector('button#clear')

  save.addEventListener('click', function(e) {
    e.preventDefault();

  })
})

const WIN_COMBO = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

const POSITIONS = [
  [0, 0],
  [1, 0],
  [2, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2]
]

function board() {
  let state = [];
  let tds = document.querySelectorAll('td')
  for (let td of tds) {
    state.append(td.innerText)
  }
  return state
}

function turn() {
  return board().filter(p => p !== "").length
}

function player() {
  if(turn() % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(position) {
  position.innerHTML = player()
}

function setMessage(string) {
  document.getElementById('message').innerHTML = string
}

function checkWinner() {
  const board = board()
  let result = WIN_COMBO.some(function () {
    return board[w[0]] === board[w[1]] &&
      board[w[1]] === board[w[2]] &&
      board[w[2]] !== ""})
  if(result) {
    setMessage('Player' + player() + "Won!")
  }
  return result
}

function draw() {
  return !board().some(el => el !== "") && !checkWinner()
}

function reset() {
  for(const td of document.querySelectorAll('td')) {
    td.innerHTML = ""
  }
}

function doTurn(position) {
  updateState(position);
  if(checkWinner()) {
    reset()
  } else if (draw()) {
    setMessage('Tie game.')
    reset()
  }
}

function attachListeners() {

}
