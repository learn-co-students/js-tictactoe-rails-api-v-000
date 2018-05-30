// Code your JavaScript / jQuery solution here
var WIN_COMBOS = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

var turn = 0;
var currentGame = 0;
var currentState = ['','','','','','','','',''];
var player = () => turn % 2 ? 'O' : 'X';

$(function() {
  attachListeners();
});

function updateState(square) {
  $(square).text(player())
}

function setMessage(string) {
  $('#message').append(string);
}

function checkWinner() {
  let winner = false;
  $('td').each(function(index) {
    currentState[index] = $(this).text();
  });
  winner = WIN_COMBOS.find(function(combo){
     return currentState[combo[0]] === currentState[combo[1]] &&
            currentState[combo[1]] === currentState[combo[2]] &&
            currentState[combo[0]] !== ''});
  if (winner) {
    setMessage(`Player ${currentState[winner[0]]} Won!`);
    return true;
  } else {
    return false;
  }
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
  $('#save').click(function(e) {
    saveGame();
  });
  $('#previous').click(function(e) {
    previousGames();
  });
  $('#clear').click(function(e) {
    clearBoard();
    $('#message').empty();
  });


  $('div#games').click(function(e) {
    currentGame = e.target.innerHTML
    loadGame();
    e.preventDefault();
  });
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearBoard();
  } else if (!currentState.includes('')) {
    setMessage('Tie game.');
    saveGame();
    clearBoard();
  }
}

function saveGame() {
  if (currentGame === 0) {
    $.post( '/games', { 'state[]': currentState }, function(json) {
      currentGame = parseInt(json.data['id']);
    });
  } else {
    $.ajax( {
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: { _method:'PUT', 'state[]': currentState },
      dataType: 'json'
    });
  }
}

function previousGames() {
  $.get( '/games', function( json ) {
    let $games = $('#games')
    $games.html('');
    json.data.forEach(function(game) {
      $games.append(`<button id='gameid-${game.id}'>${game.id}</button><br>`)
    });
  });
}

function loadGame() {
  $.get( `/games/${currentGame}`, function( json ) {
    let index = 0;
    $('td').each(function () {
      this.innerHTML = json.data.attributes['state'][index];
      currentState[index] = [index];
      index++;
    })
    turn = json.data.attributes['state'].join('').length;
  });
}

function clearBoard() {
  $('td').each(function () {
    this.innerHTML = ''
  })
  turn = 0;
  currentGame = 0;
}
