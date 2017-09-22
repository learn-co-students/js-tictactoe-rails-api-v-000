// Code your JavaScript / jQuery solution here
$(document).ready(function() {
  window.attachListeners();
});

const WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ];


 // [[[0,0],[1,0],[2,0]],
 // [[0,1],[1,1],[2,1]],
 // [[0,2],[1,2],[2,2]],
 // [[0,0],[1,1],[2,2]],
 // [[0,0],[0,1],[0,2]],
 // [[2,0],[2,1],[2,2]],
 // [[1,0],[1,1],[1,2]],
 // [[2,0],[1,1],[0,2]]];

var turn = 0;
var gameID = undefined;

function attachListeners() {
  $('td').on('click', function(){
    if (!checkWinner()) {
      window.doTurn(this);
    }
  });


  $('#previous').on('click', function(){
    previousBoard();
  });
  $('#save').on('click', function(){
    saveBoard();
  });
  $('#clear').on('click', function(){
    clearBoard();
  });

}

function player() {
  return (turn % 2) ? "O" : "X";
}

function doTurn(cell) {
  //increment turn by one
  if ($(cell).is(':empty')) {
    window.updateState(cell);
    turn += 1;
    if (window.checkWinner()) {
      window.checkWinner();
      saveBoard();
      clearBoard();
    } else if (turn === 9) {
      window.message("Tie game.");
      saveBoard();
      clearBoard();
    };
  }
}

function updateState(cell) {
  $(cell).text(window.player())
}

function message(string) {
  $("#message").html(string);
}

function checkWinner() {
  // true if win combination, false if not. if true, invoke a message and pass on "Player X Won!" or "Player O Won!" return WIN_COMBINATIONS
  //board
  var board = [];
  $('td').each(function() {
    board.push($(this).text());
  });
  function combo(win_combination) {
    if (board[win_combination[0]] == board[win_combination[1]] && board[win_combination[0]] == board[win_combination[2]] && (board[win_combination[0]] === "X" || board[win_combination[0]] === "O")) {
      window.message(`Player ${board[win_combination[0]]} Won!`)
      return true
    } else {
      return false
    }
  };
  if (WIN_COMBINATIONS.find(combo)) {
    return true
  } else {
    return false
  }

}


function clearBoard() {
  $('td').text('');
  turn = 0;
  gameID = undefined;
}

function previousBoard() {
  $("#games").text('');
  $.ajax({
    method: 'GET',
    url: '/games'
  }).done(function(resp){
    var previousGames = ""
    resp.data.forEach(function(oldgame){
      $("#games").append('<button class="old">' + oldgame.id + '</button>')
    });
    $('.old').on('click', function(){
      $.ajax({
        method: 'GET',
        url: '/games/' + this.textContent
      }).done(function(resp){
        clearBoard;
        var board = [];
        gameID = resp.data.id
        board = resp.data.attributes.state
        $('td').each(function(i){
          this.innerHTML = (board[i])
          if (board[i] === "X" || board[i] === "O") {
            turn ++;
          }
        });
      });
    });
  });
}

function saveBoard() {
  var board = [];
  $('td').each(function() {
    board.push($(this).text());
  });
  if (gameID) {
    $.ajax({
      method: 'PATCH',
      url: '/games/' + gameID,
      data: { state: board}
    })
  } else {
    $.ajax({
      method: 'POST',
      url: '/games',
      data: { state: board}
    }).done(function(resp) {
      gameID = resp.data.id
    })
  }

}
