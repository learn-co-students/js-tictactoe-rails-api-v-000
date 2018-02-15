// Code your JavaScript / jQuery solution here
var turn = 0
// using let turn = 0 causes player() to return 'O' for even. ??

var gameId = 0;

// const does not work for checkwinner()
var WIN_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
$(document).ready(function() {
   attachListeners();
 });

 function player() {
   return turn % 2 === 0 ? 'X' : 'O'
 }

function attachListeners() {

  //when a user clicks on a square, the event listener should invoke doTurn() and pass in the element that was clicked

  $('td').on('click', function() {
    // console.log(this)
    if (this.innerHTML === "" && checkWinner() === false ) {
    doTurn(this)
  }
  })

  $('#save').on('click', function() {
    saveGame();
  })

  $('#previous').on('click', function() {
    $('#games').empty();
    $.get('/games', function(resp) {
      // debugger
      resp.data.forEach(function(game) {
        $('#games').append(`<button id="game-${game.id}">${game.id}</button>`);
        $(`#game-${game.id}`).on('click', function() {
          loadGame(game.id);
        })
      })
    })
  })

  $('#clear').on('click', function() {
      resetGame();
  })
}

function loadGame(id) {
  // clicking the save button sends a patch req
  gameId = id

  // debugger
  // $.get('/games/' + id, function(resp) {
  //   resp.data.attributes.state.forEach(function(mark, index) {
  //     if (mark !== "") {
  //       turn ++
  //     }
  //     $('td')[index].innerHTML = mark
  //     // debugger
  //     return turn;
  //
  //   })
  //
  // } )
    $.getJSON(`/games/${gameId}`, function(resp) {
     turn = resp.data.attributes.state.reduce(function(sum, el) {
       if (el !== "") {
         sum += 1;
       }
       return sum;
     }, 0);

     $("td")
       .toArray()
       .forEach((el, index) => {
         el.innerHTML = resp.data.attributes.state[index];
       });
   });
}

function saveGame() {
  let board = currentBoard()

  if (gameId) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      data: { state: board }

    }).done(function(resp) {
      setMessage("Saved")
    })
  } else {
    $.post('/games', { state: board }, function(game) {
      gameId = game.data.id
    })
  }
}




function updateState(square) {
  let token = player()
  $(square).text(token)

}

function setMessage(string) {
  $('#message').append(string);
}

function currentBoard() {
  return $('td').toArray().map(sq => {
  return sq.innerHTML
})
}

function setMessage(message) {
  $("#message").text(message);
}

function checkWinner() {
  let board = currentBoard()
  // this is the array of tds(squares) [td, td, td ...]
  // var winner = false

  for (let combo of WIN_COMBOS) {
    // debugger
    // if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] &&
    // board[combo[2]] === board[combo[1]]) {
    // setMessage(`Player ${board[combo[0]]} Won!`);
    // return true
    if (board[combo[0]] !== "" && board[combo[0]] === "X" &&    board[combo[1]] === "X" && board[combo[2]] === "X") {
      setMessage("Player X Won!");
      return true;
    } else if (
        board[combo[0]] !== "" && board[combo[0]] === "O" && board[combo[1]] === "O" && board[combo[2]] === "O"
    ) {
      setMessage("Player O Won!");
      return true;
      }
  }

    return false

}

function resetGame() {
   $("td")
     .toArray()
     .forEach(el => {
       el.innerHTML = "";
     });
   turn = 0;
   gameId = 0;
 }

function doTurn(square) {
  updateState(square);
  turn += 1;
  // order matters

  if (checkWinner() === true) {
    //reset board
    // $('td').empty();

    saveGame();
    resetGame();


    return;
  } else if (turn === 9){

    setMessage("Tie game.")
    // $('td').empty();
    // auto save when tied
    saveGame();
    resetGame();

    return;
  }

}
