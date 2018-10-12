// Code your JavaScript / jQuery solution here
document.addEventListener("DOMContentLoaded", function(){
  attachListeners();
  saveButton();
  previousButton();
  clearButton();
  deleteButton()
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

function player() {
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
    position.innerText = player()
  }
}

function setMessage(string) {
  document.getElementById('message').innerHTML = string
}

function checkWinner() {
  const winCombo = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ]
  let result = winCombo.some(function (w) {
    return board()[w[0]] === board()[w[1]] &&
      board()[w[1]] === board()[w[2]] &&
      board()[w[2]] !== ""})
  if(result) {
    setMessage('Player ' + currentPlayer() + " Won!")
  }
  return result
}

function draw() {
  return !board().some(el => el === "") && !checkWinner()
}

function reset() {
  for(const td of squares()) {
    td.innerHTML = ""
  }
  document.querySelector('table').setAttribute('data-gameid', "")
}

function doTurn(position) {
  updateState(position);
  if(checkWinner()) {
    saveGame();
    reset()
  } else if (draw()) {
    setMessage('Tie game.')
    saveGame();
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
  let table = document.querySelector('table')
  let gameID = table.dataset.gameid
  gameData = {state: board()}
  let reqData = {
    body: JSON.stringify(gameData),
    headers: {'Content-Type': 'application/json'}
  }
  if(gameID === "") {
    reqData.method = "POST"
    fetch("/games", reqData).then(resp => resp.json()).then(function(resp) {
      table.setAttribute('data-gameid', resp.data.id)
    })
  } else {
    reqData.method = "PATCH"
    fetch(`/games/${gameID}`, reqData).then(resp => resp.json()).then(
      alert("Game saved.")
    )
  }
}

function saveButton() {
  document.getElementById("save").addEventListener("click", function(e) {
    saveGame()
  })
}

function previousButton() {
  document.getElementById("previous").addEventListener("click", function(e) {
    var gamesDiv = document.getElementById("games")
    var gameID = parseInt(document.querySelector("table").dataset.gameid)
    var gameCount = document.querySelectorAll("div#games button").length
    if(gameCount === 0) {
      fetch("/games").then(resp => resp.json()).then(function(games) {
        if(games.data.length !== 0) {
          games.data.forEach(function(game) {
            gamesDiv.innerHTML +=
            `<button id="game-${game.id}" data-id="${game.id}">Game ${game.id}</button><br>`
          })
          getPrevGame()
        }
      })
    } else {
      if(gameCount < gameID) {
        var array = []
        for(i = gameID - gameCount; i >=0; i--) {
          array.push(gameID - i)
        }
        for(var id of array) {
          fetch("/games/" + id).then(resp => resp.json()).then(function(game) {
            gamesDiv.innerHTML +=
            `<button data-id="${game.id}">Game ${game.id}</button><br>`
          })
        }
      }
    }
  })
}

function clearButton() {
  var clearButton = document.getElementById('clear')
  clearButton.addEventListener("click", function(e) {
    reset()
    document.getElementById("message").innerHTML = ""
  })
}

function getPrevGame() {
  var games = document.querySelectorAll("div#games button")
  games.forEach(function(game) {
    game.addEventListener("click", function() {
      fetch("/games/" + this.dataset.id).then(resp => resp.json()).then(function(game) {
        squares().forEach(function(td, i) {
          td.innerText = game.data.attributes.state[i]
        })
        document.querySelector("table").setAttribute(
          'data-gameid', game.data.id)
      })
    })
  })
}

function deleteButton() {
  var deleteButton = document.getElementById("delete")
  deleteButton.addEventListener("click", function() {
    var gameID = parseInt(document.querySelector("table").dataset.gameid)
    fetch(`/games/${gameID}`, {method: "DELETE"})
    .then().then(function() {
      reset()
      document.getElementById(`game-${gameID}`).remove()
    })
  })
}
