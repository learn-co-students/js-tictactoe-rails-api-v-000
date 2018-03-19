var turn = 0
var currentGame = 0
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

function player() {
  if(turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(square) {
  let token = player()
  $(square).text(token)
}

function setMessage(string) {
  $("#message").text(string)
}

function checkWinner() {
  let board = {}
  let winner = false
  
  $('td').text(function (index, square) {
    board[index] = square
  })

  WINNING_COMBOS.forEach(function (position) {
    if(board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      $("#save").click()
      return winner = true
    }
  })
  return winner
}

function doTurn(input) {
  updateState(input)

  if (checkWinner() === true){
    var x = document.getElementsByTagName("td")
    $(x).empty()
    $("#clear").click()
  } else {
    turn +=1
        }
  if (turn === 9 && checkWinner() === false){
    setMessage("Tie game.");
     $("#save").click()
    var x = document.getElementsByTagName("td")
    $(x).empty()
    turn = 0
   }
}

function attachListeners() {
  $('td').on("click", function() {
    if(!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })

  $('#clear').click(function() {
    var x = document.getElementsByTagName("td")
    if (currentGame) {
      currentGame = 0
      $(x).empty();
      turn = 0;
      boardValues = 0
      $.post('/games').done();
    } else {
      $(x).empty();
      boardValues = 0
      turn = 0;
    }

  });


  $('#save').on('click', function() {
    var state = []
    for (let i = 0; i < 9; i++) {
      state.push($('td')[i]["textContent"])
    }

    if(currentGame) {
      $.ajax({
        url: '/games/' + currentGame,
        method: 'PATCH',
        data: {state: state}
      })
    } else {
      $.ajax({
        url: '/games',
        method: 'POST',
        data: {state: state}
      }).done(function(data) {
        currentGame = data["data"]["id"]
      })
    }
  })

  $('#previous').on('click', function() {
    var posting = $.get('/games')
    posting.done(function(data) {
      var games = data["data"]
      $('#games').empty()
      games.forEach(function(game){
        var button = $('<button type="button" id="game-' + game["id"] + '">Game ' + game["id"] + '</>')
        $('#games').append(button)
      })
    })
  })

  $('#games').on('click', ":button[id^='game-']", function() {
    var getting = $.get('/games/' + this.id.substring(5))
    getting.done(function(data) {
      var game = data["data"]["attributes"]["state"]
      currentGame = this.url.substring(7)
      $("td:eq(0)").text(game[0])
      $("td:eq(1)").text(game[1])
      $("td:eq(2)").text(game[2])
      $("td:eq(3)").text(game[3])
      $("td:eq(4)").text(game[4])
      $("td:eq(5)").text(game[5])
      $("td:eq(6)").text(game[6])
      $("td:eq(7)").text(game[7])
      $("td:eq(8)").text(game[8])
      turn = game.filter(Boolean).length=1
      if (checkWinner() === true) {
        $('td').unbind('click')
      } else {
        attachListeners()
        turn = game.filter(Boolean).length
      }
    })
  })
}

$(document).ready(function() {
    attachListeners();
});
