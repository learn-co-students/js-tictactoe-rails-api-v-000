// // Code your JavaScript / jQuery solution here
//
// window.onload = () => {attachListeners()}
//
// var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
//
// var turn = 0
// var currentGame = 0
//
// // if turn modulus 2 = 0, it is falsey, and therefore returns right side (X). any odd number % 2 = 1, and so would be truthy, and return left side (O)
// var player = () => turn % 2 ? 'O' : 'X'
//
// function updateState(td){
//   $(td).text(player())
// }
//
// function setMessage(string) {
//   $('#message').text(string)
// }
//
// function checkWinner() {
//   var board = []
//   var winner = false
//
// // same as $('td').text((index, td) => board[index] = td);
//   $('td').text(function(index, td){
//   	board[index] = td
//   })
//
//   WINNING_COMBOS.forEach(function(combo) {
//     if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
//       setMessage("Player " + board[combo[0]] + " Won!")
//       winner = true
//     }
//   })
//   return winner
// }
//
// function doTurn() {
//   updateState($(this).context)
//   turn++
//   if (checkWinner()) {
//     resetBoard()
//   } else if (turn === 9){
//     setMessage("Tie game.")
//     resetBoard()
//   }
// }
//
// function resetBoard(){
//   turn = 0
//   $('td').empty()
// }
//
// function saveGame() {
//
// }
//
// function attachListeners () {
//   console.log('hello')
//   $(document).on('click','td', doTurn)
// }

// Code your JavaScript / jQuery solution here

// (() =>{
//   attachListeners()
// })()

window.onload = () => {attachListeners()}

var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

var turn = 0

var currentGame = 0

// if turn modulus 2 = 0, it is falsey, and therefore returns right side (X). any odd number % 2 = 1, and so would be truthy, and return left side (O)
var player = () => turn % 2 ? 'O' : 'X'

function updateState(td){
  $(td).text(player())
}

function setMessage(string) {
  $('#message').text(string)
}

function checkWinner() {
  var board = []
  var winner = false

// same as $('td').text((index, td) => board[index] = td);
  $('td').text(function(index, td){
  	board[index] = td
  })

  WINNING_COMBOS.forEach(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      // setMessage("Player " + board[combo[0]] + " Won!")
      setMessage(`Player ${board[combo[0]]} Won!`)
      winner = true
    }
  })
  return winner

  // if (!$.text(this) && winner === false) {
  //   doTurn(this)
  // }
}

function doTurn(td) {
  updateState(td)
  turn++
  if (checkWinner()) {
    resetBoard()
  } else if (turn === 9){
    setMessage("Tie game.")
    resetBoard()
  }
}

function resetBoard(){
  turn = 0
  $('td').empty()
}

function attachListeners () {
  console.log("Can you see me?")
  $('#previous').on('click', function(){
    previousGames()
  });
  $('#save').on('click', function(){
    saveGame()
  });

  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })
}

function previousGames(){
  $.get('/games', function(games){
    console.log(games.data.length)

    if (games.data.length){ //if array is not empty
      var list = $("#games").append('<ul></ul>').find('ul');
      games.data.forEach(function(game){
        list.append(`<li><button id="${game.id}">Game ${game.id}</button></li><br>`)
        $(`#${game.id}`).click(function(){
          console.log("anything happen when i click?")
        })
      })
    }
  })
}

// Clicking the button#previous element when previously-saved games exist in the database
// adds those previous games as buttons in the DOM's div#games element:


// Clicking this button should grab all of the persisted games from the database
// and create a button for each that, when clicked,
// returns that saved game's state to our tic-tac-toe board.
// All of the buttons should be added to the div#games element in the DOM.

function saveGame() {

}
