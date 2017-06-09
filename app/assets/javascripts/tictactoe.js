var turn = 0
var currentGame = 0

const winningCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
]

var player = () => {
  return (turn % 2 == 0)? 'X' : 'O'
}

var attachListeners = () => {
  $('td').click(function(e) {
    doTurn(e)
  })
}

var doTurn = e => {
  if (e.currentTarget.innerText == '') {
    updateState(e)
    checkWinner()
    turn += 1
    if (turn === 9){
      message('Tie game')
      saveGame()
      resetBoard()
    }
  }
  else {
    message('This cell is taken')
  }
}

var updateState = e => {
  return e.currentTarget.innerText = player()
}

var getState = () => {
  var $state = []
  $('td').each((index, value) => {$state.push(value.innerText)})
  return $state
}

var checkWinner = () => {
  var result = false
  var current = player()
  var $state = getState()
  $.each(winningCombos, (index, value) => {
    if ($state[value[0]] == current && $state[value[1]] == current && $state[value[2]] == current) {
      let winner = $state[value[0]]
      message('Player ' + winner + ' Won!')
      resetBoard()
      result = true
    }
  })
  return result
}

var saveGame = () => {
  let game = {}
  game.state = getState()
  // post ('/games', $gameState
  // let post = $.post('/games, game')
  $.ajax({
    url: '/games', data: game, type: 'post'
  })
}

var resetBoard = () => {
  saveGame()
  turn = 0
  currentGame = 0
  $('td').each((index, value) => {value.innerText = ''})
}

var message = (message) => {
  $('#message').text(message)
}

$(() => {
  attachListeners()
})
