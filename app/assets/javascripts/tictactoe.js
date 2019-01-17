// Game play functions
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

function doTurn() {
  // Increments the turn variable by 1
  ++turn
  // invoke updateState()

  // invoke checkWinner()
}

// Listeners

$(function attachListeners() {
  // Attaches the appropriate event listeners to:
  // Cells
  const cell1 = $("tr#row-1 td:nth-child(1)")
  const cell2 = $("tr#row-1 td:nth-child(2)")
  const cell3 = $("tr#row-1 td:nth-child(3)")

  const cell4 = $("tr#row-2 td:nth-child(1)")
  const cell5 = $("tr#row-2 td:nth-child(2)")
  const cell6 = $("tr#row-2 td:nth-child(3)")

  const cell7 = $("tr#row-3 td:nth-child(1)")
  const cell8 = $("tr#row-3 td:nth-child(2)")
  const cell9 = $("tr#row-3 td:nth-child(3)")

  $(cell1).click(function() {

  })

  $(cell2).click(function() {

  })

  $(cell3).click(function() {

  })

  $(cell4).click(function() {

  })

  $(cell5).click(function() {

  })

  $(cell6).click(function() {

  })

  $(cell7).click(function() {

  })

  $(cell8).click(function() {

  })

  $(cell9).click(function() {
    
  })




  // Save, previous, and clear buttons
  // user clicks on a square on the game board, the event listener should invoke doTurn()
})


// Buttons

$(function() {
  $("#save").on("click", function() {

    let posting = $.post('/games')

    posting.done(function(data) {

      let game = data["data"]
      let state = game["attributes"]["state"]

    })
  })
})


$("#previous").on("click", function() {

})

$("#clear").on("click", function() {

})
