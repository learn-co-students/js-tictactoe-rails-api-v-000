const board = []
const turn = 0
win_combos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,4,8],
  [1,4,7],
  [2,5,8],
  [0,3,6],
  [2,4,6]
]

$(document).ready(function() {
  attachListeners()
});


function player() {
  if (turn % 2 === 0) {
    return 'X'
  }  else {
      return 'O'
  }
};

function updateState(element) {
  element.innerHTML = player()
};

function setMessage(string) {
  $("#message").html(string)
};

function checkWinner() {
  var board = [];
  var winner = false

  $('td').text((index, square) => board[index] = square);

win_combos.some(function (combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

function resetBoard() {
  turn = 0
  let tds = document.querySelectorAll("td")
  for(i = 0; i < tds.length; i++) {
    tds[i].innerHTML = ""
  }
}

function doTurn(element){
 updateState(element);
  turn++;
  if(checkWinner()){
   saveGame();
   clearGame();
  }else if(turn === 9){
   setMessage("Tie game.")
   saveGame();
   clearGame();
  }
}

function attachListeners(){
  $("td").on("click", function(){
  if($(this).text() == "" && !checkWinner()){
   doTurn(this);
  }
 })
  $("#save").click(() => saveGame());
  $("#previous").click(() => previousGames());
  $("#clear").click(() => clearGame());
}

function saveGame(){
 let state = $("td").toArray().map(x => x.innerText);
 if(board){
  $.ajax({
  type: 'PATCH',
  url: `/games/${board}`,
  data: {state: state}
   });
 }else{
  $.post('/games', {state: state}).done(function(response){
    board = response.data.id
  })
 }
}
// clicking the save button after loaing the game sends patch request

function clearGame(){
 $('td').empty();
 turn = 0;
 board = 0;
}

function loadGame(gameid){
 $('#message').text("");
 $.get(`/games/${gameid}`, function(game){
  var state = game.data.attributes.state;
  $("td").text((i,text) => state[i]);
  board = gameid;
  // set board equal to gameid
  turn = state.join('').length
  checkWinner();
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
