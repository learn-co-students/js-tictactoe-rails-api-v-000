
var turn = 0
var currentGame = 0
var state = ["", "", "", "", "", "", "", "", ""]
const winCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2],
]

$(function() {
  attachListeners();
  setBoard();
})

function setBoard() {
  $('[data-x="0"][data-y="0"]')[0].innerHTML = state[0];
  $('[data-x="1"][data-y="0"]')[0].innerHTML = state[1];
  $('[data-x="2"][data-y="0"]')[0].innerHTML = state[2];
  $('[data-x="0"][data-y="1"]')[0].innerHTML = state[3];
  $('[data-x="1"][data-y="1"]')[0].innerHTML = state[4];
  $('[data-x="2"][data-y="1"]')[0].innerHTML = state[5];
  $('[data-x="0"][data-y="2"]')[0].innerHTML = state[6];
  $('[data-x="1"][data-y="2"]')[0].innerHTML = state[7];
  $('[data-x="2"][data-y="2"]')[0].innerHTML = state[8];
}

function resetGame() {
  turn = 0;
  state = ["", "", "", "", "", "", "", "", ""];
  currentGame = 0;
  setBoard();
}

function attachListeners() {
  $( "table" ).click("td", function(e) {
    doTurn(e)
  });
  $("#save").click(function() {
    saveGame()
  });
  $("#previous").click(function() {
    previousGames();
  });
}

function previousGames() {
  $.ajax({
    url: '/games',
    type: 'get',
    dataType: "json"
  }).done(function(response) {
    listGames(response.games);
    setGameLinks();
  });
};


function listGames(games) {
  var listItems =
  games.map(function(game) {
    return `<div class="game_link" data-game-id="${game.id}">- ${game.id}</div>`
  }).join('');
  $('#games').html(listItems);
}

function setGameLinks() {
  $(document).on('click', ".game_link", function(e) {
      var id = $(this).attr('data-game-id')
      $.ajax({
        url: '/games/' + id,
        type: 'get',
        dataType: "json"
      }).success(loadGame(json.game));
   });
 };

function loadGame(game) {
  state = game.state;
  turn = game.turn;
  currentGame = game.id;
  setBoard();
};

function saveGame() {
  $.ajax({
    url: (currentGame === 0) ? '/games' : '/games/' + currentGame,
    type: (currentGame === 0) ? 'post' : 'patch',
    data: {game: {state: state, turn: turn}},
    dataType: "json"
  }).success(function(json) {
    loadGame(json.game);
  });
}

function doTurn(e) {
  updateState(e);
  turn ++;
  checkWinner();
}


function updateState(e) {
  var cell = e.target;
  if(cell.innerHTML === "") {
    cell.innerHTML = player();
  }
  state = [];
  $("td").map(function() {
    state.push(this.innerHTML)
  });
}


function player() {
  if (parseInt(turn) % 2 == 0) {
    return "X";
  } else {
    return "O";
  };
};



function checkWinner() {
  winCombinations.forEach(function(combo) {
      a = combo[0]
      b = combo[1]
      c = combo[2]
      if (state[a] == "X" && state[b] == "X" && state[c] == "X") {
        autoSave();
        message("Player X Won!");
      } else if (state[a] == "O" && state[b] == "O" && state[c] == "O") {
        autoSave();
        message("Player O Won!");
      };
  });
  checkTie();
  return false
};

function autoSave() {
  $.ajax({
    url: (currentGame === 0) ? '/games' : '/games/' + currentGame,
    type: (currentGame === 0) ? 'post' : 'patch',
    data: {game: {state: state, turn: turn}},
    dataType: "json"
  });
  resetGame();
}

function checkTie() {
  if(turn === 9) {
    autoSave();
    message("Tie game");
  } else {
    return false
  }
}

function message(message) {
  $("#message").text(message)
}
