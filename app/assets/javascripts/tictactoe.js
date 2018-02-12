// Code your JavaScript / jQuery solution here
const WINNING_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var gameID = "0";

$(document).ready(function() {
 attachListeners();
});

var player = () => turn % 2 ? 'O' : 'X';

function attachListeners(){
  $("td").on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
    //console.log(this);
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function updateState(position) {
  // console.log(gameID);
  var token = player();
  $(position).text(token)
}

function doTurn(position) {
  // console.log("doturn"+ gameID);
  updateState(position);
  turn ++;

  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function checkWinner() {
  board = {};
  var winner = false;
// console.log("checkWinner" + gameID);
  $('td').text((ind, position) => board[ind] = position);

  WINNING_COMBINATIONS.some(function(combination) {
    if(board[combination[0]] !== "") {
      if(board[combination[0]] === board[combination[1]] && board[combination[1]] === board[combination[2]]) {
        setMessage(`Player ${board[combination[0]]} Won!`);
        return winner = true;
      }
    }
  });
  // console.log("checkWinner end" + gameID);
  return winner;
}

function setMessage(msg) {
  $('#message').text(msg);
  // console.log("setMessage" + gameID);
}

function addGame(game){
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => loadGame(game.id));
  // console.log("addgame" + gameID);
}

function showPreviousGames() {
  // console.log("showPreviousGames" + gameID);
  $('#games').empty()
  $.get('/games', (previousGames) => {
    if (previousGames.data.length) {
      previousGames.data.forEach(addGame);
    }
  });
}

function loadGame(clickedID) {
  // console.log("loadgame" + clickedID + "game id is " + gameID);
  document.getElementById('message').innerHTML = '';
  const resp = new XMLHttpRequest;
  resp.overrideMimeType('application/json');
  resp.open('GET', `/games/${clickedID}`, true);
  resp.onload = () => {
    const data = JSON.parse(resp.responseText).data;
    const id = data.id;
    const state = data.attributes.state;
    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
  }

  turn = state.join('').length;
  //gameID = id;
  //var tempid = gameID;
  gameID = id;

  // console.log("game id set to " + gameID + "from" + tempid);
  if (!checkWinner() && turn === 9) { setMessage('Tie game.');}

 };
 // console.log("loadgame end" + gameID);
 resp.send(null);
}

function saveGame() {
  var state = [];
  // console.log("this is game id start savegame" + gameID);
  $('td').text((ind, position) => { state.push(position)});

  var gameState = {state: state};
  if (gameID !== "0") {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameID}`,
      data: gameState
    });
  } else {
    $.post('/games', gameState, function(game) {
      gameID = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => loadGame(game.data.id));
    });
  }
  // console.log("savegame" + gameID);
}

function resetBoard() {
  // console.log("resetting board" + gameID);
  turn = 0;
  gameID = "0";
  $('td').empty();
}
