var game
var turn = 0
const message = $('#message')
const save = $('#save')
const previous = $('#previous')
const clear = $('#clear')
const td = $('td')
const gDiv = $('#games')

const combos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

class Game {
  constructor(id, state) {
    this.id = id
    this.state = state
  }
}

window.onload = attachListeners

function attachListeners() {
  save.on('click', saveGame)
  previous.on('click', previousGames)
  clear.on('click', clearGame)
  td.on('click', function () {
    if (!this.innerText && !checkWinner()) doTurn(this)
  })
}

function saveGame() {
  game ? updateGame() : createGame()
}

function updateGame() {
  $.ajax({
    type: 'PATCH',
    url: `/games/${game.id}`,
    data: {
      state: boardData()
    }
  })
}

function createGame() {
  const val = {
    state: boardData()
  }

  let resp = $.post('/games', val)
  resp.done(data => {
    const newID = data.data.id
    const newState = data.data.attributes.state
    game = new Game(newID, newState)
  })
}

function previousGames() {
  let resp = $.get('/games')
  resp.done(data => {
    const d = data.data
    if (d.length > 0) {
      const div = gDiv[0]
      div.innerHTML = '<h4>Previous Games</h4>'
      d.forEach(g => {
        div.innerHTML += `<button>Game ${g.id}</button>`
      })
    }
  })
}

function clearGame() {
  td.toArray().forEach(square => {
    square.innerText = ''
  })
  turn = 0
  game = null
}

function boardData() {
  return td.toArray().map(square => {
    // console.log(square)
    return square.innerText
  })
}

function player() {
  return (turn % 2 == 0) ? 'X' : 'O'
}

function updateState(square) {
  square.innerText = player()
}

function setMessage(text) {
  message.text(text)
}

function checkWinner() {
  const board = boardData()
  let winner = ''
  const result = combos.some(combo => {
    let a = board[combo[0]]
    let b = board[combo[1]]
    let c = board[combo[2]]
    winner = a
    return (a == b) && (b == c) && (a != '')
  })
  if (result) setMessage(`Player ${winner} Won!`)
  return result
}

function doTurn(square) {
  updateState(square)
  const isWinner = checkWinner()
  const full = boardData().every(value => value != '')
  turn += 1
  if (turn == 9 || isWinner) {
    if (!isWinner) setMessage('Tie game.')
    saveGame()
    clearGame()
  }
}
