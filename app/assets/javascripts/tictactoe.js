$(document).ready(function() {
   attachListeners();
   $("#clear").on("click", clear);
   $("#previous").on("click", previous);
   $("#save").on("click", save);
 });

var turn = 0;
var game = null;

var player = function() {
  if (turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  };
};

function updateState(location) {
  $(location).append(player())
};

function message(string) {
  document.getElementById("message").innerHTML = string;
};

const wins = [[0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [2,4,6], [0,4,8]];

function checkWinner() {
  var won = false;
  var board = [];
  document.querySelectorAll("td").forEach(function(x) {board.push(x.innerHTML)});
  for (var i=0; i < wins.length; i++) {
    if (board[wins[i][0]] == board[wins[i][1]] && board[wins[i][1]] == board[wins[i][2]] && board[wins[i][0]] != "") {
      message(`Player ${board[wins[i][0]]} Won!`);
      var won = true;
    }
  } return won;
}

function clear() {
  turn = 0;
  document.querySelectorAll("td").forEach(function(x) {x.innerHTML = ""});
  game = null;
}

function doTurn(location) {
  if (location.innerHTML === "") {
    updateState(location);
    turn ++;
  }
  if (checkWinner()) {
    checkWinner();
    save();
    clear();
  } else if (turn === 9) {
    message("Tie game.");
    save();
    clear();
  }
}

function attachListeners() {
  $('td').on("click", function() {
    if (!checkWinner()) {
      doTurn(this);
    }
  });
}

function save() {
  var board = [];
  document.querySelectorAll("td").forEach(function(x) {board.push(x.innerHTML)});
  if (game === null) {
    var saving = $.ajax({
      type: 'POST',
      url: '/games',
      data: {state: board},
      dataType: 'json'
    })
  } else {
    var saving = $.ajax({
      type: 'PATCH',
      url: '/games/' + game,
      data: {state: board},
      dataType: 'json'
    })
  }
  saving.done(function(currentGame) {
    game = currentGame.data.id;
  })
}

function display() {
  game = this.innerHTML
  $.get(`/games/${game}`, function(data){
    var board = data.data.attributes.state
    for (var i=0; i<9; i++) {
      document.getElementsByTagName("td")[i].innerHTML = board[i]
    }
    $(document).ready(function() {
      return board;
    })
    board = board.filter(Boolean)
    turn = board.length
  })
}

function previous(){
  var gamesPlayedIds = []
  for (var i = 0; i < document.querySelectorAll("button").length; i++) {
    gamesPlayedIds.push( document.querySelectorAll("button")[i].id)
  }
  $.get("/games",function(data){
    var games = data["data"]
    games.forEach(function(game){
      if (gamesPlayedIds.includes(game.id) === false) {
          $("#games").append(`<button id="${game.id}" onclick="display.call(this)">${game.id}</button><br>`)
      }
    })
  })
}
