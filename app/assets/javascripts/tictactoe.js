// Code your JavaScript / jQuery solution here
const WIN_COMBOS = [
  [0, 1, 2], [0, 3, 6], [0, 4, 8],
  [3, 4, 5], [1, 4, 7], [6, 4, 2],
  [6, 7, 8], [2, 5, 8]
];
var turn = 0;
var gameId = 0;


$(document).ready(function(){
  attachListeners();
});

function attachListeners(){
  $('td').click((e) => { if(!$(e.target).text() && !checkWinner()) { doTurn(e.target) } })
  $('#save').click(() => {saveGame()})
  $('#previous').click(() => {previousGames()})
  $('#clear').click(() => {resetBoard()})
}

function player(){
  return turn % 2 === 0 ? 'X' : 'O';
}

function updateState(element){
  var token = player();
  $(element).text(token);
}

function setMessage(message){
  $("#message").text(message);
}
;
function checkWinner(){
  var board = $('td').map((index, target) => { return $(target).text(); });
  var won = false;

  WIN_COMBOS.forEach((combo) => {
    if(board[combo[0]] !== '' && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
      setMessage(`Player ${board[combo[0]]} Won!`);
      won = true;
    }
  });
  return won;
}

function doTurn(element){
  updateState(element);
  turn++;
  if (turn == 9 && checkWinner() === false){
    setMessage('Tie game.')
    saveGame();
    resetBoard();
  }else if (turn <= 9 && checkWinner() === true) {
    checkWinner();
    saveGame();
    resetBoard();
  };
}


function saveGame() {
  let board = [];
  $('td').each((index, target) => { board[index] = $(target).text(); })
  //var board = $('td').map((index, target) => { return $(target).text(); });

  if(gameId) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      data: {state: board}
    });
  } else {
    //can use $.post but wanted to keep the formatting the same within this function
    $.ajax({
      type: 'POST',
      url: `/games`,
      data: {state: board}
    }).done((info) => {
      gameId = info.data.id;
      $('#games').append(`<button id="gameid-${gameId}">${gameId}</button><br>`);
      $("#gameid-" + gameId).click(() => loadGame(gameId));
    });
  }
}

function resetBoard(){
  $('td').empty();
  turn = 0;
  gameId = 0;
}

function loadGame(id){
  $.get(`/games/${id}`,  {
  }).done((info) => {
    var state = info.data.attributes.state;
    $('td').map((index, target) => {$(target).text(state[index]); })
    turn = state.join('').length;
    gameId = info.data.id;
  });
}

function previousGames(){
  $('#games').empty();
  $.get('/games', {
  }).done((info) => {
    info.data.forEach(function(gameEntry){
      $('#games').append(`<button id="gameid-${gameEntry.id}">${gameEntry.id}</button><br>`);
      $("#gameid-" + gameEntry.id).click(() => loadGame(gameEntry.id));
    });
  })
}
