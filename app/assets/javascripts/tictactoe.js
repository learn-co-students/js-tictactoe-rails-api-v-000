$(function(){
  attachListeners()
})

const win_combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
var turn = 0
var currentGame = 0

function player(){
  return turn % 2 ? 'O' : 'X'
}

function updateState(sq){
  $(sq).text(player())
}

function setMessage(msg){
  $('#message').text(msg)
}

function checkWinner(){
  var winner = false
  var b = []
  $('td').text((i, sq) => b[i] = sq);
  win_combos.some(function(a){
      if (b[a[0]] !== "" && b[a[0]] === b[a[1]] && b[a[1]] === b[a[2]]){
        setMessage(`Player ${b[a[0]]} Won!`)
        return winner = true
      }
  })
  return winner
}

function resetBoard(){
  $('td').text('')
  turn = 0
  currentGame = 0
}

function saveGame(){
  var board = []
  var gamedata
  $('td').text((i, sq) => {board.push(sq)});
  gamedata = {state: board}
  if (currentGame){
    $.ajax({type: 'patch', url: `/games/${currentGame}`, data: gamedata})
  } else {
    $.post('/games', gamedata, function(game){
      currentGame = game.data.id
      getLink(game.data)
    })
  }
}

function getLink(game){
  $('#games').append(`<button id="gameid-${game.id}" onclick="loadGame(${game.id})">${game.id}</button>`)
}

function showPreviousGames(){
  $('#message').text('')
  $('#games').text('')
  $.get(`/games`, function(games){
    games.data.forEach(getLink)
  })
}

function loadGame(gameid){
  $.get(`/games/${gameid}`, function(game){
    currentGame = game.data.id
    var board = game.data.attributes.state
    turn = board.join('').length
    i = 0
    board.forEach((b) => {$('td')[i].innerHTML = b, i++})
  })
}

function previousGame(){
  var index = parseInt(currentGame) -1
  var board = $.get(`/games`)
  $('td').text((i, sq) => sq.text(board[i]));
}

function clearGame(){
  saveGame();
  resetBoard();
}

function doTurn(sq){
  updateState(sq)
  turn++
  if (checkWinner()) {
    saveGame();
    resetBoard();
} else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function attachListeners(){
  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })
  $('#save').on('click', function(){ saveGame() })
  $('#previous').on('click', function(){ showPreviousGames() })
  $('#clear').on('click', function(){ resetBoard() })
}