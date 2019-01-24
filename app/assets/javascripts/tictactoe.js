let gameId
let turn = 0

function init() {
  attachListeners()
}
// In order for the js to run in the browser
// functions that rely on the DOM must be deferred until
// the DOM is fully ready.
// The browser will call window.onload().
window.onload = init

function player() {
  return (turn % 2 === 0) ? "X" : "O";
}

function updateState(spot) {
  $(spot).text(player());
}

function setMessage(message) {
  document.getElementById("message").innerHTML = message;
}

function checkWinner() {
  let game = false
  const $grid = document.querySelectorAll("td");
  const board = Array.from($grid).map($square => $square.innerHTML);

  const win_combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  win_combos.forEach(function(combo) {
    if (
      board[combo[0]] === board[combo[1]] &&
      board[combo[1]] === board[combo[2]] &&
      board[combo[0]] !== ""
    ) {
      setMessage(`Player ${board[combo[0]]} Won!`)
      game = true
    }
  })
  return game
}

function doTurn(spot) {
  turn++
  updateState(spot)

  if (checkWinner()) {
    checkWinner()
    resetGame()
  } else if (turn === 9) {
    setMessage('Tie game.')
  }
}

function attachListeners() {
  $('td').on('click', function () {
    if (!$.text(this) && checkWinner() !== true) {
      doTurn(this)
    }
  })

  const saveButton = document.querySelector('#save')
  const previousButton = document.querySelector('#previous')
  const clearButton = document.querySelector('#clear')

  saveButton.addEventListener('click', saveGame)
  previousButton.addEventListener('click', previousGame)
  clearButton.addEventListener('click', resetGame)
}

function resetGame() {
  if (gameId) {
    $.ajax({
      type: "DELETE",
      url: `/games/#{gameId}`
    })
  }
  const $grid = document.querySelectorAll("td");
  const board = Array.from($grid).map($square => $square.innerHTML = "");
  turn = 0
}

function saveGame() {
  const $grid = document.querySelectorAll("td")
  const board = Array.from($grid).map($square => $square.innerHTML)
  if (gameId === undefined) {
    $.ajax({
      type: "POST",
      url: "/games",
      data: board
    })
    .done(function (response) {
      gameId = response.data.id
    })
  } else {
    $.ajax({
      type: "PATCH",
      url: `/games/#{gameId}`,
      data: board
    })
  }
}

function previousGames() {
  $.ajax({
    type: "GET",
    url: "/games",
  }).done(function (resp) {
    const games = resp["data"]
    games.forEach(g => $("#games").append(`<li> ${g.id} </li>`))
  })
}
