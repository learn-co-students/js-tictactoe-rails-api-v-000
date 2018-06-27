//  Code your JavaScript / jQuery solution here
$(document).ready(function(){
  attachListeners();
});

const WINNING_COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

var turn = 0;
var currentGame = 0;
var url = '/games'


function attachListeners(){
  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()){
      doTurn(this);
    }
  });
  $('#save').on('click', () => saveGame());
  $('#previus').on('click', () => previousGame());
  $('#clear').on('click', () => clearGame());
}

function player() {
  return turn % 2 === 0 ? "X" : "O"
}

function updateState(square) {
  var currentPlayer = player();
  $(square).text(currentPlayer);
}

function setMessage(message){
  $('#message').text(message);
}

function checkWinner(){
  var board = {};
  var winner = false;
  //board is an empty object

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(position){
    if (board[position[0]] !== "" && board[position[0]]  === board[position[1]] && board[position[1]] === board[position[2]]){
      setMessage(`Player ${board[position[0]]} Won!`);
      return winner = true;
    }
  });
  return winner;
}

function doTurn(square){
  updateState(square);
  turn++;
  if (checkWinner()){
    saveGame();
    clearGame();
  }else if(turn === 9){
    setMessage("Tie game.");
    saveGame();
    clearGame();
  }
}

function saveGame(){
  let state = [];
  let gameData = {};
  let url = '/games';

  //get board and put into an Array
  $('td').text(function(index, square) {
    state.push(square);
  });

  //put array into our gameData object
  gameData = {state: state};

  //save current state of game
  //save data and send in ajax request
  if (currentGame === 0){
    $.post(url, gameData, function(game){
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', function(){
        loadGame(game.data.id)
      });
    });
    //if game is already saved in DB
  } else {
    $.ajax({
      type: 'PATCH',
      url: `${url}/${currentGame}`,
      data: gameData
    });
  }
}


function previousGames(){
  // need the button to send GET request to the /games route
$('#games').empty();
$.get(url, {}, function(games){

})
}


function loadGame(){

}

function clearGame(){
  $('td').empty();
  turn = 0;
  currentGame = 0;
}
