// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;
const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [2,4,6], [0,4,8]
];

$(document).ready(function() {
  attachListeners();
});

function player() {
  return (turn % 2 === 0) ? "X" : "O";
};

function updateState(square) {
  $(square).text(player());
};

function setMessage(message) {
 $("#message").text(message);
};

function checkWinner() {
  var board = $('td');
  var winner = winningCombos.find((combo) => {
    return combo.every(i => board[i].innerHTML === 'X') || combo.every(i => board[i].innerHTML === 'O');
  });
  if (winner) {
    setMessage(`Player ${board[winner[0]].innerHTML} Won!`);
    return true;
  } else {
    return false;
  };
};

function doTurn(square) {
  if ($(square).html() != "X" && $(square).html() != "O") {
    updateState(square);
    turn++;
  };
  if (checkWinner()) {
    saveGame();
    resetGame();
  }
  else if (tieGame()) {
    setMessage('Tie game.');
    resetGame();
  }
};

function attachListeners() {
  $('td').on('click', function() {
    if(!$.text(this) && !checkWinner() ) {
      doTurn(this);
    };
  });

  $('#save').on('click', () => saveGame());

  $('#previous').on("click", () => previousGames());

  $('#clear').on("click", () => resetGame());
};

function saveGame() {
 var state = [];
 var gameData;
 $('td').text((i, square) => {
   state.push(square);
 });
 gameData = {state: state};
 if(currentGame) {
   $.ajax({
     type: 'PATCH',
     url: `/games/${currentGame}`,
     data: gameData
  });
 } else {
  $.post('/games', gameData, function(game) {
    currentGame = game.data.id;
    });
  };
};

function resetGame() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
};

function previousGames() {
  $("#games").html("");
  $.get('/games', function(data) {
    for(var i = 0; i < data.data.length; i++) {
     $("#games").append(`<button data-id="${data.data[i].id}" onclick="showGame(${data.data[i].id})">Game # ${data.data[i].id}</button>`);
  };
 });
};

function tieGame() {
  if (turn === 9) {
    saveGame();
   return true;
 } else {
    return false;
  };
};

function showGame(id) {
  $('td').each(function() {
    $(this).html("");
  });
  $.get("/games/" + id, function(data) {
    var state = data.data.attributes.state
    var counter = 0;
    for (var i = 0; i < 3; i++) {
      for (var l = 0; l < 3; l++) {
        $("[data-x=" + l + "][data-y=" + i + "]").html(state[counter]);
         counter++;
      };
    };
    currentGame = id;
    turn = state.join('').length;
  });
};
