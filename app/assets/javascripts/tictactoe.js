// Code your JavaScript / jQuery solution here
var turn = 0
var currentGame = 0
var WIN_COMBINATIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

$(document).ready(function(){
  attachListeners()
})

function attachListeners(){
  $('td').click(function(){
    if(this.innerHTML === "" && !isBoardFull() && !checkWinner()) {doTurn(this)}
  })
  $('#save').click(saveGame)
  $('#previous').click(previousGame)
  $('#clear').click(clearGame)
}

function saveGame(){
  var board = currentBoard()
  if (currentGame != 0) {
    var url = '/games/' + currentGame
    $.ajax({
      type: 'PATCH',
      url: url,
      data: {state: board, _method:'PUT'}
    })
  } else {
    $.post('/games', {state: board}, function(json){
      currentGame = parseInt(json.data['id'])
    })
  }
}

function previousGame(){
  $.get('/games', (resp) => {
    $('#games').empty()
    if (resp.data.length > 0) {
      // var gamesHtml
      resp.data.forEach(function(el){
        $('#games').append('<button id='+ el.id + ' onclick="loadGame('+ el.id +')">' + el.id +'</button>')
      })
      // gamesHtml
    }
  })
}

function loadGame(gameId) {
  $.get('/games/' + gameId, function(resp){
    //resp.data.attributes.state
    resp.data.attributes.state.forEach(function(item, i){
      $('td')[i].innerHTML = item
    })
    var counter = 0
    var arrList = [].slice.call(document.querySelectorAll("td")) //change node list to array

    arrList.map(function(td){
      // debugger;
      if(td.innerHTML === 'X' || td.innerHTML === 'O') { counter++ }
    })
    turn = counter;
    currentGame = gameId;

    // debugger;
  })
}

function clearGame(){
  $('td').empty();
  turn = 0
  currentGame = 0
}

function player() {
  return turn % 2 ? "O" : "X"
}

function updateState(square) {
  $(square).html(player())
}

function setMessage(message) {
  $('#message').html(message)
}

function checkWinner() {
  var gameWon = false
  var board = currentBoard()
  WIN_COMBINATIONS.forEach(function(combination) {
    if(board[combination[0]] != "" && board[combination[0]] === board[combination[1]] && board[combination[0]] === board[combination[2]]) {
      gameWon = true;
      setMessage(`Player ${board[combination[0]]} Won!`)
    }
  })
  return gameWon;
}

function doTurn(el) {
  updateState(el)
  turn++
  if (checkWinner()) {
    saveGame()
    clearGame()
  } else if(isBoardFull()){
    setMessage("Tie game.")
    saveGame()
    clearGame()
  }
}

function currentBoard() {
  let board = [];
  $('td').text(function(i, content){
    board[i] = content;
  })
  return board
}

function isBoardFull() {
  let board = currentBoard()
  let full
  if(board.includes('')){
    full = false
  } else {
    full = true
  }
  return full
}

