var game
var turn = 0

class Game {
  constructor(id, state) {
    this.id = id
    this.state = state
  }
}

window.onload = () => attachListeners()

function attachListeners() {
  const save = $('#save')
  const previous = $('#previous')
  const clear = $('#clear')

  save.on('click', saveGame)
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

  let r = $.post('/games', val)
  r.done(data => {
    const newID = data.data.id
    const newState = data.data.attributes.state
    game = new Game(newID, newState)
  })
}

function boardData() {
  return $('td').toArray().map(square => {
    // console.log(square)
    return square.innerText
  })
}

function player() {
  return (turn % 2 == 0) ? 'X' : 'O'
}