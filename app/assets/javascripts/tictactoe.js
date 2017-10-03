const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
let turn = 0;
let currentGame = 0;
let player = () => turn % 2 ? 'O' : 'X';
let status = 'playing'

function doTurn(square){
  updateState(square);
  turn++;
  setMessage(`Make a Selection`);
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9){
    setMessage(`Tie game.`);
    saveGame();
    resetBoard();
  }
};

function resetBoard(){
  $('td').empty();
  turn = 0;
  currentGame = 0;
  status = 'playing';
  setMessage(`Welcome to Tic Tac Toe!`);
};

function attachListeners(){
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }

  });
  setMessage(`Welcome to Tic Tac Toe!`);
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
};

function checkWinner(){
  let board = {};
  let winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo) {
   if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
    setMessage(`${board[combo[0]]} Won!`);
     return winner = true;
     status = 'game over';
   }
 });
}

function updateState(square){
  if (status === 'game over') {
    $(square).text(function(event){
      event.preventDefault();
    });
  } else {
    $(square).text(player());
  }
};

 function setMessage(message){
   $('#message').text(message);
 };

 function saveGame(){
   let state = [];
   let gameData;

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
 };



 function showPreviousGames(){

 };

 function reloadGame(){

 };

 $(document).ready(function() {
   attachListeners();
 });
