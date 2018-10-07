// Code your JavaScript / jQuery solution here
const win = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [0,4,8], [1,4,7], [2,5,8], [2,4,6]]

turn = 0 
game = 0

$(document).ready(function() {
    attachListeners();
  });

function player() {
    if (turn % 2 === 0){
        return "X";}
    else {
        return "O";}

}

function updateState(spot){
    let move = player();
    $(spot).text(move);
}

function setMessage(string) {
    $("#message").append(string);

}

function checkWinner() {
    let board = {}
    $('td').text((index, spot) => board[index] = spot);

    let winner = false;

    win.forEach(function(combo) { 
            if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        setMessage(`Player ${board[combo[0]]} Won!`);
         winner = true;
        }
    });
    return winner;
}

function doTurn(spot) {
    updateState(spot)
    turn ++;
    if (checkWinner()) {
        saveGame()
        resetBoard();
    } else if (turn === 9) {
        setMessage("Tie game.");
        saveGame();
        resetBoard();
    }

}

function resetBoard() {
    $('td').empty();
    game = 0

    turn = 0 
    
}


function attachListeners() {
    $('td').on('click', function() {
        if (!$.text(this) && !checkWinner()) {
          doTurn(this);
        }
      });

      $('#clear').on('click', () => resetBoard());

      $('#save').on('click', () => saveGame());

      $('#previous').on('click', () => showPreviousGames());
   
}

function saveGame() {
    let board = [];
    
  
    $('td').text((index, spot) => {
      board.push(spot);
    });
  
    let gameContent = { board: board };
  
    if (game) {
      $.ajax({

        type: 'PATCH',
        url: `/games/${game}`,
        data: gameContent
      });

    } else {

      $.post('/games', gameContent, function(thisGame) {
        game = thisGame.data.id;
        $('#games').append(`<button id="gameid-${thisGame.data.id}">${thisGame.data.id}</button><br>`);
        $("#gameid-" + thisGame.data.id).on('click', () => reloadGame(thisGame.data.id));
      });

    }



  }


  
  function showPreviousGames() {
    $('#games').empty();
    $.get('/games', (savedGames) => {
      if (savedGames.data.length) {
        savedGames.data.forEach(reloadPreviousGames);
      }


    });
  }


  
  function reloadPreviousGames(game) {

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
      const state = data.attributes.state;


      const id = data.id;
  
      let index = 0;
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
          index++;
        }


      }
  
      turn = state.join('').length;
      game = id;
  
      if (!checkWinner() && turn === 9) {
        setMessage('Tie game.');
      }
    };
  
    xhr.send(null);



  }
