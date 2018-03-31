// Code your JavaScript / jQuery solution here
var turn = 0
//var squares = window.document.querySelectorAll('td')
var spaces = null
var current = null
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
  var move = player()
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
    saveGame();
    clearBoard();
  } else if (turn === 9) {
    setMessage('Tie game.')
    saveGame();
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
      saveGame();
    })
    $('#previous').on('click', function(e) {
      previousGame();
    })
    $("#clear").on('click', function(e) {
      clearGame();
    })
}

function saveGame() {
  if (current) {
    var array = Array.prototype.map.call(spaces, function(square) {
      return square.innerHTML })
    //var game = $.put(`/games/${current.innerHTML}`, {state: array})
    // fetch(`/games/${current.innerHTML}`, {
    //   method: 'PATCH',
    //   body: {state: array}
    // })
    $.ajax({url:`/games/${current}`,
    type: 'PATCH',
    data: {state: array}
})
    //clearBoard();
   } else {
     var array = Array.prototype.map.call(spaces, function(square) {
       return square.innerHTML })
     var game = $.post('/games', {state: array})
     game.done(function(data){
       current = data.data.id
     })
     //clearBoard();
   }
}

// hidden field that is set based on what game is selected; if it exists, the game is patched

function previousGame() {
  $.get('/games', {}, function(games) {

    var buttons = games.data.map(function(game){
      return `<button class="games" id=${game.id}>${game.id}</button>` }).join("")
      if (buttons) {
        $("#games").html(` ${buttons} `)
        //debugger;
        $(".games").on('click', function(e) {
          //debugger;
          displayGame(this);
        })
      }

  })


  // $("#clear").on('click', function(e) {
  //   debugger;
  //   displayGame(this);
  // })
  //$('#previous').off();
}

function clearGame() {
  spaces.forEach(function(square) {
    square.innerHTML = ''
  })
  current = null
  turn = 0
}

function displayGame(element) {
  turn = 0
  //$("#message").html(`<div id="current" style="display:none">${element.id}</div>`)
  current = element.id
  $.get(`/games/${element.id}`, function(game){
    //debugger;
    var state = game.data.attributes.state
    for (i=0; i < state.length; i++) {
      spaces[i].innerHTML = state[i]
    }
    state.forEach(function(space) {
      //debugger;
      if (space !== '') {
        turn += 1
      }
    })
  })
}
