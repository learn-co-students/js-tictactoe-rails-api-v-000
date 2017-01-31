//pseudo code

var turn = 0

function attachListeners() {
  $('td').on('click', function(event) {
    //passes doTurn a param of the event
    doTurn(event);
    event.preventDefault();
  })
}

function doTurn(event) {
  turn += 1;
  updateState(event);
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
  var x = event.getAttribute("data-x");
  var y = event.getAttribute("data-y");
  var xCell = $('td').find("[data-x= '" + x + "']")
  var cell = xCell.find("[data-y]= '" + y + "']");
  cell.text(player);
}

$(document).ready(function() {
  attachListeners();
})
