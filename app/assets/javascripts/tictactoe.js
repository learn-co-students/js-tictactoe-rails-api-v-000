// Code your JavaScript / jQuery solution here

var turn = 0

var board = []

var gameId = 0

const winning_combinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]


function player() {
  if (turn % 2 != 0 && turn){
  return 'O'}
  else { return 'X'}
}

function updateState(e){
  let playerstring = player()
  $(e).text(playerstring)
}

$(document).ready(function(){
  attachListeners()
  findSquare()
})

function attachListeners(){
$('td').on('click', function() {
 if (!$.text(this) && !checkWinner()) {
   doTurn(this);
 }
});

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetGame());
}

function doTurn(e) {
  updateState(e);
  turn += 1;
  if (checkWinner()) {saveGame(); resetGame()}
  else if (turn === 9) {setMessage('Tie game.'); saveGame(); resetGame();}
}

function setMessage(str){
  $("#message").html(str)
}

function findSquare(){
  let counter = 0
  $("[data-x]").map(function() {
    counter += 1
    $(this).attr({
      position: `${counter}`
    })
  })
}

function checkWinner (){
  let board = getBoard()
  var winner = false
  winning_combinations.forEach(function(arr){
    if(board[arr[0]] == "X" && board[arr[1]] == "X" && board[arr[2]] == "X"){
      setMessage('Player X Won!')
      return winner = true
    }
    else if(board[arr[0]] == "O" && board[arr[1]] == "O" && board[arr[2]] == "O"){
      setMessage('Player O Won!')
      return winner = true
    }
  })
  return winner
}

function getBoard (){
  return $("td").toArray().map(function(sq) {
    return sq.innerHTML
  })
}

function saveGame() {
  let game = {"state": getBoard()}    
  if (gameId === 0) { 
  $.post("/games", game, function(resp) { 
  gameId = parseInt(resp.data.id) 
  }) 
}
  else { $.ajax({ 
    url: `/games/${gameId}`, 
    method: "PATCH", 
    data: game  })
    .done(function(resp) { 
      setMessage("Saved") 
    }) 
  } }

  function resetGame() {
    $("td").empty()
    turn = 0
    gameId = 0
    debugger
  }

  function loadGame(id){
    gameId = id
    $.getJSON(`/games/${gameId}`, function(resp){
      turn =
      resp.data.attributes.state.reduce(function(total, i){
        if (i!==""){
          total ++
        }
        return total
      }, 0)
    $("td").toArray().forEach((td, i) =>
      td.innerHTML=resp.data.attributes.state[i])
  })
}

function showPreviousGames(){
  $('#games').empty()
  $.get('/games', function(resp){
    resp.data.forEach(function(game){
      $("#games").append(`<button id=${game.id} onClick="loadGame(${game.id})">
      ${game.id}</button>`)
    })
  })
}
