var turn = 0;
var board = [];
var currentGame = undefined;

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
  turn = 0;
  board = [];
  $('td').text("");
};

function message(msg) {
  $("#message").html(msg);
};

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
};

var player = function() {
  return (turn % 2 === 0) ? "X" : "O";
};

function updateState(event){
  $(event.target).text(player());
  updateBoard();
};

function checkWinner(token){
  for (let i=0; i < win_combos.length; i++) {
    pos_1 = win_combos[i][0];
    pos_2 = win_combos[i][1];
    pos_3 = win_combos[i][2];
    if (board[pos_1] == token && board[pos_2] == token && board[pos_3] == token) {
      message("Player " + token + " Won!");
      return true;
    };
  };
  return false;
};

function checkTie(){
  if (turn >= 8) {
    message("Tie game");
    return true;
  } else {
    return false;
  };
};

function analyzePreviousGame(){
  turn = board.filter(String).length;
  checkWinner("X");
  checkWinner("O");
  checkTie();
};

function loadTable() {
  $('td[data-x="0"][data-y="0"]').text(board[0]);
  $('td[data-x="1"][data-y="0"]').text(board[1]);
  $('td[data-x="2"][data-y="0"]').text(board[2]);
  $('td[data-x="0"][data-y="1"]').text(board[3]);
  $('td[data-x="1"][data-y="1"]').text(board[4]);
  $('td[data-x="2"][data-y="1"]').text(board[5]);
  $('td[data-x="0"][data-y="2"]').text(board[6]);
  $('td[data-x="1"][data-y="2"]').text(board[7]);
  $('td[data-x="2"][data-y="2"]').text(board[8]);
};

function doTurn(event) {
  updateState(event);
  if (checkWinner(player()) || checkTie()) {
    saveGame(true);
    resetBoard();
  } else {
    turn += 1;
  };
};

function attachListeners (){
  $('td').on('click', function(event) {
    if ($(event.target).html() == "") {
      event.preventDefault();
      doTurn(event);
    };
  });
  $('button#previous').on('click', function(event) {
    event.preventDefault();
    getPreviousGames();
  });
  $('button#save').on('click', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    saveGame();
  });
  $('li').on('click', function(event){
    event.preventDefault();
    loadGame(event.currentTarget.dataset.gameid);
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
      line_items += "<li data-gameid='" + value.id + "'>" + value.id + "</li>"
    });
    $('#games').html(line_items);
    attachListeners();
  })
};

function saveGame(reset) {
  if (!currentGame) {
    url = "/games";
    method = "POST";
  } else {
    url = "/games/" + currentGame;
    method = "PATCH";
  }
  $.ajax({
    url: url,
    method: method,
    dataType: "JSON",
    data: { game: {state: JSON.stringify(board)} },
    success: function(response) {
      if (reset) {
        resetBoard();
        currentGame = undefined;
      } else {
        currentGame = response.id;
      };
    }
  });
};

function loadGame(id) {
  $.getJSON("/games/" + id).done(function(response){
    board = JSON.parse(response.state)
    currentGame = response.id;
    loadTable();
    analyzePreviousGame();
  });
};
