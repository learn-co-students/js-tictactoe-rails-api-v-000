const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

let turn = 1
let currentGame = null

$(function() {
  attachListeners()
})

function player(){
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(space){
  // Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.
  space.innerText = player()
}

function setMessage(message){
  // Accepts a string and adds it to the div#message element in the DOM.
  $('#message').append(message)
}

function checkWinner(){
  // Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
  // If there is a winning combination on the board, checkWinner() should invoke setMessage(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'
  let winner = false
  let board = $('table td')
  WINNING_COMBOS.forEach(function(combo) {
    if (board[combo[0]].innerText !== "" &&
        board[combo[0]].innerText === board[combo[1]].innerText &&
        board[combo[1]].innerText === board[combo[2]].innerText)
      setMessage(`Player ${board[combo[0]].innerText} Won!`)
      winner = true
  })
  return winner
}

function doTurn(space){
  // Increments the turn variable by 1.
  // Invokes the updateState() function, passing it the element that was clicked.
  // Invokes checkWinner() to determine whether the move results in a winning play.
  updateState(space)
  checkWinner()
  turn += 1
}

function attachListeners(){
  // Attaches the appropriate event listeners to the squares of the game board as well as for the button#save, button#previous, and button#clear elements.
  // When a user clicks on a square on the game board, the event listener should invoke doTurn() and pass it the element that was clicked.
  $('table td').on('click', function() {
    if (this.innerText) {
      alert('Position already taken')
    } else {
      doTurn(this)
    }
  })

  $('button#save').on('click', function() {
    let tokens = []
    let gameData = $(tokens).serializeArray()

    $('table td').text(function(index, token){
      gameData.push(token)
    })

    if (currentGame) {
      $.ajax({
        method: 'PATCH',
        url: '/games/${currentGame}',
        data: gameData
      })
      .done(function() {
        alert( 'Game Saved!' );
      });
    } else {
      $.post('/games', gameData, function(game) {
        currentGame = game.data.id
        $('#games').append(`<button id="${game.data.id}">${game.data.id}</button>`)
        // add to board on click
      })
    }
  })
  $('button#previous').on('click', function() {

  })
  $('button#clear').on('click', function() {

  })
}
