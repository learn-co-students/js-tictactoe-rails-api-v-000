// Code your JavaScript / jQuery solution here
WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
var turn = 0
var currentGame = 0
 $(function() {
  attachListeners();
})
 function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}
 function board() {
  let board = []
  for (el of $('td')) {
    board.push(el.innerHTML)
  }
  return board
}
 function endGame() {
  if (checkWinner() || turn === 9) {
    return true;
  }
}
 function updateState(square) {
  let token = player();
  $(square).text(token);
}
 function setMessage(string) {
  $('#message').text(string);
}
 function checkWinner() {
let winner = false
let current = board()
 WINNING_COMBOS.some(function(combo) {
  if (current[combo[0]] !== "" && current[combo[0]] === current[combo[1]] && current[combo[1]] === current[combo[2]]) {
    setMessage(`Player ${current[combo[0]]} Won!`)
    winner = true;
  }
})
  return winner
}
 function doTurn(square) {
  updateState(square)
  turn++
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}
 function saveGame() {
  let state = {state: board()}
  let gameData = {state: state}
   if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    })
  } else {
      $.post('/games', gameData, function(game) {
        currentGame = game.data.id
        $('#games').append(`<p>${currentGame}</p>`)
    })
  }
}
 function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}
 function attachListeners() {
  $('td').on('click', function() {
    if(!$.text(this) && !endGame()) {
      doTurn(this)
    }
  })
   $('#save').on('click', () => saveGame())
  $('#previous').on('click', () => retrieveGames())
  $('#clear').on('click', () => resetBoard())
}
 function retrieveGames() {
  $.get('/games', function(game) {
  $('#games').empty()
  let games = game.data
  games.forEach((el) => $('#games').append(`<button id="${el.id}" onclick="loadGame(${el.id})">game: ${el.id}</button><br>`))
  })
}
 function loadGame(gameId) {
 $.get(`/games/${gameId}`, function(game) {
   currentGame = game.data.id
   let board = game.data.attributes.state
   turn = board.join("").length
   let i = 0
   board.forEach( (el) => {$('td')[i].innerHTML = el, i++})
 })
}
