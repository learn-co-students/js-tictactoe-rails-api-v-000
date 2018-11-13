// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

//X , Y
// const LABELS = {[0,0]: 1, [1,0]: 2, [2, 0]: 3, [0,1]: 4, [1,1]: 5, [2,1]: 6,
//                 [0,2]: 7, [1,2]: 8, [2,2]: 9};
var turn = 0;
var currentGame = 0;

function player(){
  if (turn % 2 == 0){
    return 'X';
  }else{
    return 'O';
  };
};


function updateState(square){
    var token = player();
    $(square).text(token);
}

function setMessage(msg){
  $('div#message').html(msg);
}

function checkWinner(){
  var board = {};
  $('td').text((index, square) => board[index] = square);

    return WINNING_COMBOS.some(function(combo) {
      if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        setMessage(`Player ${board[combo[0]]} Won!`);
        return true;
      }else{
        return false;
      }
    });
  }

  function doTurn(move){
    updateState(move);
    var win = checkWinner();
    turn++;

    if(turn === 9 && win){
      setMessage("Tie game.");
    }else if(win){
      saveGame();
      $('td').empty();
      turn = 0;
      currentGame = 0;
    }
  }

  function saveGame() {
  var state = [];

  $('td').text((index, square) => {
    state.push(square);
  });

  var gameinfo = { state: state };

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameinfo
    });
  } else {
    $.post('/games', gameinfo, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}
