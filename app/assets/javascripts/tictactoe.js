var turn = 0;
var currentGame = 0;

$(document).ready(function(){
  attachListeners();
});

function attachListeners(){
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previous());
  $('#clear').on('click', () => clearBoard());
}

function doTurn(td){
  if (turn == 0){message("");}
  updateState(td);
  turn += 1;
  if (checkWinner()){
    saveGame();
    clearBoard();
  }
  else if (turn == 9){
    message("Tie game.");
    saveGame();
    clearBoard();
  }
}

function updateState(td){
  var token = player();
  $(td).text(token);
}

function saveGame(){
  var gameState = { state: board([],0) }

  if (currentGame == 0) {
  //not a saved game
    $.ajax({
      method: 'POST',
      url: `/games`,
      data: gameState,
      success: function(result){
        currentGame = result.data.id;
      }
    });
  }
  else{
    //previously saved game
    $.ajax({
      method: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameState
    });
  }
}

var previous = function() {
// function previous(){
  $.get('/games', function(data){
    var list = data.data.map(function(game){
      return $(
        `<button><li class="game" data-id="${game.id}">${game.id}</li></button>`
      ).on('click', () => reloadGame(game.id));
    });
    $('#games').html(list);
  });
};

function reloadGame(id){
  $.get('/games/' + id, function(data) {
    currentGame = id;
    state = data.data.attributes.state;
    board(state, 1);
    turn = state.join("").length;
    checkWinner();
  });
}

function clearBoard(){
  turn = 0;
  currentGame = 0;
  $("td").html('');
}

//update = 1 : 0
//1 means update the board with given array
//0 means scrape the board and get the current state in Array
function board(stateArray, update){
  $("td").each(function(index){
    update == 1 ?  $(this).text(stateArray[index]) : stateArray.push($(this).text());
  });
  return stateArray;
}

function player(){
  return turn % 2 == 0 ? "X" : "O";
}

var message = function(str){
  $('#message').html(str);
}

function checkWinner(){
  const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                          [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

  current_board = board([],0);
  let result = false;
  WINNING_COMBOS.forEach(function(win_combo){
    if (current_board[win_combo[0]] == current_board[win_combo[1]] && current_board[win_combo[0]] == current_board[win_combo[2]] && current_board[win_combo[0]] != ""){
      message(`Player ${current_board[win_combo[0]]} Won!`);
      result = true;
    }
  });
  return result;
}
