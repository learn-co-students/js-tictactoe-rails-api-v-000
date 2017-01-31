//pseudo code

var turn = 0
var board = []

function attachListeners() {
  $('#save').on('click', function(event) {
    //append game number to #games div when #save is clicked and save game to database
    event.preventDefault();

    var posting = $.post('/games', gameBoard())
  })
  $('#previous').on('click', function(event) {
    //previous games are hidden until #previous is clicked - then show them like an index
    event.preventDefault();
  })
  $('td').on('click', function(event) {
    //passes doTurn a param of the event
    doTurn(event)
    event.preventDefault();
  })
  //when the user clicks on a previous game, it loads that game - like a show view
}

function doTurn(event) {
  turn += 1;
  updateState(event);
  checkWinner();
}

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(event) {
  var player = player();
  var cell = event.getAttribute("data-x") && event.getAttribute("data-y");
  cell.text(player);
}

function checkWinner() {
  //check board to see if anyone won
  //if someone has one, return "Player _ Won!" and pass the string to message()
}

function message(string) {
  //add string to the message div
  $('#message').append(string);
}

function gameBoard() {
  //returns an array of the current board, which you can use when showing a game to
  //iterate over to add each element as text to that cell...?
  //can also iterate through the array to check if someone has won
  $.each($("td"), function(index, cell) {
    board.push($(cell).text());
    return board
  })
}

$(document).ready(function() {
  attachListeners();
})
