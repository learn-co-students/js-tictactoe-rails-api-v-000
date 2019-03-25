// Code your JavaScript / jQuery solution here
$(document).ready(function(){
  attachListeners()
})

let currentGame = 0;

let board = Array.from(document.querySelectorAll("td")).map(td => td.innerHTML)

function player() {
  if (this.turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(element) {
  element.append(player())
}

function setMessage(string) {
  document.getElementById("message").innerHTML = string
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
    [6, 4, 2],
  ]

  var winner = false

  const tds = $("td")

  winCombinations.forEach(function(combo) {
    if (tds[combo[0]].innerHTML !== "" && tds[combo[0]].innerHTML === tds[combo[1]].innerHTML && tds[combo[1]].innerHTML === tds[combo[2]].innerHTML) {
      setMessage(`Player ${ tds[combo[0]].innerHTML } Won!`)
      winner = true
      saveGame()
    }
  });

  return winner
}

function resetBoard() {
  turn = 0;
  currentGame = 0;
  document.querySelectorAll("td").forEach( function(td) {
    td.innerHTML = ""
  });
}

function doTurn(element) {
  updateState(element)
  turn++
  if (checkWinner()) {
    resetBoard()
  } else if (turn === 9) {
    setMessage("Tie game.")
    resetBoard()
    saveGame()
  }
}

function saveGame() {
  if (!!currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: {state:board}
    })
  } else {
    $.post('/games', {state:board}, function(data) {
      currentGame = data.data.id
    })
  }
}

function displayGame(id) {
  $.get(`/games/${id}`, function(data) {
    state = data.data.attributes.state
    $("td")[0].innerHTML = state[0]
    $("td")[1].innerHTML = state[1]
    $("td")[2].innerHTML = state[2]
    $("td")[3].innerHTML = state[3]
    $("td")[4].innerHTML = state[4]
    $("td")[5].innerHTML = state[5]
    $("td")[6].innerHTML = state[6]
    $("td")[7].innerHTML = state[7]
    $("td")[8].innerHTML = state[8]
    debugger
    currentGame = id
    turn = state.join('').length;
  })
}

function previousGame() {
  $.get("/games", function(data) {
      if (!!data.data) {
        var buttons = ``
        data.data.forEach(function(game) {
        btn = `<button style="display: block;" type="button" class="previous-game" onclick="displayGame(${game.id})" data-id="${game.id}">Game ${game.id}</button>`
        buttons += btn + `\n`
      })
      $("div#games").html(buttons)
    }
  })
}

function clearGame() {
  resetBoard()
}

function attachListeners() {
  $("td").on("click", function() {
    if (this.innerHTML == "" && !checkWinner()) {
      doTurn(this)
    }
  })
  $("button#save").on("click", () => saveGame())
  // array.find(e => e.className === `${gameid}`)
  $("button#previous").on("click", () => previousGame())
  $("button#clear").on("click", () => clearGame())
}
