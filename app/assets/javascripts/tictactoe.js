// Code your JavaScript / jQuery solution here
var turn = 0
var currentGame = 0;
const   WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ]

var player = function(){
    return turn % 2 ? "O" : "X";
};

function updateState(square){
$(square).text(player());
};

function setMessage(string){
    $(message).text(string);
};

function checkWinner(){
    var board = {};
    var winner = false;
    $('td').text((index, square) => board[index] = square);
    WIN_COMBINATIONS.forEach(function(combo) {
        if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
          setMessage(`Player ${board[combo[0]]} Won!`);
          return winner = true;
        }
      });
    
    return winner;
};

function doTurn(square){
    updateState(square)
    turn++;
    if (checkWinner()){
        saveGame();
        resetBoard();
    } else if (turn === 9){
        setMessage("Tie game.");
        saveGame();
        resetBoard();
    };
};

function saveGame() {
    var state = [];
    var gameData;
  
    $('td').text((index, square) => {
      state.push(square);
    });
  
    gameData = { state: state };
  
    if (currentGame) {
      $.ajax({
        type: 'PATCH',
        url: `/games/${currentGame}`,
        data: gameData
      });
    } else {
      $.post('/games', gameData, function(game) {
        currentGame = game.data.id;
        $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
        $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
      });
    }
  }

  function resetBoard(){
      $('td').empty();
      turn = 0;
      currenGame = 0
  }