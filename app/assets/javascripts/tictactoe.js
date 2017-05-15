$(function() {
  attachListeners();
})

var turn = 0
var gameId = 0
const winningCombos = [ [0, 1, 2], [3, 4, 5],[6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ]


//GAME FUNCTIONALITY

function attachListeners() {
  $('td').on('click', function(e) {
    e.preventDefault();
    doTurn(e)
  })
  $('#previous').on('click', function() { //if id previous is clicked, call getAllGames function
    getAllGames();
  })
  $('#save').on('click', function() { //if id save is clicked, call save function
    save();
  })
   $("#games").click(function() {
    //placeholder for now, but can be used to navigate amongst saved games
  })
}

function player() {
  return (turn % 2 === 0) ? "O" : "X"; //if no remainder then x
}

function doTurn(e) {
  turn += 1
  updateState(e)
  checkWinner()
}

var updateState = function(e) {
  $(e.currentTarget).html(player());
}

function checkWinner() {
  var currentPlayer = player()
  var board = getBoard();
  winningCombos.forEach(function(combo) { //iterates over Combos array
    if (board[combo[0]] == currentPlayer && board[combo[1]] == currentPlayer && board[combo[2]] == currentPlayer) {
      message("Player " + currentPlayer + " Won!"); //calls message() based on current player
      clearBoard();

    } else if (turn === 9) {
      clearBoard();
      message("Tie game")
    }
  })
  return false
}

function getBoard() {
  var board = [];
  $td = $("td");
  for (var i=0; i < 9; i++) {
    var cell = $td[i];
    board.push(cell.innerHTML);
    }
  return board;
}

function clearBoard() {
  $("td").html("");
  turn = 0; //restarts games
}

function message(string) {
  $("div#message").text(string) //edited to replace text instead of append
}

function save() { //a good resource for this function is here -> https://stackoverflow.com/questions/14762775/ajax-if-condition
  $.ajax({
      type: (gameId == 0) ? "POST"  : "PATCH",
      url: (gameId == 0) ? "/games" : "/games/" + gameId,
      data: { game: { state: getBoard() }},
      success: function(data) { gameId = data.game.id },
      dataType: "json",
  });
}

function getAllGames() {
  $.getJSON("/games").done(function(response) { //searches index for all games
    showAllGames(response.games) //calls allGames function
  })
}

function showAllGames(games) {
  gamesHtml = '<ul>'
  games.forEach(function(game) { //should add games to games id in DOM
    gamesHtml += showGame(game)
  })
  $("#games").html(gamesHtml)
}

function showGame(game) {
  return '<li><a href="#" data-id=' + game.id + '>' + game.id + '</a></li>'
}
