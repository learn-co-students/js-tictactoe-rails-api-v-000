// Code your JavaScript / jQuery solution here
var gameNumber = 0;
var turn = 0;
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8],
                        [0,3,6], [1,4,7], [2,5,8],
                                [0,4,8], [2,4,6]];

$(document).ready(function() {
  attachListeners();
});

function doTurn(value){
  updateState(value)
  turn++;
   if (checkWinner() === false){
     if (self.turn > 7){
       setMessage("Tie game.")
       saveGame();
       resetBoard();
     }
   }else if (checkWinner()) {
     saveGame();
     resetBoard();
   };
}

function resetBoard(){
  turn = 0
  gameNumber = 0
  $('td').empty();
}

function player(){
  let turnCount = this.turn
  if (!turnCount || turnCount % 2 === 0){
    return "X"
  } else {
    return "O"
  }
}

function updateState(location){
     $(location).append(player())
}

function setMessage(string){
  $('div#message').append(string);
}

function attachListeners(){
  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => loadPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function saveGame(){
  var savedGame = [];
  var gameData;

  $('td').text((index, square) => {
    savedGame.push(square);
  });

  gameData = {savedGame: savedGame};

  if (gameNumber) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameNumber}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      gameNumber = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}

function loadPreviousGames() {
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

function checkWinner(){
  let token = player();
  let board = [$("td").eq(0).text(),$("td").eq(1).text(),$("td").eq(2).text(),
               $("td").eq(3).text(),$("td").eq(4).text(),$("td").eq(5).text(),
               $("td").eq(6).text(),$("td").eq(7).text(),$("td").eq(8).text()]
  let winner = false;
  WINNING_COMBOS.some(function(element){
    if (board[`${element[0]}`] !== "" && board[`${element[0]}`] === board[`${element[1]}`] && board[`${element[1]}`] === board[`${element[2]}`]) {
      setMessage(`Player ${board[`${element[0]}`]} Won!`);
      return winner = true;
    }
    });
      return winner
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
      gameNumber = id;

      if (!checkWinner() && turn === 9) {
        setMessage('Tie game.');
      }
    };

    xhr.send(null);
  }
