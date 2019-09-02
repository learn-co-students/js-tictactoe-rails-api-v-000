var turn = 0;
var currentGame = 0;
var COMBOS = [[1,2,3],[4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
var X = [];
var O = [];

$(document).ready(function() {
  startGame()
});

function startGame(){
  console.log("ready")
  attachListeners();
}

function attachListeners(){
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function doTurn(location){
  if (isEmpty(location) && !checkWinner()) {
    updateState(location)
    turn++
  }

  if (checkWinner()) {
    // saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    // saveGame();
    resetBoard();
  }
}

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(location){
  player()
  if (player() === "X"){
    X.push(parseInt(location.id));
    if (!checkWinner()) {
      $(location).text(player())
    } else {
      checkWinner()
    }
  } else if (player() === "O"){
    O.push(parseInt(location.id));
    if (!checkWinner()) {
      $(location).text(player())
    } else {
      checkWinner()
    }
  }
}

function isEmpty(location){
  return location.innerHTML === "";
}

function checkWinner(){
  var winner = false;
    COMBOS.forEach(function(combo){
      let xTest = (X.includes(combo[0]) && X.includes(combo[1]) && X.includes(combo[2]));
      let oTest = (O.includes(combo[0]) && O.includes(combo[1]) && O.includes(combo[2]));
      if (xTest || oTest) {
        setMessage(`Player ${player()} Won!`)
        resetBoard();
        return winner = true;
      }
    });
  return winner
}

function setMessage(string) {
  $('#message').text(string);
}

function resetBoard() {
  $('td').empty();
  turn = 0;
}

function saveGame() {
  var gameState = [];
  var gameData;

  $('td').text((index, location) => {
    gameState.push(location);
  });

  gameData = { state: gameState };

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
      $("#gameid-" + game.data.id).on('click', () => reloadPreviousGame(game.data.id));
    });

  }
}

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(previousGameButton);
    }
  });
}

function previousGameButton(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadPreviousGame(game.id));
}



function reloadPreviousGame(gameID) {
  document.getElementById('message').innerHTML = '';

  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${gameID}`, true);
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText).data;
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
    currentGame = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  };

  xhr.send(null);
}
