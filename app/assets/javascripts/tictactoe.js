var turn = 0
var currentGame = 0
const WIN_COMBO = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,4,8],[2,4,6],
  [0,3,6],[1,4,7],[2,5,8]
];

$(attachListeners);

function attachListeners() {
  $('#save').on('click', function(e) {
    saveGame();
  });
  $('#previous').on('click', function(e) {
    previousGames();
  });
  $('#restart').on('click', function(e) {
    restartGames();
  });
  $('td').on('click', function() {
    if($(this).text() == "" && !checkWinner()){
      doTurn(this);
    }
  });
}

function setMessage(message) { $('#message').append(message);
}

function doTurn(td){
  updateState(td)
  turn++
  if(checkWinner()){
    saveGame();
    restartGame();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    restartGame();
  }
}

function player() {
  if (window.turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}
function updateState(td){
  td.innerHTML = player();
}

function checkWinner() {
  let board = {};
  let winner = false;

  $('td').text((i, td) => board[i] = td);
  WIN_COMBO.some(function(pos) {
    if (board[pos[0]] !== "" && board[pos[0]] === board[pos[1]] && board[pos[1]] === board[pos[2]]) {
      setMessage(`Player ${board[pos[0]]} Won!`)
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

function restartGame() {
  $('td').empty();
  turn = 0
  currentGame = 0
}
