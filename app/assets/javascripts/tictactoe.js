var turn = 0
var gameStats = null
var squares = () => window.document.querySelectorAll('td')
var getBoard = () => Array.from(squares()).map(square => square.innerHTML)

window.onload = () => {
  attachListeners()
}

var attachListeners = () => {
  Array.from(squares()).forEach(square =>
    square.addEventListener('click', e => {
      doTurn(e.target)
    })
  )

  const previousButton = window.document.getElementById('previous')
  previousButton.addEventListener('click', e => previousClick(e))

  const saveButton = window.document.getElementById('save')
  saveButton.addEventListener('click', e => {
    e.preventDefault()
    saveGame()
  })

  const clearButton = window.document.getElementById('clear')
  clearButton.addEventListener('click', e => clearClick(e))
}

var clearClick = e => {
  e.preventDefault()
  clearBoard()
}

var doTurn = element => {
  if (element.innerHTML !== '') { return }
  updateState(element)
  turn ++
  if (checkWinner() || tieGame()) { return }
}

function updateState(element) {
  element.innerHTML = player()
}

var clearBoard = () => {
  const squares = window.document.querySelectorAll('td')
  Array.from(squares).forEach(square => square.innerHTML = '')
  turn = 0
  gameStats = null
}

var loadGame = e => {
  const handleResponse = resp => {
    const { data } = JSON.parse(resp.target.responseText)
    gameStats = data
    const { state:board } = JSON.parse(resp.target.responseText).data.attributes
    const turnCount = board.filter(ele => ele !== '').length
    squares().forEach((ele, index) => ele.innerHTML = board[index])
    turn = turnCount
  }

  let request = new XMLHttpRequest()
  request.addEventListener('load', handleResponse)
  request.open('GET', '/games/' + e.target.id)
  request.send()
}

var previousClick = e => {
  e.preventDefault()

  const handleResponse = resp => {
    const { data } = JSON.parse(resp.target.responseText)
    const gamesDiv = document.getElementById('games')
    const buttons = gamesDiv.getElementsByTagName('button')

    Array.from(buttons).map(button => button.remove())

    data.forEach(item => {
      const { id } = item
      const button = document.createElement('button')
      button.id = id
      button.addEventListener('click', e => {
        loadGame(e)
      })
      gamesDiv.appendChild(button)
    })
  }


  let request = new XMLHttpRequest()
  request.addEventListener('load', handleResponse)
  request.open('GET', '/games')
  request.send()
}

function player() {
  if (turn % 2 === 0) { return 'X'}
  return 'O'
}

var setMessage = message =>
  document.getElementById('message').innerHTML = message

var WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8],
  [2, 4, 6]
]

var checkAgainstCombos = (board) => {

}

var winner = cells => {
  if (cells.filter(cell => cell === '').length > 0) { return false }
  return cells[0] === cells[1] && cells[1] === cells[2]
}

var checkWinner = () => {
  var squares = window.document.querySelectorAll('td')

  board = Array.from(squares).map(square => square.innerHTML)
  const emptyCells = board.filter(cell => cell === '')
  const boardEmpty = emptyCells.length === board.length
  if (boardEmpty) { return false }

  const winningCombo = WINNING_COMBINATIONS.find((combo, index) => {

    const n0 = combo[0]
    const n1 = combo[1]
    const n2 = combo[2]
    const cells = [board[n0], board[n1], board[n2]]
    if (winner(cells)) { return combo }
  })

  if (winningCombo) {
    setMessage(`Player ${player()} Won!`)
    saveGame()
    clearBoard()
    return true
  }

  return false
}

saveGame = () => {
  const gameBoard = getBoard()
  const handleResponse = resp => {
    const { data } = JSON.parse(resp.target.responseText)
    gameStats = data
  }

  let request = new XMLHttpRequest()
  request.addEventListener('load', handleResponse)
  if (gameStats === null) {
    request.open('POST', '/games')
    request.send(JSON.stringify({ state: gameBoard }))
  } else {
    request.open('PATCH', `/games/${gameStats.id}`)
    request.send(JSON.stringify({ state: gameBoard }))
  }
}

var tieGame = () => {
  const board = getBoard()

  const filledCells = board.filter(cell => cell !== '')
  const boardFull = filledCells.length === board.length

  const emptyCells = board.filter(cell => cell === '')
  const boardEmpty = emptyCells.length === board.length


  if (boardFull && !checkWinner() && !boardEmpty) {
    setMessage('Tie game.')
    saveGame()
    return true
  }
  return false
}
