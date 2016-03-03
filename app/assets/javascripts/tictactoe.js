$(document).ready(function() {
  attachListeners();
});
  var currentGame = 0
  var turn = 0;
  var winningCombos =[[[0,0],[1,0],[2,0]],
                      [[0,1],[1,1],[2,1]],
                      [[0,2],[1,2],[2,2]],
                      [[0,0],[0,1],[0,2]],
                      [[1,0],[1,1],[1,2]],
                      [[2,0],[2,1],[2,2]],
                      [[0,0],[1,1],[2,2]],
                      [[0,2],[1,1],[2,0]]];


function attachListeners() {
  var table_cell = $('td');
  table_cell.on('click', function(event) {
    var cell = this;
    doTurn(cell, event);
  });
  $('#previous').on('click', function(event) {
    getGames(event);
  });
  $('#save').on('click', function(event){
    saveGames(event);
  });
  $('#games').on('click', function(event) {
    getGame($(event.target).text());
  });
}

function doTurn(cell,event) {
  updateState(cell)

  if ( checkWinner(cell) ) {
    saveGames(event);
    resetBoard();
    return (newGame());
  }
  if ( tie() ) {
    message("Tie game");
    saveGames(event);
    resetBoard();
    return (newGame());
  }
turn++
}

function newGame(){
  turn = 0;
  currentGame++;
}

function resetBoard(){
  $('td').each(function(){
    $(this).html('');
  });
$('#list').empty();
}


function tie(){
  var tieVar = true
  $('td').each(function(){
    if ( $(this).html() == '' ) {
      tieVar = false;
    }
  });
  return tieVar;
}

function checkWinner(cell) {
  for (var count = 0; count < winningCombos.length ; count++) {
    var combo = winningCombos[count];

    if( winningCombo(combo) == true ){
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

function winningCombo(win_combo){
  var takenWinArr = [];
  var answer = false;

  $.each(win_combo, function(i,spot) {
    var x = spot[0];
    var y = spot[1];

    var glanceBoard = $('[data-x="' + x + '"][data-y="' + y + '"]');
    var boardVal = glanceBoard.html();

    if ( boardVal == player() ) {
      takenWinArr.push(glanceBoard[0]);
    }

    if (takenWinArr.length === 3) {
      answer = true;
      return answer;
    }
  });
 return answer;
}

function updateState(cell) {
  if (cell.innerText === ''){
    $(cell).html(player());
  }else{
    console.log("you can't place a token here");
  }
}

function player() {
  if (turn %2 === 0) {
    return "X";
  }else{
    return "O";
  }
}

function message(m) {
  $('#message').text(m);
}

function getGames(event) {
  $.getJSON('/games').done(function(gamesJson) {
    $(gamesJson.games).each(function(gameId){
      $('#list').append('<li>' + (gameId + 1) + '</id>')
    });
  });
}

function saveGames(event) {

  var boardV = []
  var url;
  var method;

  $('td').each(function() {
    boardV.push($(this).text())
  });

  if(currentGame) {
    url = '/games/' + currentGame
    method = 'PATCH'
  }else{
    url = '/games'
    method = 'POST'
  }

    $.ajax({
        url: url,
        method: method,
        data: {
          game: {
            state: boardV
          }
        }
    });

resetBoard();
newGame();

}

function getGame(index) {
  $.getJSON('/games/' + index).done(function(game){
    loadGame(game.state);
  });
  currentGame = index;
}

function loadGame(board) {
  $('td').each(function(i){
    $(this).text( board[i] )
  });
}
