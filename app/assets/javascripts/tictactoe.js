// Code your JavaScript / jQuery solution here
var turn = 0
//var squares = window.document.querySelectorAll('td')
var spaces = null

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
  if (square.innerHTML === '') {
    turn += 1
    square.innerHTML = move
  }
}
function setMessage(message) {
  $("#message").text(message)
}

function checkWinner() {
var winningCombinations =[ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ]
var status = false
winningCombinations.forEach(function(winIndex) {
  //debugger;
  if ((spaces[winIndex[0]].innerHTML === "X" && spaces[winIndex[1]].innerHTML === "X" && spaces[winIndex[2]].innerHTML === "X") ||
  (spaces[winIndex[0]].innerHTML === "O" && spaces[winIndex[1]].innerHTML === "O" && spaces[winIndex[2]].innerHTML === "O")) {
    status = true
    setMessage(`Player ${spaces[winIndex[0]].innerHTML} Won!`)
  }

})

return status
}
function clearBoard() {
  turn = 0;
  spaces.forEach(function(square){
    square.innerHTML = ''
  })
  //attachListeners()
}

function doTurn(element) {
  //setMessage('');
  updateState(element);
  //turn += 1
  if (checkWinner()) {
    clearBoard();
  } else if (turn === 9) {
    setMessage('Tie game.')
    clearBoard();
  } else {

  }
}
$(document).ready(function() {
  attachListeners()
  spaces = window.document.querySelectorAll('td')
}

  )
function attachListeners() {
  //$('td').forEach(function(square){
    $('td').on('click', function(e) {
      doTurn(this);
      //$(this).off();
    })
    $('#save').on('click', function(e) {
      save();
    })
    $('#previous').on('click', function(e) {
      previous();
    })
}

function save() {
  array = Array.prototype.map.call(spaces, function(square) {
    return square.innerHTML })
  game = $.post('/games', {state: array})
  clearBoard();
}

function previous() {
  //debugger;
  $.get('/games', {}, function(games) {
    //debugger;
    var buttons = games.data.map(function(game){
      return `<li><button id=${game.id}>${game.id}</button></li>` }).join("")
      //debugger;
    $("#games").html(`<ul> ${buttons} </ul>`)

    //return games
  })
  //$('#previous').off();
}
