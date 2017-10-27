let turn = 0;
let currentGame = 0;
let winner = false;
const winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

$(document).ready(function() {
  setListeners();
});

function setListeners() {
  $('td').on('click', function() {
    doTurn(this);
  })

  $('#previous').on('click', function() {
   previousGames();
 })
 $('#save').on('click', function() {
   saveGame();
 })
 $('#clear').on('click', function() {
   clearGame();
 })
}

function doTurn(cell){
  updateState(cell);
  if (winner){
    clearBoard();
    turn = 0;
  }else if(turn === 9){
    setMessage("Tie game")
    clearBoard();
    turn = 0;
  }
  checkWinner()
}

function updateState(cell){
  if($(cell).text() === ""){
    turn += 1;
    $(cell).text(player());
  }
}

function player(){
  return (turn % 2 === 0 ? "X" : "O")
}

function checkWinner(){
  let board = currentBoard()
  for (combo of winningCombos) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
      winner = board[combo[0]]
      setMessage(`Player ${winner} Won!`)
    }
  }
  if(turn === 9 && !winner){
    setMessage(`Tie game.`)
    winner = "cats"
  }
  return !!winner
}

function currentBoard(){
  let board = {};
  $('td').map(function(index, square) {
    board[index] = square.innerHTML;
  })
  return board
}

function clearGame(){
  winner = false;
  turn = 0;
  setMessage("")
  clearBoard()
}

function setMessage(info){
  $('#message').text(info)
}

function clearBoard(){
  $('td').text("");
  setMessage("");
  winner = false;
}

//--------------------------------------------------------------------

function emptyCheck(array) {
  return array.some(function(el) {
    return el !== undefined;
  })
}

function turnChecker(array) {
  turn = 0;
  array.forEach((el) => {
    if (el !== "") {
      ++turn;
    }
  })
  return turn;
}

function loadGame(id) {
  $.ajax({
    type: 'GET',
    url: `/games/${id}`,
    dataType: "json",
    success: function(game) {
      currentGame = game.data.id
      var state = game.data.attributes.state
      turnChecker(state);

      if (emptyCheck(state)) {
        for (let i = 0; i < $('td').length; i++) {
          $('td')[i].innerHTML = state[i];
        }
      }
    }
  })
}

function previousGames() {
  $('#games').empty();
  $.get('/games', function(games) {
    games.data.forEach(function(game) {
      $('#games').append(`<button id="game-data-${game.id}">Game ${game.id}</button><br>`)
      $('#game-data-' + game.id).on('click', () => loadGame(game.id));
    })
  })
}


function saveGame() {
  var state = [];

  $('td').text((index, square) => {
    state.push(square);
  });

  var data = { state: state }

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: data
    });
  } else {
    $.post('/games', data, function(game) {
      currentGame = game.data.id;
    });
  }
}
