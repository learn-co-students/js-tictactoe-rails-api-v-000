// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;

$(document).ready(() => {
    attachListeners();
});

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

var player = () => turn % 2 === 0 ? 'X' : 'O';

function updateState(cell){
    var token = player();
    $(cell).text(token);
}

function setMessage(message){
    $('#message').html(message);
}

function checkWinner(){
    var squares = $('td');
    const board = Array.from(squares).map(square => square.innerHTML);

    var combos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    for (var i = 0; i < combos.length; i++){
        if(board[combos[i][0]] === board[combos[i][1]] && board[combos[i][0]] === board[combos[i][2]] && board[combos[i][0]] !== ''){
            setMessage('Player ' + board[combos[i][0]] + ' Won!');
            return true;
        }
    }
    return false;
}

function doTurn(cell){
    updateState(cell);
    turn++;

    if(checkWinner()) {
        saveGame();
        resetBoard();
    } else if (turn === 9) {
        setMessage('Tie game.');
        saveGame();
        resetBoard();
    } 
}

function resetBoard(){
    $('td').text('');
    turn = 0;
    currentGame = 0;
}

function attachListeners(){
    var s = $('td');
    for (var i = 0; i < s.length; i++){
        s[i].addEventListener('click', function(e){
            if (!$.text(this) && !checkWinner()) {
                doTurn(e.target)
            }
        }, false);
    }

    $('#save').on('click', () => saveGame());
    $('#previous').on('click', () => showPreviousGames());
    $('#clear').on('click', () => resetBoard());
}

function showPreviousGames() {
    $('#games').empty();
    $.get('/games', (savedGames) => {
      if (savedGames.data.length) {
        savedGames.data.forEach(buttonizePreviousGame);
      }
    });
  }
  
  function buttonizePreviousGame(game) {
    $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
    $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
  }
  
  function reloadGame(gameID) {
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