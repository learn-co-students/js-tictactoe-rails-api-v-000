// let turn = 0
var gameId = 0

$(function() {
  attachListeners()
});

function player() {
  if (isNaN(turn) || turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(square) {
  square.innerHTML = player()
}

function setMessage(string) {
  $('#message').html(string)
}

function checkWinner() {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const allTds = Array.from($('td'))
  const allTdValues = allTds.map(element => element.innerHTML)

  var boolean = winCombinations.some(function(winCombination) {
      const winIndex1 = winCombination[0]
      const winIndex2 = winCombination[1]
      const winIndex3 = winCombination[2]

      const position1 = allTdValues[winIndex1]
      const position2 = allTdValues[winIndex2]
      const position3 = allTdValues[winIndex3]

      if(position1 === "X" && position2 === "X" && position3 === "X") {
        setMessage("Player X Won!")
        return true
      } else if (position1 === "O" && position2 === "O" && position3 === "O") {
        setMessage("Player O Won!")
        return true
      } else {
        return false
      }
    })

  return boolean
}

function doTurn(square) {
  const preUpdateWinner = checkWinner()

  if (!preUpdateWinner) {
    updateState(square)

    turn += 1
    const aWinner = checkWinner()

    if(aWinner) {
      saveGame()
      clearGame()
    } else if (turn === 9) {
      saveGame()
      setMessage("Tie game.")
      clearGame()
    }
  }
}

function attachListeners() {
  const tds = $('td')

  for (var i = 0; i < tds.length; i++) {
    tds[i].addEventListener("click", function(e) {
      if (!e.currentTarget.innerText) {
        doTurn(e.currentTarget)
      }
    });
  }

  $('#save').on("click", function() {
    saveGame()
  })

  $('#previous').on("click", function() {
    previousGames()
  })

  $('#clear').on("click", function() {
    clearGame()
  })

}

function previousGames() {
  $.get('/games', function(games){
      const gameIds = games.data.map(game => `<button data-id=${game.id} onclick="getGame(${game.id})">Game ${game.id}</button><br>`)
      $('#games').html(gameIds)
    })
}

function getGame(id) {
  $.get(`/games/${id}`, function(game){
    const state = game.data.attributes.state
    const tds = Array.from($('td'))

    for(let i = 0; i < state.length; i++) {
    	tds[i].innerHTML = state[i]
    }

    turn = state.filter(element => element !== "").length
    gameId = id
  })
}



function saveGame() {
  const state = Array.from($('td')).map(s => s.innerHTML)

  if(gameId) {
    $.ajax({
      url: `/games/${gameId}`,
      type: 'patch',
      data: {state: state}
    })
  } else {
    $.post('/games', { state: state }, function(game) {
      gameId = game.data.id
    })
  }

}

function clearGame() {
  document.querySelectorAll('td').forEach(element => {
    element.innerHTML = ''
  })
  gameId = 0
  turn = 0
}
