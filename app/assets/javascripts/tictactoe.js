//pseudo code

var turn = 0
var gameCount = 0
var board = []

function gameBoard() {
  //returns an array of the current board, which you can use when showing a game to
  //iterate over to add each element as text to that cell...?
  //can also iterate through the array to check if someone has won
  $.each($("td"), function(index, cell) {
    //does this add nil values for blank cells? ... because I need it to...
    board.push($(cell).text());
  })
}

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(cell) {
  var currentPlayer = player();
  //var x = event.getAttribute("data-x");
  //var y = event.getAttribute("data-y");
  //var xCell = $('td').find("[data-x= '" + x + "']")
  //var cell = xCell.find("[data-y]= '" + y + "']");
  $(cell).text(currentPlayer);
  gameBoard();
}

function doTurn(cell) {
  turn += 1;
  updateState(cell);
}

function attachListeners() {
  $('td').on('click', function(event) {
    event.preventDefault();
    //passes doTurn a param of the event
    //grabs cell that was clicked
    doTurn(event.toElement);
  })

  $('#save').on('click', function(event) {
    event.preventDefault(); //working up to here
    console.log(event);
    //save game to database
    //var state = JSON.stringify(board)
    var posting = $.post('/games', { 'state': board });
    //append game number to #games div
    //posting.done(function() {
      //gameCount += 1;
      //$('#games').append(gameCount.to_s);
    //})
  })

}

$(document).ready(function() {
  attachListeners();
})
