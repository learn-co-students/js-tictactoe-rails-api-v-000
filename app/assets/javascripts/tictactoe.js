// Code your JavaScript / jQuery solution here

WIN_COMBINATIONS = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
]

var turn = 0;
let gameId = 0;
let currentBoard = ['', '', '', '', '', '', '', '', ''];

$(function(){
  attachListeners();
});

function player() {
  return turn % 2 ? 'O' : 'X';
}

function updateState(square) {
  const token = player();
  $(square).text(token);
}


function setMessage(message) {
  $('#message').html(`<p>${message}</p>`);
}


function checkWinner() {
  $('td').each(function(index) {
    currentBoard[index] = $(this).text();
  });
  gameWon = WIN_COMBINATIONS.find(function(combo){
     return currentBoard[combo[0]] === currentBoard[combo[1]] &&
            currentBoard[combo[1]] === currentBoard[combo[2]] &&
            currentBoard[combo[0]] !== ''});
  if (gameWon) {
    setMessage(`Player ${currentBoard[gameWon[0]]} Won!`);
    return true;
  } else {
    return false;
  }
}

function resetBoard() {
  turn = 0;
  gameId = 0;
  $('td').empty();
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (!currentBoard.includes('')) {
    setMessage('Tie game.');
    saveGame();
    resetBoard();
  }
}

function saveGame() {
if (gameId) {
    $.ajax({
      method: 'patch',
      url: `/games/${gameId}`,
      headers: {
        contentType: 'application/json',
        dataType: 'application/json'
      },
      data: {
        state: currentBoard
      }
    }).done((res) => {
      resetBoard();
    })
  } else {
    var posting = $.post( '/games', { state: currentBoard} );
    posting.done(function(res){
      const data = res.data;
      gameId = data.id
    })
  }
}

function previousGames() {
  $('#games').empty();
  $.get('/games', (res) => {
    const games = res.data;
    for (game of games) {
      $('#games').append(`<button id=gameid-${game.id}>${game.id}</button>`)
      $(`#gameid-${game.id}`).on('click', (e) => { 
        reloadGame($(e.target).text());
      })
    }
  })
}

function attachListeners() {
  $('td').click(function(){
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').click(function(){
    saveGame();
  })

  $('#previous').click(function(){
    previousGames();
  })

  $('#clear').click(function(){
    resetBoard();
  })

}

function reloadGame(gameCount) {
  document.getElementById('message').innerHTML = '';

  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${gameCount}`, true);
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
    gameId = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  };

  xhr.send(null);
}

