// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;

var  winCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

function player() {
  return turn %2 === 0 ? 'X':'O';
}

function updateState(cell) {
  cell.innerHTML = player();
}

function setMessage(string) {
  $('div#message').html(string);
}


function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  winCombinations.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

function doTurn(square){
  updateState(square)
  turn++
  if(checkWinner()){
    saveGame();
    resetBoard()
  } else if(turn === 9){
    setMessage('Tie game.')
    saveGame();
    resetBoard()
  }
}

function resetBoard(){
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

$(document).ready(function(){
  attachListeners()
});

function attachListeners() {
  $("tbody td").click(function() {
    if(!$.text(this) && !checkWinner()){
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function saveGame() {
  var board = [];
  var tds = $('td').toArray();
  tds.forEach(function(td) {
    board.push(td.innerHTML)
  })
  if(currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: {state: board}
    })
  } else {
    $.post('/games', {state: board}).done(function(data) {
      currentGame = data.data['id'];
    })
  }
}

function showPreviousGames() {
  $("#games").empty();
  $.get('/games', function(savedGames) {
    if(savedGames.data.length) {
      savedGames.data.forEach(makeButtons);
    }
  })
}

function makeButtons(game) {
  $('#games').append(`<button id="${game.id}">${game.id}</button><br>`);
  $(`#${game.id}`).on('click', function() {
    reloadGame(this);
  })
}

function reloadGame(button) {
  $.get('/games/'+button.id, function(response) {
    var index = 0;
    currentGame = button.id;
    turn = 0
    response.data.attributes.state.forEach(function(el) {
      console.log($('td')[index]);
      $('td')[index].innerHTML = el;
      index++;
      if(el === "X" || el === "O") {
        turn++;
      }
    })
  })
}
