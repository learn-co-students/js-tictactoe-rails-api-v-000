  window.turn = 0;
  const squares = $('td')
  let currentGame = 0;

  function player() {
    return window.turn % 2 === 0 ? "X" : "O"
  }

  function updateState(cell) {
    cell.innerHTML = player()
  }

  function setMessage(string) {
    $('div#message').append(string)
  }

  function checkWinner() {
    let win_combos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6] 
    ]

    const squares = $('td')

    let win = false;

    win_combos.forEach(function(win_combo){
      let checkX = win_combo.filter(function(cell){
        return squares[cell].innerHTML === 'X'
      })
      let checkO = win_combo.filter(function (cell) {
        return squares[cell].innerHTML === 'O'
      })
      if (checkX.length === 3 ) {
        win = true;
        let message = `Player X Won!`
        setMessage(message)
        save()
      } else if (checkO.length === 3 ) {
        win = true;
        let message = `Player O Won!`
        setMessage(message)
        save()
      }
    })
    return win
  }

  function doTurn(cell) {
    if (cell.innerHTML === '' && !checkWinner()) {
      updateState(cell)
      if (checkWinner()) {
        resetGame()
      } else if (window.turn === 8) {
        setMessage("Tie game.")
        save()
        resetGame()
      } else {
      ++window.turn
      }
    }
  }


  function resetGame() {
    window.turn = 0;
    const squares = $('td')
    currentGame = 0;
    for (let i = 0; i < 9; i++) {
      squares[i].innerHTML = '';
    }
    setMessage('')
  }


  function attachListeners(cell) {
    doTurn(cell.target)
  }

$(function () {
  $('td').click(function(e){
    attachListeners(e)
  })

  $('button#save').click(function() {
    save()
  })

  $('button#previous').click(function() {
    previous()
  })

  $('button#clear').click(function () {
    clear()
  })

})

function save() {
  let stateArray = Array.from($('td')).map(cell => cell.innerHTML)
  if (!!currentGame) {
    $.ajax('/games/' + currentGame, {
      method: 'PATCH',
      data: {state: stateArray}
    })
  } else {
    let posting = $.post('/games', { id: currentGame, state: stateArray })
    posting.done(function(response) {
      currentGame =  parseInt(response["data"]["id"])
    })
  }
}

function previous() {
  let post = $.get('/games', {}, function(response){
    response["data"].forEach(function(game){
      if (!$(`button#gameid-${game.id}`).length){
        $("#games").append(`<button id="gameid-${game.id}">"${game.id}</button><br>`)
        $(`#gameid-${game.id}`).on('click', function () {
          loadGame(game.id)
        })
      }
    })
  })
}

function loadGame(id) {
  $.get('/games/' + id, {}, function(response){
    let loadState = response["data"]["attributes"]["state"]
    window.turn = 9 - loadState.filter(cell => cell === '').length
    currentGame = parseInt(response["data"]["id"])
    const squares = $('td')
    for (let i = 0; i < 9; i++) {
      squares[i].innerHTML = loadState[i]
    }

    setMessage('')
  })
  
}

function clear() {
  resetGame()
}