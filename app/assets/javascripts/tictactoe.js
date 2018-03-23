var turn = 0
var gameId = 0
const winningCombo = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

$(document).ready(function() {
  attachListeners();

  $('#games').on('click', '.previous-game', function () {
    loadGame(this);
  })
});

function attachListeners() {
  // document.querySelectorAll('td').forEach((td) => {
  //   td.addEventListener('click', (el) => {
  //     if (el.target.innerText === "" && !checkWinner()) {
  //       doTurn(el.target)
  //     }
  //   })
  // })

  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  document.getElementById('save').addEventListener('click', () => saveGame())
  document.getElementById('previous').addEventListener('click', () => previousGame())
  document.getElementById('clear').addEventListener('click', () => clearGame())
}

function player() {
  return (turn % 2 === 0) ? 'X' : 'O'
}

function doTurn(square) {
  // if (updateState(square)) {
  updateState(square)
  turn++
  if (checkWinner()) {
    saveGame()
    clearGame()
  }
  // }
}

function updateState(square) {
  // if(!checkWinner()) {
    // if (square.innerHTML === "") {
      square.innerHTML = player()
      // return true
    // } else {
      // setMessage("You can't play here!")
      // return false
    // }
  // }
}

function setMessage(message) {
  document.getElementById('message').innerHTML = message;
}

function getState(currentPlayer = false) {
  let currentState = {"X": [], "O": []}
  let currentBoard = []

  document.querySelectorAll('td').forEach((squared, i) => {
    if (!currentPlayer) {
      return currentBoard.push(squared.innerText)
    } else {
      // return an array of index of both player
      if (squared.innerText === "X") {
        return currentState["X"].push(i)
      }
      if (squared.innerText === "O") {
        return currentState["O"].push(i)
      }
    }
  })

  if (currentPlayer) {
    return currentState
  }

  return currentBoard
}

function checkWinner() {
  // let currentPlayerState = getState(true)
  // let winner = false
  //
  // for (const key in currentPlayerState) {
  //   winningCombo.forEach( (arr) => {
  //     if (arr.every((r) => currentPlayerState[key].indexOf(r) >= 0)) {
  //       setMessage("Player " + key + " Won!")
  //       return winner = true
  //     }
  //   })
  // }

  let board = {};
  let winner = false;

  $('td').text((index, square) => board[index] = square);

  winningCombo.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  if (turn === 9) {
    setMessage("Tie game.")
    winner = true
  }

  return winner
}

function saveGame() {
  let values = {state: getState()}

  if (gameId !== 0) {
    $.ajax({ type: 'PATCH', url: '/games/' + gameId, data: values });
  } else {
    $.post('/games', values).done((game) => {
      gameId = game.data.id
    })
  }

}

function previousGame() {
  document.getElementById('games').innerHTML = ''
  $.getJSON('/games').done((games) => {
    if(games.data.length) {
      console.log(games)
      games.data.forEach((game) => {
        document.getElementById('games').innerHTML += `<button type="button" class="previous-game" data-id="${game.id}">Game ${game.id}</button><br>`
      })
    }
  })
}

function loadGame(e) {
  $.getJSON('/games/' + $(e).attr('data-id')).done((game) => {
    console.log(game)
    gameId = game.data.id
    let state = game.data.attributes.state;

    document.querySelectorAll('td').forEach((td, i) => {
      td.innerHTML = state[i]
    })
    turn = state.join('').length
    document.getElementById('games').innerHTML = ''
    checkWinner()
  })
}

function clearGame() {
  gameId = 0
  turn = 0
  document.querySelectorAll('td').forEach((td) => { td.innerHTML = '' })
}
