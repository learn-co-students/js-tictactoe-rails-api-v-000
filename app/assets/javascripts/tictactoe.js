var turn = 0
var gameID = 0
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

var player = () => {return (turn % 2 == 0)? "X" : "O"}

var attachListeners = () => {
  $('td').click(e => {
    doTurn(e)
  })

  $('#previous').click(() => {
    $.get('/games', resp => {
      $('#games').empty()
      $.each(resp.games, (idx, val) => {
        $('#games').append("<li class='game' id=" + val["id"] +"> Game: "+ val["id"] + "</li>")
      })
      attachGameListener()
    })
  })

  $('#save').click(() => { resetBoard() })
}

var attachGameListener = () => {
  $('.game').click(e => {
    var id = parseInt(e.currentTarget.id)
    var $get = $.get('/games/' + id)
    $get.done(data => {
      gameID = data.id
      turn = data.turn
      $.each($('td'), (idx, val) => {
        val.innerText = data.state[idx]
      })
    })
  })
}

var doTurn = e => {
  if (checkWinner()) {e => {e.preventDefault}}
  if (e.currentTarget.innerText == '') {
    updateState(e)
    if (!checkWinner()) {turn++}
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

var getState = () => {
  var $state = []
  $('td').each((idx, val) => {$state.push(val.innerText)})
  return $state
}

var checkWinner = () => {
  var result = false
  var current = player()
  var $state = getState()
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
  saveGame()
  turn = 0
  gameID = 0
  $('td').each((idx, val) => {val.innerText = ''})
}

var message = (msg) => {
  $('#message').text(msg)
}

var saveGame = () => {
  if (gameID == 0) {
    let obj = {}
    obj.state = getState()
    obj.turn = turn
    $.post('/games', obj)
  } else {
    let obj = {}
    obj.state = getState()
    obj.turn = turn
    $.ajax({
      url: '/games/' + gameID,
      data: obj,
      type: 'PATCH'
    })
  }
}

$(() => {
  attachListeners()
})