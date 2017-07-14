// Code your JavaScript / jQuery solution here

var turn = 0


WINNING_COMBOS = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [6,4,2]
    ]


$(document).ready(function() {
  attachListeners();
});


function resetBoard() {
  // var board = $('td')
  // for (i = 0; i < board.length; i++) {
  //   board[i].innerText = ''
  // }
  $('td').empty()
  turn = 0
  callMessage("")
}

function isEven(num) {
  if ((num % 2) === 0) {
    return true;
  } else {
    return false;
  }
};

function player() {
  // if turn is even, return "x", else return "o"
  if (isEven(turn)) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(spot) {
  // return either 'x' or 'o' from the player() and mark the new empty field on the board
  if (!checkWinner()) {
    spot.textContent = player()
    turn += 1;
  }
}

function callMessage(string) {
  $("div#message").html(string)
}

function checkWinner() {
  // return 'true' if winning combination, else return false
  // if true, call message(string) string = `Player ${player()} Won!`
  var playerWin = ''
  var win = WINNING_COMBOS.some(function(a) {
    if (($('td')[a[0]].textContent == "X" && $('td')[a[1]].textContent == "X" && $('td')[a[2]].textContent == "X") || ($('td')[a[0]].textContent == "O" && $('td')[a[1]].textContent == "O" && $('td')[a[2]].textContent == "O")) {
      playerWin = $('td')[a[0]].textContent
      return true
    } else {
      return false
    }
  })

  if (win) {
    callMessage(`Player ${playerWin} Won!`)
    return true
  } else {
    return false
  }
}

function doTurn(location) {
  if (location.textContent == '') {
    updateState(location);

    if (checkWinner()) {
      checkWinner();
      saveGame();
    } else if (turn == 9) {
      callMessage("Tie game.");
      saveGame();
      resetBoard();
    }
  } else {
    callMessage("Location Invalid")
  }
}

function currentBoard() {
  var board = []
  $('td').each(function(i, square) {
    board.push(square.textContent)
  })
  return JSON.stringify(board)
}

function setBoard(board) {
  var number = 9
  board.forEach(function(square, index) {
    $('td')[index].textContent = square
    if (square === '') {
      number--
    }
  })
  callMessage('')
  checkWinner()
  turn = number
}

function saveGame() {
  var values = { state: [currentBoard()] }

  if ($(".games[status='active']").length > 0) {
   var gameSave = $.ajax({
     type: "PATCH",
     url: `/games/${$(".games[status='active']")[0].id}`,
     data: values
   });
  } else {
   var gameSave = $.post('/games', values )
  }

  gameSave.done(function(data) {
    callMessage("Game Saved")
  })
}


function attachListeners() {
  // $('td').each(function(i, square) {
  //   square.on("click", console.log('hi'))
  // })
  $('td').on('click', function() {
    doTurn(this);
  })

$('#previous').on('click', function() {
  var gameSaves = $.get('/games')
  gameSaves.done(function(r) {
    if (r.data.length != 0) {
      $('#games')[0].innerHTML = "<h4>Previous Games</h4>"
      r.data.forEach(function(game) {
        $('#games')[0].innerHTML += `<button class="games" id='${game.id}' status="not_active">${game.id}</button><br>`
      })
      $('.games').on('click', function() {
        var gameSave = $.get(`/games/${this.id}`)
        gameSave.done(function(game) {
          var board = JSON.parse(game.data.attributes.state)
          if ($(".games[status='active']").length > 0) {
            $(".games[status='active']")[0].attributes.status.nodeValue = 'not_active'
          }
          setBoard(board)
          $(`.games[id=${game.data.id}]`)[0].attributes.status.nodeValue = 'active'


          // Have to figure out how to save the game id as data on the page so when I update the game, I already have the game data available


        })
      })
    }
  })
})

 $('#save').on('click', function() {
   saveGame()
 })


  $("#clear").on('click', function() {
    resetBoard();
  })
}




// Tie Game
// doTurn($('td')[0])
// doTurn($('td')[1])
// doTurn($('td')[2])
// doTurn($('td')[4])
// doTurn($('td')[7])
// doTurn($('td')[3])
// doTurn($('td')[5])
// doTurn($('td')[8])
// doTurn($('td')[6])
//
// Winner
// doTurn($('td')[0])
// doTurn($('td')[1])
// doTurn($('td')[3])
// doTurn($('td')[4])
// doTurn($('td')[6])
//
