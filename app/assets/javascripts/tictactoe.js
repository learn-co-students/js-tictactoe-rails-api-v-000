$(function() {
  attachListeners();
});

function attachListeners() {
  $("#save").click(() => saveGame());
  $("#previous").click(() => showPreviousGames());
  $("#clear").click(() => resetBoard());

  $('td').click(function() {
    debugger;
    if (!$(this).text() && !checkWinner()) {
      doTurn(this);
    }
  });
}

window.turn = 0;
window.gameId = 0;
window.winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function board(cell) {
  return $('td')[cell] || $('td');
}

function resetBoard() {
  turn = 0;
  gameId = 0;
  const t = $(board()).empty();
}

function tokens(cell) {
  const t = $(board()).map((i, td) => $(td).text());
  return t[cell] || t;
}


function saveGame() {
  const state = []
  tokens().each((i, td) => state.push(td));

  if (!!gameId) {
    $.ajax({
      type: 'patch',
      url:"/games/"+gameId,
      data:{state:state}
    });
  } else {
    $.post("/games", {state:state}, function(game) {
      gameId = game.data.id;
      loadGameBtn(game.data)
    });
  }
}

function showPreviousGames() {
  $("#games").empty();
  $.get("/games", function(games) {
    games.data.forEach(loadGameBtn);
  });
}

function loadGameBtn(game) {
  $("#games").append(`<button id="loadGame-${game.id}">${game.id}</button>`);
  $(`#loadGame-${game.id}`).click(() => loadGame(game.id));
}

function loadGame(id) {
  $.get("/games/"+id, function(game) {
    const state = game.data.attributes.state
    gameId = game.data.id;
    setTurn(game);
    state.forEach(function(cell, i) {
      $(board(i)).html(cell);
    })
  });
}

function setTurn(game) {
  window.turn = 0
  game.data.attributes.state.forEach(cell => {
    !!cell ? turn++ : turn
  })
}

function player() {
  return (turn % 2 === 0) ? 'X' : 'O';
}

function updateState(element) {
  $(element).text(player());
}

function setMessage(string) {
  $("#message").text(string);
}

function checkWinner() {
  let winner = false;
  const t = tokens;

  winCombos.forEach(function(c) {
    if (
      t(c[0]) !== "" &&
      t(c[0]) === t(c[1]) &&
      t(c[1]) === t(c[2])
    ) {
      winner = true;
      setMessage("Player "+t(c[0])+" Won!");
    }
  });
  return winner;
}

function doTurn(element) {
  updateState(element);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}
