// Code your JavaScript / jQuery solution here

const winningCombinations = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8],
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8],
   [2, 4, 6],
   [0, 4, 8]
]

var turn = 0
var currentGame = 0

$(function() {
   attachListeners()
})

function player() {
   return turn % 2 ? 'O' : 'X'
}

function updateState(element) {
   var token = player()
   $(element).text(token)
}

function setMessage(string) {
   $('#message').text(string)
}

function checkWinner() {
   var board = []
   var gameWon = false
   
   $('td').text(function(index, square) {
      board[index] = square
   })
   winningCombinations.some(function(combo) {
      if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
         setMessage(`Player ${board[combo[0]]} Won!`)
         return gameWon = true
      }
   })
   return gameWon
}

function resetBoard() {
   $('td').empty()
   turn = 0
   currentGame = 0
}

function tieGame() {
   return turn === 9
}

function doTurn(element) {
   updateState(element)
   turn++      
   if (checkWinner()) {
      saveBoard()
      resetBoard()
   } else if (tieGame()) {
      setMessage("Tie game.")
      saveBoard()         
      resetBoard()
   }
}

function reloadGame(gameID) {
   setMessage("")

   $.get(`/games/${gameID}`, function(response) {
      const id = response.data.id
      const state = response.data.attributes.state
      debugger
      let index = 0
      for (let y = 0; y < 3; y++) {
         for (let x = 0; x < 3; x++) {
            document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index]
            index++
         }
      }

      turn = state.join('').length
      currentGame = id

      if (!checkWinner() && turn === 9) {
      setMessage('Tie game.')
      }
   })
}

function buttonizeGame(game) {
   $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
   $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function saveBoard() {
   var board = []
   var gameData
 
   $('td').text((index, square) => {
      board[index] = square
   })
 
   gameData = { state: board }
 
   if (currentGame) {
      $.ajax({
         type: 'PATCH',
         url: `/games/${currentGame}`,
         data: gameData
     })
   } else {
      $.post('/games', gameData, function(game) {
         currentGame = game.data.id
         buttonizeGame(game.data)
      })
   }
}

function previousBoard() {
   $('#games').empty()
   $.get('/games', function(savedGames) {
      if (savedGames.data.length) {
         savedGames.data.forEach(game => {
            buttonizeGame(game)            
         })
      }
   })
}

function attachListeners() {
   $('td').click(function() {
      if (!$.text(this) && !checkWinner() && !tieGame()) {
         doTurn(this)
      }
   })

   $('#clear').click(resetBoard)
   $('#save').click(saveBoard)
   $('#previous').click(previousBoard)
}