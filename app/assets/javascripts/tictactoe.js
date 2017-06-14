var turn = 0

$(document).ready(function() {
  attachListeners()
});

function attachListeners() {
  $('td').on('click', function(event) {
    doTurn(event)
  })
}

function doTurn(event) {
  turn += 1
  updateState(event)
  checkWinner()
}

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(event) {
  return event.target.innerHTML = player()
}
