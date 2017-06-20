

var turn = 0


function noMoreCells() {
  allTaken = true
  var cells = $("td")

  cells.each(function() {
    if (this.textContent === "") {
      allTaken = false
      return false
    }
  })
  return allTaken
}


function checkWinner() {
  var cells = $("td")

  const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [2,5,8],
    [1,4,7],
    [0,3,6],
    [0,4,8],
    [6,4,2]

  ]
  var value = false
   winningCombos.forEach(function(combo) {
    if (cells[combo[0]].textContent && cells[combo[0]].textContent === cells[combo[1]].textContent && cells[combo[1]].textContent === cells[combo[2]].textContent ) {
      value = true
      message("Player " + player() + " Won!")
      }

    })

    if (noMoreCells()) {
      value = true
     message("Tie game")
   }

    return value
  }

function doTurn(event) {
  updateState(event)

  if (!checkWinner()) {
    turn++
  }
  else {
    turn = 0
    $("td").empty()
  }

}



function attachListeners() {
  $("td").on("click", function(event) {
      doTurn(event)
    })

    $("#save").on('click', function(event) {

      event.preventDefault()

      var state = $('td').map(function(index, element) {
        return element.innerText
      })
      var string = JSON.stringify({game: {state: $.makeArray(state)}})


      $.ajax({
      type: "POST",
      url: '/games',
      data: string,
      success: function(response) {
        console.log(response)
      },
      dataType: 'json',
      contentType: "application/json"
      });
    })
  }




  function player() {
    if (turn % 2 === 0) {
      return "X"
    }
    return "O"
  }

  function updateState(event) {
    event.delegateTarget.textContent = player()
  }

  function message(message) {
    $('#message').text(message)
  }



  $(function() {


  attachListeners()
})
