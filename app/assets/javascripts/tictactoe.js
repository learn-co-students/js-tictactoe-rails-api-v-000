//pseudo code

var turn = 0

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
}

$(document).ready(function() {
  attachListeners();
})
