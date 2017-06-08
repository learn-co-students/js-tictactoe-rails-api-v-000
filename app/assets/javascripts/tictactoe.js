var turn = 0;
var board = new Array(9);
var currentGame = 0;

const win_combos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function resetBoard() {
  currentGame = 0;
  turn = 0;
  board = new Array(9);
  $('td').text("");
}

function message(msg) {
  $("#message").html(msg);
}

function updateBoard() {
  board[0] = $('td[data-x="0"][data-y="0"]').html();
  board[1] = $('td[data-x="1"][data-y="0"]').html();
  board[2] = $('td[data-x="2"][data-y="0"]').html();
  board[3] = $('td[data-x="0"][data-y="1"]').html();
  board[4] = $('td[data-x="1"][data-y="1"]').html();
  board[5] = $('td[data-x="2"][data-y="1"]').html();
  board[6] = $('td[data-x="0"][data-y="2"]').html();
  board[7] = $('td[data-x="1"][data-y="2"]').html();
  board[8] = $('td[data-x="2"][data-y="2"]').html();
}

var player = function() {
  if (turn % 2 === 0) {
   return "X"
  } else {
   return "O"
  }
}

function updateState(event){
  const token = player();
  $(event.target).text(token);
  updateBoard();
}

function checkWinner(){
  const token = player();
  for (let i=0; i < win_combos.length; i++) {
    pos_1 = win_combos[i][0];
    pos_2 = win_combos[i][1];
    pos_3 = win_combos[i][2];
    if (board[pos_1] === token && board[pos_2] === token && board[pos_3] === token) {

      message("Player " + token + " Won!");
      return true;
    }
  }
  //Tie Game
  var emptyCellDetected = false
  for (var i=0; i < board.length; i++) {
    if (board[i] == "") {
      emptyCellDetected = true
    }
  }
  if (emptyCellDetected == false) {

    message("Tie game");
    return true;
  }
  //returns false if no winner
  return false;
}

function analyzedPreviousGame(){
  turn = board.filter(String).length;
  const tokens = ["X","O"]
  for (let i=0; i < tokens.length; i++) {
    for (let j=0; j < win_combos.length; j++) {
      pos_1 = win_combos[j][0];
      pos_2 = win_combos[j][1];
      pos_3 = win_combos[j][2];
      if (board[pos_1] === tokens[i] && board[pos_2] === tokens[i] && board[pos_3] === tokens[i]) {
        return message("Player " + tokens[i] + " Won!");
      }
    }
  }
  if (turn == 9) {
    return message("Tie game");
  }
}

function loadBoard() {
  $('td[data-x="0"][data-y="0"]').text(board[0]);
  $('td[data-x="1"][data-y="0"]').text(board[1]);
  $('td[data-x="2"][data-y="0"]').text(board[2]);
  $('td[data-x="0"][data-y="1"]').text(board[3]);
  $('td[data-x="1"][data-y="1"]').text(board[4]);
  $('td[data-x="2"][data-y="1"]').text(board[5]);
  $('td[data-x="0"][data-y="2"]').text(board[6]);
  $('td[data-x="1"][data-y="2"]').text(board[7]);
  $('td[data-x="2"][data-y="2"]').text(board[8]);
  analyzedPreviousGame();
}

function doTurn(event) {
  updateState(event);
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else {
    turn += 1;
  }
}

function attachListeners (){
  $('td').on('click', function(event) {
    if ($(event.target).html() == "") {
      doTurn(event);
    };
  });
  $('button#previous').on('click', function() {
    getPreviousGames();
  });
  $('button#save').on('click', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    saveGame();
  });
  $("li").on('click', function(event){
    loadGame(event.currentTarget.id);
  });
};

$(function() {
  attachListeners();
});

// Persistence Functions -------------------------------------

function getPreviousGames() {
  var line_items = ""
  $.getJSON('/games').done(function(response){
    $.each(response, function(index, value){
      line_items += "<li id='" + value.id + "'>" + value.id + "</li>"
    })
    $('#games').html(line_items)
    attachListeners();
  });
};

function saveGame() {
  if (!currentGame) {
    var res;
    $.ajax({
      url: "/games",
      method: 'POST',
      dataType: "JSON",
      data: { game: {state: JSON.stringify(board)} },
      success: function(response) {
        currentGame = response.id;
      }
    });
  } else {
    $.ajax({
      url: "/games/" + currentGame,
      method: 'PATCH',
      dataType: "JSON",
      data: { game: {state: JSON.stringify(board)} }
    });
  };
};

function loadGame(id) {
  const url = "/games/" + id
  $.get(url).success(function(response){
    board = JSON.parse(response)
    loadBoard();
  })
}
