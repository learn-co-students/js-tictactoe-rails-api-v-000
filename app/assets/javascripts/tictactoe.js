const WIN_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
const BLANK_BOARD = ["","","","","","","","",""]
var squares = []
var turn = 0;
var currentGame = 0;
$(document).ready(attachListeners)
  function attachListeners(){
  $('td').on('click', function(){
    if (!$.text(this)&&!checkWinner()){
      doTurn(this)
    }
  })
  $('button#save').on('click', saveGame)
  $('button#clear').on('click', clearGame)
  $('button#previous').on('click', prevGame)
}
function player(){
  return turn % 2 === 0 ? "X" : "O"
}
function updateState(move){
  $(move).text(player())
}
function setMessage(message){
  $("#message").html("<p>"+message+"</p>")
}

function checkWinner(){
  var win = false
  var board = {}
  $('td').text((index, value) => board[index] = value)

  WIN_COMBOS.forEach(combo=>{
    var tic = board[combo[0]]
    var tac = board[combo[1]]
    var toe = board[combo[2]]
    if ((tic === tac) && (tic === toe) && tic!="") {
      win = true
      setMessage("Player "+tic+" Won!")
    }
  })
  return win;
}

function clearGame(){
  currentGame = 0
  $('td').text("")
  turn = 0
}

function populateBoard(arr) {
  var squares = getBoard()
  for (let i = 0; i < 9; i++) {
    squares[i].innerHTML = arr[i];
  }
}

function getBoard(){
  return window.document.querySelectorAll('td');
}

function getBoardObj(){
  var board = {}
  $('td').text((index, value) => board[index] = value)
  return board
}

function getBoardArr(){
  return $("td").map(function() {
     return $(this).html()
     }).toArray();
}

function checkTie(){
  var tie = false
  if (turn === 9 && !(checkWinner())) {
    setMessage("Tie game.")
    tie = true
  }
  return tie
}

function doTurn(move){
  updateState(move)
  turn+=1
  if (checkWinner()){
    saveGame()
    clearGame()
  }
  else if (checkTie()){
    saveGame()
    clearGame()
  }
  else{
    setMessage("")
  }
}

function addGame(game){
  $("#games").append(`<button id="gameid-${game.id}" onclick="showGame(${game.id})">${game.id}</button><br>`)
}

function saveGame(){
  if (currentGame === 0){
    $.post('/games', { state: getBoardArr() }, function(game) {
        currentGame = game.data.id;
        addGame(game.data)
        $("#gameid-" + game.data.id).on('click', () => prevGame(game.data.id));
      });
    }
    else {
      $.ajax({
        type: 'PATCH', url: `/games/${currentGame}`, data: {state: getBoardArr()}
      })
      setMessage("Game "+currentGame+" Saved")

    }
}

function showGame(id){
  $.get(`/games/${id}`, (game)=>{
    currentGame = game.data.id
    var board = game.data.attributes.state
    populateBoard(board)
    turn = 9-board.filter(function(sq){return sq===""}).length
  })
}

function prevGame(){
  $("#games").html("")
  var all_games = $.get('/games', {}, function(response){
    response.data.forEach(function(game){
      addGame(game)
    })
  })
}
