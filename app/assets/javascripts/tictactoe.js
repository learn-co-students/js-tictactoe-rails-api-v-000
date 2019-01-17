// Game play functions //
var turn = 0

function player() {
  // Returns 'X' when the turn variable is even and 'O' when it is odd.

}

function updateState(element) {

}

function setMessage() {

}

function checkWinner() {

}

function doTurn(element) {
  // Increments the turn variable by 1
  ++turn

  // invoke updateState()

  // invoke checkWinner()
}

// Listeners //

$(function attachListeners() {
  // Attaches the appropriate event listeners to:

  // Cells
  const cell1 = $("tr#row-1 td#td-1")
  const cell2 = $("tr#row-1 td#td-2")
  const cell3 = $("tr#row-1 td#td-3")

  const cell4 = $("tr#row-2 td#td-4")
  const cell5 = $("tr#row-2 td#td-5")
  const cell6 = $("tr#row-2 td#td-6")

  const cell7 = $("tr#row-3 td#td-7")
  const cell8 = $("tr#row-3 td#td-8")
  const cell9 = $("tr#row-3 td#td-9")

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
