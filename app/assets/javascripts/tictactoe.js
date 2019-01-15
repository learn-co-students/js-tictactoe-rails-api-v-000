// GAME SETUP

const WINNING_COMBOS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
    ]

    var turn = 0;
    var currentGame = 0;
$(document).ready(function() {
    attachListeners();
    });



//REQUIRED FUNCTIONS
//Identify player
//Update board in browser with player token 
// determine whether the game is over, is there a winner?

var player = function() {
    if (turn % 2) {
        return "O"
    } else {
        return "X"
    }
} 


function updateState(square) {   
   $(square).text(player());
}


function checkWinner() {
// set variable that will hold the current state of the board
let board = {}
let counter = 0
let winner = false 

// convert square values to an array so that they can be compared to winCombinations 
$('td').each(function() {
  board[counter] = $(this).text()
  counter++
});
// check that each winning index combination is not empty AND contains the same value 
// check for winning combination and if present change winner variable to equal true
WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    } 
  });
return winner;
}

//Generic function to display message in html element with id message
function setMessage(string) {  
    $('#message').append(string);
}



function doTurn(square) {
    updateState(square);
    turn++;
    if (checkWinner()) {
      saveGame();
      resetBoard();
    } else if (turn === 9) {
      setMessage("Tie game.");
      saveGame();
      resetBoard();
    }
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

function resetBoard() {
    //clear board and reset turn to 0 
    $('td').empty();
    turn = 0;
    currentGame = 0;
}

function attachListeners() {
    $('td').on('click', function() {
      if (!$.text(this) && !checkWinner()) {
        doTurn(this);
      }
    });
  
    $('#save').click(saveGame);
    $('#previous').click(showPreviousGames);
    $('#clear').click(resetBoard);
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
    $('#message').text = '';
//    document.getElementById('message').innerHTML = '';
  
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