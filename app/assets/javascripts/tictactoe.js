// Code your JavaScript / jQuery solution here
// use 'odd' or 'even' to determine if it's X or O turn
var turn = 0

// const squares = [square_1,square_2,square_3,square_4,square_5,square_6,square_7,square_8,square_9]

function isEven(n) {
   return n % 2 === 0;
}

// Returns the token of the player whose turn it is, 'X' when the turn variable is even and 'O' when it is odd.
function player() {
  if (isEven(turn)) {
    return 'X'
  }
  else {
    return "O"
  }
}

// Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.

function updateState(square) {
    if ($(square).text() == "") {
      $(square).text(player())
      turn++
    }
}

// Accepts a string and adds it to the div#message element in the DOM.
function setMessage(string) {
  $('#message').text(string)
}

// 1) Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally).
//    Otherwise, returns false.
// 2) If there is a winning combination on the board, checkWinner() should invoke setMessage(),
//    passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'

function checkWinner() {

  var square_1 = $('td[data-x="0"][data-y="0"]').text()
  var square_2 = $('td[data-x="1"][data-y="0"]').text()
  var square_3 = $('td[data-x="2"][data-y="0"]').text()
  var square_4 = $('td[data-x="0"][data-y="1"]').text()
  var square_5 = $('td[data-x="1"][data-y="1"]').text()
  var square_6 = $('td[data-x="2"][data-y="1"]').text()
  var square_7 = $('td[data-x="0"][data-y="2"]').text()
  var square_8 = $('td[data-x="1"][data-y="2"]').text()
  var square_9 = $('td[data-x="2"][data-y="2"]').text()

  var combination_1 = (square_1 == square_2 && square_1 == square_3 && square_1 != "") // X - X - X 1st row
  var combination_2 = (square_1 == square_4 && square_1 == square_7 && square_1 != "") // X vertical 1st column
  var combination_3 = (square_4 == square_5 && square_4 == square_6 && square_4 != "")// X - X - X middle row
  var combination_4 = (square_2 == square_5 && square_2 == square_8 && square_2 != "") // X vertical middle column
  var combination_5 = (square_6 == square_7 && square_6 == square_9 && square_6 != "") // X - X - X bottom row
  var combination_6 = (square_3 == square_6 && square_3 == square_9 && square_3 != "") // X vertical last column
  var combination_7 = (square_1 == square_5 && square_1 == square_9 && square_1 != "") // diagonal 1
  var combination_8 = (square_3 == square_5 && square_3 == square_7 && square_3 != "") // diagonal 2

  if (combination_1 || combination_2 || combination_7) {

    setMessage("Player " + square_1 + " Won!")
    return true
  }
  else if (combination_3) {

    setMessage("Player " + square_4 + " Won!")
    return true
  }
  else if (combination_4) {

    setMessage("Player " + square_2 + " Won!")
    return true
  }
  else if (combination_5) {

    setMessage("Player " + square_6 + " Won!")
    return true
  }
  else if (combination_6 || combination_8) {

    setMessage("Player " + square_3 + " Won!")
    return true
  } else {
    return false
  }
}

function doTurn(element) {
  updateState(element)
  if (checkWinner()) {
    autoSaveGame()
    resetGame()
  } else {
    if (turn === 9 && checkWinner() === false) {
      setMessage('Tie game.')
      autoSaveGame()
      resetGame()
    }
  }
}

function resetGame() {
  var square_1 = $('td[data-x="0"][data-y="0"]').text("")
  var square_2 = $('td[data-x="1"][data-y="0"]').text("")
  var square_3 = $('td[data-x="2"][data-y="0"]').text("")
  var square_4 = $('td[data-x="0"][data-y="1"]').text("")
  var square_5 = $('td[data-x="1"][data-y="1"]').text("")
  var square_6 = $('td[data-x="2"][data-y="1"]').text("")
  var square_7 = $('td[data-x="0"][data-y="2"]').text("")
  var square_8 = $('td[data-x="1"][data-y="2"]').text("")
  var square_9 = $('td[data-x="2"][data-y="2"]').text("")

  turn = 0

}

function clearGame(){
  $('#clear').on('click',function() {
    resetGame()
  })
}

function autoSaveGame () {
  var square_1 = $('td[data-x="0"][data-y="0"]').text()
  var square_2 = $('td[data-x="1"][data-y="0"]').text()
  var square_3 = $('td[data-x="2"][data-y="0"]').text()
  var square_4 = $('td[data-x="0"][data-y="1"]').text()
  var square_5 = $('td[data-x="1"][data-y="1"]').text()
  var square_6 = $('td[data-x="2"][data-y="1"]').text()
  var square_7 = $('td[data-x="0"][data-y="2"]').text()
  var square_8 = $('td[data-x="1"][data-y="2"]').text()
  var square_9 = $('td[data-x="2"][data-y="2"]').text()

  var squares = [square_1,square_2,square_3,square_4,square_5,square_6,square_7,square_8,square_9]
  var id = $('td').data('id')

  if (id == undefined) {
    $.post('/games', { 'state[]': squares })
  } else {
    $.ajax({
      data: { 'state': squares },
      method: "PATCH",
      url: "/games/" + id
    });
  }
}

function saveGame() {
  $('#save').on('click', function () {
    autoSaveGame()
  })
}


function previousGame() {
  $('#previous').on('click', function(){
    $.get('/games', function (data){
      var lists = ""
      for (i = 0; i < data['data'].length; i++) {
        lists += '<button class="js-game" data-id=' + data["data"][i]['id'] + '>' + (data["data"][i]['id']) + '</button> <br>'
      }
      $('#games').html(lists)

    }).done(function () {
      $(".js-game").on("click", function () {
        var id = $(this).data("id");
        $.get("/games/" + id, function(data) {
            var square_1 = $('td[data-x="0"][data-y="0"]').text(data['data']["attributes"]['state'][0])
            var square_2 = $('td[data-x="1"][data-y="0"]').text(data['data']["attributes"]['state'][1])
            var square_3 = $('td[data-x="2"][data-y="0"]').text(data['data']["attributes"]['state'][2])
            var square_4 = $('td[data-x="0"][data-y="1"]').text(data['data']["attributes"]['state'][3])
            var square_5 = $('td[data-x="1"][data-y="1"]').text(data['data']["attributes"]['state'][4])
            var square_6 = $('td[data-x="2"][data-y="1"]').text(data['data']["attributes"]['state'][5])
            var square_7 = $('td[data-x="0"][data-y="2"]').text(data['data']["attributes"]['state'][6])
            var square_8 = $('td[data-x="1"][data-y="2"]').text(data['data']["attributes"]['state'][7])
            var square_9 = $('td[data-x="2"][data-y="2"]').text(data['data']["attributes"]['state'][8])

            // this helps me in finding if the existing game exists or not. this will help me in sending a patch request or post request based on this id
            $( "td" ).data('id', id)

            // set the turn
            let squares = []
            squares = [square_1,square_2, square_3, square_4,square_5,square_6,square_7,square_8,square_9]

            let texts = []
            squares.forEach (function(e) {
              return texts.push(e.text())
            })

            turn = 0
            texts.forEach (function(e) {
              if (e == "X" || e == "O") {
	            turn++ }})

      })
    })
  })
})
}

function attachListeners () {
  $( "td" ).click(function() {
  return doTurn(this)
  })
}

//////////////////////

$(function() {

  attachListeners()
  previousGame()
  saveGame()
  clearGame()
})
