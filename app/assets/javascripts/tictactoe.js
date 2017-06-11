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

  $('#previous').click(function(e){
    getGames()
  })

  $('#save').click(function(e){
    saveGame()
  })
}

var doTurn = e => {
//if (e.currentTarget.innerText == '') {
  updateState(e)
  checkWinner()
  turn += 1
if (turn === 9){
    message('Tie game')
    saveGame()
    resetBoard()
  }
  else {
    message('This cell is taken')
  }
}
  // updateState(e)
  // if (checkWinner() || turn === 9 {
  //   saveGame()
  //   resetBoard()
  // })
  // else {turn += 1}
// }

var updateState = e => {
  $(e.target).html(player())
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
  if (currentGame == 0) {
    let obj = {}
    obj.state = getState()
    obj.turn = turn
    $.post('/games', obj)
  }
  else {
    let obj = {}
    obj.state = getState()
    obj.turn = turn
    $.ajax({url: '/games' + currentGame, data: obj, type: 'PATCH'})
  }
}

var resetBoard = () => {
  saveGame()
  $('td').html('')
  turn = 0
  currentGame = 0
}

var message = (message) => {
  $('#message').text(message)
}

$(() => {
  attachListeners()
})

// Persistence Functions

function getGames() {
  $.ajax({
    url: '/games',
    type: 'GET',
    dataType: 'json'
  }).done(function(res){
    showGames(res.games)
  })
}

function showGames(games) {
  var gamesHTML = $()
  games.forEach(function(game){
    gamesHTML = gamesHTML.add(showGame(game))
  })
  $('#games').html(gamesHTML)
}

function showGame(game){
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}
