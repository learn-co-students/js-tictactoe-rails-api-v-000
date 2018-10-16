
var turn = 0
var gameId = 0
var winCombos = [
[0,1,2], [3,4,5], [6,7,8],
[0,4,8], [2,4,6], [0,3,6],
[1,4,7], [2,5,8] ]

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
    $('td').on('click', function() {
      if (checkWinner() === false){
        doTurn(this)
      }
    })
    $('#save').on('click', () => saveBoard())
    $('#previous').on('click', () => previousBoard())
    $('#clear').on('click', () => clearBoard())
}

function doTurn(element){
  if (element.textContent === "") {
    updateState(element);
    turn += 1;
  }
  if (checkWinner() === true) {
    saveBoard();
    clearBoard();
  } else if (turn === 9){
    setMessage('Tie game.')
    saveBoard();
    clearBoard();
    return 'tie';
  }
}

function updateState(element){
  token = player();
  element.textContent = token;
}

function checkWinner() {
  let winner = false;
  let board = getState();
  winCombos.forEach(function(combo){
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  })
  return winner;
}

function getState(){
  let state = []
  let squares = document.querySelectorAll('td');
  squares.forEach(function(square) {
    state.push(square.textContent)
  })
  return state
}

function saveBoard() {
  var state = {state: getState()}
  if (gameId === 0) {
    $.post('/games', state, function(game) {
      gameId =  game.data.id;
      $('#games').append(`<p>${gameId}</p>`);
    })
  } else {
      $.ajax({
        type: 'PATCH',
        url: `/games/${gameId}`,
        data: state
      });
    }
}

function previousBoard() {
  $('#message').empty();
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(showHistory);
    }
  });
}

function showHistory(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => loadGame(game.id));
}

function loadGame(id) {
  $.get(`/games/${id}`, function(data) {
    gameId = data.data.id
    let board = data.data.attributes.state
    turn = board.join("").length
    i = 0
    board.forEach((el) => {$('td')[i].innerHTML = el, i++})
  })
}

function clearBoard() {
  $('td').empty();
  turn = 0;
  gameId = 0;
}

function player(){
  if (turn % 2 === 0){
    return "X";
  } else {
    return "O";
  }
}

function setMessage(string){
  $('#message').text(string)
}
