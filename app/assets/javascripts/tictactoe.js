var turn = 0;
var currentGameId = 0;
var winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [2,4,6], [0,4,8]
];

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $('td').on("click", function() {
    doTurn(this);
  });

  $('#save').on("click", function() {
    saveGame();
  });

  $('#previous').on("click", function() {
    $("#games").html("");
    $.get("/games", function(data) {
      for (var i of data.data) {
        let id = i.id;
        $("#games").append(`<button id="game-${i.id}">${i.id}</button>`);
        $(`#game-${id}`).on('click', () => {
          loadGame(id);
        });
      }
    });
  });

  $('#clear').on("click", function() {
    clearBoard();
  });
}

function player() {
  return (turn%2 === 0) ? "X" : "O";
}

function doTurn(cell) {
  if ($(cell).html() != "X" && $(cell).html() != "O") {
    updateState(cell);
    turn++;
  }
  if (tieGame() && !checkWinner()) {
    setMessage("Tie game.");
    saveGame();
    clearBoard();
  } else if (checkWinner()) {
    saveGame();
    clearBoard();
  }
}

function updateState(cell) {
  let board = [];
  $(cell).text(player());
  $('td').each(function() {
    board.push($(this).html());
  });
  return board;
}

function loadGame(id) {
  $('td').each(function() {
    $(this).html("");
  });
  $.get("/games/" + id, function(data) {
    let state = data.data.attributes.state
    let counter = 0;
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        $("[data-x=" + k + "][data-y=" + j + "]").html(state[counter]);
        counter++;
      }
    }
    currentGameId = id;
    turn = state.join('').length;
  })
}

function saveGame() {
  let params = {'state': updateState()};
  if (currentGameId !== 0) {
      $.ajax({
        type: "PATCH",
        url: `/games/${currentGameId}`,
        data: params
      });
  } else {
    $.post("/games", params, function(data) {
      currentGameId = data.data.id;
    });
  }
}

function clearBoard() {
  $('td').each(function() {
    $(this).html("");
  });
  currentGameId = 0;
  turn = 0;
}

function setMessage(message) {
  $("#message").text(message);
}

function checkWinner() {
  for (var i of winningCombos) {
    if ((updateState()[i[0]] === "X" && updateState()[i[1]] === "X" && updateState()[i[2]] === "X")
    || (updateState()[i[0]] === "O" && updateState()[i[1]] === "O" && updateState()[i[2]] === "O")) {
       setMessage(`Player ${updateState()[i[0]]} Won!`);
       return true;
    }
  }
  return false;
}

function tieGame() {
  if (updateState().includes("")) {
    return false;
  } else {
    saveGame();
    turn = 0;
    return true;
  }
}
