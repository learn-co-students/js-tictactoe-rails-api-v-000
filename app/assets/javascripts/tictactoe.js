$(function (){
  attachListeners();
});

var currentGame,
    turn = 0,
    method,
    winCombos = [
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]]
  ];

function attachListeners() {
  $('#save').on('click', function(event){
    event.preventDefault();
    saveGame();
  });

  $('#newGame').on('click', function() {
    newGame();
  });

  $("#previous").on('click', function(event) {
    event.preventDefault();
    gameAppender();
  });

  loadGame();

  $("td").on("click", function(event){
    doTurn(this, event);
  });
}

function doTurn(cell, event) {
  turn ++;
  updateState(cell);
  checkWinner();
}

function updateState(cell) {
  $(cell).html(player());
  checkWinner(event);
}

function checkWinner(cell) {

  for (var i = 0; i < winCombos.length; i++) {
    var winner = winCombos[i];

    var currentBoard = [];
    $.each(winner, function(i, position){
      var x = position[0],
          y = position[1],
          board = $('[data-x="' + x +'"][data-y="' + y + '"]').html();

        if (board === player()) {
          currentBoard.push(board);
        }

        if (currentBoard.length === 3) {
          message(player());
        }
    });
  }
}


function newGame() {
    method = "POST";
    turn = 0;
    ++currentGame;
    $('td').each(function(){
      $(this).html('');
    });
}

function message(player) {
  $('#message').html("Player " + player + " Won!");
}

function player() {
  if (turn %2 === 0) {
    return "X";
  } else {
    return "O";
  };
}

function saveGame() {
  var gameBoard = [],
      url = '';

  $('td').each(function() {
    gameBoard.push($(this).text());
  });

  if(method === "PATCH") {
    url = "/games/" + parseInt(currentGame);
  } else {
    url = "/games";
  }

  $.ajax({
    url: url,
    method: method,
    data: {
      game: {
        state: gameBoard
      }
    }
  });
  gameBoard = [];
  gameAppender();
}

function loadGame(){
  $('div#games').on('click', 'button', function(){
    method = "PATCH";
    currentGame = parseInt($(this).attr("data-game"));
    turn = 0;
    $('td').each(function(data){
      if (data.html != ""){
        turn++;
      }
    });
    var state = $(this).attr("data-state");
    var board = state.split(',');
    $('td').each(function(i, val) {
      $(val).html(board[i]);
    });
  });
}

function gameAppender(){
  var gameList = [];
  $.getJSON("/games").done(function(data) {
    gameList = data.games;
    var list = $("#games");
    list.html("");
    gameList.forEach(function(game){
      list.append('<button class="loader" data-game="' + game['id'] + '" data-state="' + game['state'] + '">' + game['id'] + '</button>');
    });
  });
}
