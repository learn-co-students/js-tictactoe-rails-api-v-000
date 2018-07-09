// Code your JavaScript / jQuery solution here
var turn = 0
var currentGame = 0
const winners = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,4,8],[2,4,6],
  [0,3,6],[1,4,7],[2,5,8]
];

$(attachListeners);

var setMessage = (text) => $('#message').append(text);

function doTurn(td){
  updateState(td)
  turn++
  if(checkWinner()){
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    clearGame();
  }
}

var player = () => turn % 2 ? "O": "X";

function updateState(td){
  td.innerHTML = player();
}

function checkWinner() {
  let board = {};
  let winner = false;

  $('td').text((i, td) => board[i] = td);
  winners.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`)
      winner = true;
    }
  })
  return winner;
}

function saveGame(){
  let state = $('td').toArray().map(x => x.innerText);
  if (currentGame) {
    $.ajax({
      type: 'patch',
      url: `/games/${currentGame}`,
      data: {state: state}
    });
  } else 
  $.post('/games', {state: state}).done(function(response){
    currentGame = response.data.id
  })
  
}

function previousGames(){
  $("#games").text("");
  $.get('/games', function(games){
    games.data.map(function(game){
    $('#games').append(`<button id="gameid-${game.id}">Game: ${game.id}</button><br>`);
    $("#gameid-" + game.id).click(() => loadGame(game.id));
   })
  })
}

function loadGame(gameid){
  $('#message').text("");
  $.get(`/games/${gameid}`, function(game){
  var state = game.data.attributes.state;
  $("td").text((i,text) => state[i]);
  currentGame = gameid;
  turn = state.join('').length
  checkWinner(); 
})
}

function clearGame() {
  $('td').empty();
  turn = 0
  currentGame = 0
}

function attachListeners() {
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGames());
  $('#clear').on('click', () => clearGame());

  $('td').on('click', function(){
    if($(this).text() == "" && !checkWinner()){
      doTurn(this);
    }
  });
}