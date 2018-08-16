var turn = 0;
var savedGame = 0;

var win_combos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(element) {
  element.innerHTML = player();
}

function setMessage(string) {
  document.querySelector("#message").innerHTML = string;
}

function checkWinner() {
  let squares = document.querySelectorAll("td");
  let array = $.makeArray(squares);
  let data = array.map(square => square.innerHTML);
  let token = '';
  let win_status = false;

  win_combos.forEach(function(combo) {
    if (data[combo[0]] === data[combo[1]] && data[combo[1]] === data[combo[2]] && data[combo[0]] !== '') {
      token = data[combo[0]];
      win_status = true;
    }
  });

  if (win_status === true) {
    setMessage(`Player ${token} Won!`);
	  saveGame();
  } else if (win_status === false && !data.includes('')) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
  return win_status;
}

function doTurn(element) {
  if (element.innerHTML === '') {
    updateState(element);
    turn += 1;
    if (checkWinner()) {
      resetBoard();
    }
  }
}

function attachListeners() {
  $("td").on('click', function() {
    if (!checkWinner()) {
      doTurn(this);
    }
  });

  $("#previous").on('click', function() {
    previousGame();
  });

  $("#save").on('click', function() {
    saveGame();
  })

  $("#clear").on('click', function() {
    resetBoard();
  })
}

function resetBoard() {
  $("td").empty();
  turn = 0;
  savedGame = 0;
}

function loadGame(state, id) {
  var squares = document.querySelectorAll("td");
  var index = 0;
  state.forEach(function (token) {
		squares[index].innerHTML = token;
		index += 1;
	})
  savedGame = id;

  var tokens = state.filter(token => token != '');
  turn = tokens.length;
}

function saveGame() {
  let squares = document.querySelectorAll("td");
  let array = $.makeArray(squares);
  let state = array.map(square => square.innerHTML);
  let data = {state: state}

  if (savedGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${savedGame}`,
      data: data
    });
  } else {
    $.post('/games', data, function(game) {
      savedGame = game.data.id;
    });
  }
}

function previousGame() {
  $("#games").empty();
  $.get('/games', function(games) {
    games.data.forEach(function(game) {
      $("#games").append("<button class='js-saved' data-id='" + game.id + "'>" + game.id + "</button>");
      $(".js-saved").click(function() {
        var id = $.parseJSON($(this).attr("data-id"));
        $.get(`/games/${id}`, function(data) {
          loadGame(data.data.attributes.state, id);
        });
      });
    });
  });
}

$(document).ready(function() {
  attachListeners();
})
