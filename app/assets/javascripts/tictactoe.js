var winningCombo = [
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

$(attachListeners);

var updateState = function(td){
 td.innerHTML = player();
}

var player = () => turn % 2 ? 'O' : 'X';

var setMessage = function(msg){
  $("#message").append(msg)
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

function isEqToXO(combo){
 let currentBoard = {};
 $("td").text((i,td) => currentBoard[i] = td);
 return combo.every(i => currentBoard[i] === 'X') || combo.every(i => currentBoard[i] === 'O')
}

function checkWinner(){
 let winner = winningCombo.find(isEqToXO)
 if(winner){
  setMessage("Player " + $("td").eq(winner[0]).text() + " Won!")
  return !!winner;
  }
  return false;
}

function doTurn(td){
  updateState(td);
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

function saveGame(){
 let state = $("td").toArray().map(x => x.innerText);
 if(currentGame){
  $.ajax({
  type: 'PATCH',
  url: `/games/${currentGame}`,
  data: {state: state}
   });
 }else{
  $.post('/games', {state: state}).done(function(response){
    currentGame = response.data.id
  })
 }
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

function clearGame(){
 $('td').empty();
 turn = 0;
 currentGame = 0;
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

// let gameId = 0;
// 
// class Game{
  // constructor(){
    // this.id = gameId++
    // this.turn = 0
    // this.state = ["","","","","","","","",""]
    // this.winner = null
    // this.currentGame = this.id
  // }
  // 
 // loadGame(){
  // $('#message').text("");
  // $.get(`/games/${this.id}`, function(game){
  // var state = game.data.attributes.state;
  // $("td").text((i,text) => state[i]);
  // currentGame = this.id;
  // turn = state.join('').length
  // checkWinner(); 
  // })
 // }
 // 
 // clearGame(){
  // $('td').empty();
  // turn = 0;
  // currentGame = 0;
// }
// 
 // saveGame(){
  // let state = this.state
   // $.post('/games', {state: state}).done(function(response){
     // this.currentGame = response.data.id
   // })
 // }
// }
// 
// 
// 




