// Game play functions //
var turn = 0

function player() {
  // Returns 'X' or 'O' if turn is even or odd
  if (turn%2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(element) {
  var cell = element
  // adds returned string ('X' or 'O') to clicked square on board
  cell.append(player())
}

function setMessage() {

}

function checkWinner() {

}

function doTurn(element) {
  // Increments the turn variable by 1
  ++turn

  updateState(element)

  checkWinner()
}

// Listeners //

$(function attachListeners() {
  // Attaches the appropriate event listeners to:

  // Cells

  const cell1 = $("td#td-1")
  const cell2 = $("td#td-2")
  const cell3 = $("td#td-3")

  const cell4 = $("td#td-4")
  const cell5 = $("td#td-5")
  const cell6 = $("td#td-6")

  const cell7 = $("td#td-7")
  const cell8 = $("td#td-8")
  const cell9 = $("td#td-9")

  // Upon cell click invoke doTurn
  $(cell1).click(function() {
    doTurn(this)
  })

  $(cell2).click(function() {
    doTurn(this)
  })

  $(cell3).click(function() {
    doTurn(this)
  })

  $(cell4).click(function() {
    doTurn(this)
  })

  $(cell5).click(function() {
    doTurn(this)
  })

  $(cell6).click(function() {
    doTurn(this)
  })

  $(cell7).click(function() {
    doTurn(this)
  })

  $(cell8).click(function() {
    doTurn(this)
  })

  $(cell9).click(function() {
    doTurn(this)
  })

  // Buttons

  $("#save").click(function() {
    alert("you clicked save")
  })

  $("#previous").click(function() {
    alert("you clicked previous")
  })

  $("#clear").click(function() {
    alert("you clicked clear")
  })
})
