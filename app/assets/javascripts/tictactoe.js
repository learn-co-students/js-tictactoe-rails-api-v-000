// Code your JavaScript / jQuery solution here
var turn = 0
squares = window.document.querySelectorAll('td')
function player() {
  // squares.forEach (function(square) {
  //   if (square.innerHTML !== "") {
  //     turn += 1
  //   }
  //})
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}
function updateState(square) {
  let move = player()
  square.innerHTML = move
}
function setMessage(message) {
  $("#message").text(message)
}

function checkWinner() {
var winningCombinations =[ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ]
var status = false
winningCombinations.forEach(function(winIndex) {
  //debugger;
  // squares = window.document.querySelectorAll('td')
  if ((squares[winIndex[0]].innerHTML === "X" && squares[winIndex[1]].innerHTML === "X" && squares[winIndex[2]].innerHTML === "X") ||
  (squares[winIndex[0]].innerHTML === "O" && squares[winIndex[1]].innerHTML === "O" && squares[winIndex[2]].innerHTML === "O")) {
    status = true
    setMessage(`Player ${squares[winIndex[0]].innerHTML} Won!`)
  }

})

return status
}
function clearBoard() {
  turn = 0;
  squares.forEach(function(square){
    square.innerHTML = ''
  })
  //attachListeners()
}

function doTurn(element) {
  updateState(element);
  turn += 1
  if (checkWinner()) {
    clearBoard();
  } else if (turn === 9) {
    setMessage('Tie game.')
  } else {

  }
}
$(document).ready(function() {
  attachListeners()
}

  )
function attachListeners() {
  //$('td').forEach(function(square){
    $('td').on('click', function(e) {
      doTurn(this);
      $(this).off();
    })
    $('#save').on('click', function(e) {
      save();
    })
    $('#previous').on('click', function(e) {
      previous();
    })
}

function save() {
  array = Array.prototype.map.call(squares, function(square) {
    return square.innerHTML })
  game = $.post('/games', {state: array})
  clearBoard();
}

function previous() {
  $('#games').append('<ul></ul>')
  //debugger;
  $.get('/games', function(data) {
    //debugger;
    data.data.forEach(function(game){
      $("#games ul").append(`<li>${game.id}</li>`)
    })
  })
}
