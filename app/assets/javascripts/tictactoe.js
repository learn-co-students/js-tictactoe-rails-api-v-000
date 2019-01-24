// Code your JavaScript / jQuery solution here
//window.gameStatus = false;
window.currentGame = 0;

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]
window.turn = 0;

$(document).ready(function() {
  attachListeners();
});
  $(window).on('load', function() {
    window.squares = $('td');
});

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(clicked) {
  var currentPlayer = player();
  $(clicked).text(currentPlayer).toggleClass("pushed");;
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  const WINNING_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ]
  var winner = false;
  var board = {}

  $('td').text((index, clicked) => board[index] = clicked);

  WINNING_COMBOS.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })
  return winner;
}

function checkAnotherWinner() {
  const WINNING_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ]
  var winner = false;
  var board = {}

  $('td').text((index, clicked) => board[index] = clicked);

  WINNING_COMBOS.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })
  return winner;
}

function doTurn(clicked) {
  if (!spaceTaken(clicked) && !checkWinner()) {
    updateState(clicked);
    turn++;
    checkDraw()
    if (checkAnotherWinner()) gameWon();
  }
}

function attachListeners() {
  $('td').on('click', function() {
    doTurn(this)
  });
  $("#save").click(function(event) {
    saveGame();
  });
  $("#previous").click(function(event) {
    previousGame();
  });
  $("#clear").click(function(event) {
    clearBoard();
  })
}

function saveGame() {
    let state = $.map(squares, val => val.innerHTML);
    let values = { state: state };

    if (currentGame) {
      $.ajax({
        method: 'PATCH',
        url: '/games/' + currentGame,
        data: values
      });
    } else {
      $.post('/games', values, function(data) {
        currentGame = data['data']['id']
    });
  }
}

function previousGame() {
  $.get('/games', function(data) {
    let games = data['data'];
    for(let i = 0; i < games.length; i++) {
      gameId = games[i]['id']
      let toAppend = `<button class="load-game" data-id="${gameId}" onclick="loadGame(this);">${gameId}</button>`
      if($('#games').html().indexOf(toAppend) === -1)
      $('#games').append(toAppend);
    }
  });
}

function loadGame(clicked) {
  let gameId = $(clicked).data('id');
  currentGame = gameId

  $.get('/games/' + gameId, function(data) {
    let state = data['data']['attributes']['state']
    $('td').each(function(index) {
      $(this).text(state[index])
      if(state[index]) turn++;
    });
  });
}

function clearBoard() {
  turn = 0;
  currentGame = 0;
  $('td').empty().toggleClass('pushed').removeClass('pushed');
}

function spaceTaken(clicked) {
  return $(clicked).text() !== ''
}

function gameWon() {
  saveGame();
  clearBoard();
}

function checkDraw() {
  if (turn === 9 && !checkWinner()) {
    setMessage("Tie game.")
    saveGame();
    clearBoard();
  }
}
