var turn = 0
var currentGame = 0
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

var player = () => {return (turn % 2 == 0)? 'X' : 'O'}

var attachListeners = () => {
  $('td').click(function (e) {
    doTurn(e)
  })
} 

var doTurn = e => {
  if (e.currentTarget.innerText == '') {
    updateState(e)
    checkWinner()
    turn++
    if (turn === 9) {
      message('Tie game')
      resetBoard()
    }
  } else {
    message('That cell is already taken')
  }
}

var updateState = e => {
  return e.currentTarget.innerText = player()
}

var checkWinner = () => {
  var $state = []
  var result = false
  var current = player()
  $('td').each((idx, val) => {$state.push(val.innerText)})
  $.each(winCombos, (idx, val) => {
     if ($state[val[0]] == current && $state[val[1]] == current && $state[val[2]] == current) {
       let winner = $state[val[0]]
       message('Player ' + winner + ' Won!')
       result = true
       resetBoard()
    }
  })
  return result
}

var resetBoard = () => {
  turn = 0
  currentGame = 0
  $('td').each((idx, val) => {val.innerText = ''})
}

var message = (msg) => {
  $('#message').text(msg)
}

$(() => {
  attachListeners()
})