// Code your JavaScript / jQuery solution here
/* <table border="1" cellpadding="40">
	<tr>
		<td data-x="0" data-y="0"></td>
		<td data-x="1" data-y="0"></td>
		<td data-x="2" data-y="0"></td>
	</tr>
	<tr>
		<td data-x="0" data-y="1"></td>
		<td data-x="1" data-y="1"></td>
		<td data-x="2" data-y="1"></td>
	</tr>
	<tr>
		<td data-x="0" data-y="2"></td>
		<td data-x="1" data-y="2"></td>
		<td data-x="2" data-y="2"></td>
	</tr>
</table> */

// let turn = 0; 
// let currentGame = 0; 

// $(document).ready(function() {
//     attachListeners();
//   });

var turn = 0;
var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

function player() {
    if (turn % 2 === 0) {
        return 'X';
    } else {
        return 'O';
    }    
}

function updateState(square) {
    let token = player(); 
    $(square).text(token); 
}

function setMessage(string) {
    $('#message').append(string);
}

function checkRow(a, b, c) {
     if (a === 'X' && b === 'X' && c === 'X') {
        return 1; 
    } else if (a === 'O' && b === 'O' && c === 'O') {
        return -1;
    } else {
        return 0;
    }
}

function checkWinner() {
    let board = {};
    let winner = false; 

    $('td').text((index,square) => board[index] = square);
    
    let result = checkRow(board[0], board[1], board[2])
        + checkRow(board[3], board[4], board[5])
        + checkRow(board[6], board[7], board[8])
        + checkRow(board[0], board[3], board[6]) 
        + checkRow(board[1], board[4], board[7])
        + checkRow(board[2], board[5], board[8])
        + checkRow(board[0], board[4], board[8]) 
        + checkRow(board[2], board[4], board[6]); 
     
    if (result === 1) {
        setMessage("Player X Won!");
        winner = true; 
    } else if (result === -1) {
        setMessage("Player O Won!");
        winner = true;
    } else {
        winner = false; 
    } 

    return winner; 
}

function doTurn(square){
    updateState(square);
    turn++;

    if (checkWinner()){
        saveGame();
        resetBoard();
    } else if (turn === 9) {
        setMessage("Tie game.");
        saveGame();
        resetBoard();
    }
}

function resetBoard() {
    $('td').empty();
    turn = 0;
    currentGame = 0;
  }

function attachListeners() { 
    $('td').on('click', function() {
      if(!$.text(this) && !checkWinner()){
          doTurn(this);
      }
    });

    $('#save').on('click', () => saveGame());
    $('#previous').on('click', () => showPreviousGames());
    $('#clear').on('click', () => resetBoard());
  }

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
        setMessage("Tie game.");
      }
    };
  
    xhr.send(null);
  }