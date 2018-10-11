// Code your JavaScript / jQuery solution here
document.addEventListener("DOMContentLoaded", function(){
  attachListeners()
})

function squares() {
  return document.querySelectorAll('td')
}

function board() {
  let state = ["", "", "", "", "", "", "", "", ""];
  squares().forEach(function(td, i) {
    state[i] = td.innerText
  })
  return state
}

function turn() {
  return board().filter(p => p !== "").length
}

function nextPlayer() {
  if(turn() % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function currentPlayer() {
  if(turn() % 2 === 0) {
    return "O"
  } else {
    return "X"
  }
}

function updateState(position) {
  if(position.innerText !== "") {
    alert("Position taken, choose another one")
  } else {
    position.innerText = nextPlayer()
  }
}

function setMessage(string) {
  document.getElementById('message').innerHTML = string
}

function checkWinner() {
  let result = WIN_COMBO.some(function (w) {
    return board()[w[0]] === board()[w[1]] &&
      board()[w[1]] === board()[w[2]] &&
      board()[w[2]] !== ""})
  if(result) {
    setMessage('Player ' + currentPlayer() + " Won!")
  }
  return result
}

function draw() {
  return !board().some(el => el !== "") && !checkWinner()
}

function reset() {
  for(const td of squares()) {
    td.innerHTML = ""
  }
}

function doTurn(position) {
  updateState(position);
  if(checkWinner()) {
    reset()
  } else if (draw()) {
    setMessage('Tie game.')
    reset()
  }
}

function attachListeners() {
  squares().forEach(function(td) {
    td.addEventListener("click", function() {
      doTurn(this)
    })
  })
}

function saveGame() {
  document.getElementById("save").addEventListener("click", function(e) {
    e.preventDefault();
    const gameID = document.querySelector('table').dataset.gameID
    gameData = JSON.stringify({state: board()})
    if(gameID === "") {
      const reqData = {method: "POST", body: gameData}
      fetch("/games", reqData).then(function(resp) {
        gameID = resp.id
      })
    } else {
      const reqData = {method: "PATCH", body: gameData}
      fetch(`/games/${gameID}`, reqData)
    }
  })
}

function previousGame() {
  document.getElementById("previous").addEventListener("click", function(e) {
    e.preventDefault();
    var gamesDiv = document.getElementById("games")
    if(gamesDiv.children.length === 0) {
      fetch("/games").then(function(games) {
        if(games.data.length !== 0) {
          games.data.forEach(function(game) {
            gamesDiv.innerHTML +=
            `<button data-id = "${game.id}">Game ${game.id}</button>`
          })
        }
      })
    } else {
      var count = document.querySelectorAll("div#games button").length

    }
  })
}

const WIN_COMBO = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

const POSITIONS = [
  [0, 0],
  [1, 0],
  [2, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2]
]
