
let turn = 0;
let board = ["", "", "", "", "", "", "", "", ""];
let persisted = "0";

function player(){
  if (turn % 2 === 0){
    return 'X'
  }
  else {
    return 'O'
  }
}
function updateBoard(){
  let index = 0;
  $('td').each(function(){
      console.log(this)
      board[index] = $(this).text();
      index++;
  })
}
//Displays appropriate token in the tile element text
function updateState(tile){
  console.log(turn)
  token = player();
  $(tile).text(token);
  updateBoard()
}
//Adds message to message element
function setMessage(message){
  $('div#message').text(message);
}
function resetBoard(){
  $('td').text('')
  turn = 0
  persisted = "0"
  setMessage('');
}
function saveGame(){
  updateBoard()
  let boardData = {state : board}
  if (persisted == 0){
    console.log(persisted)
    let createdGame = $.post('/games', boardData);
    createdGame.done(function(response) {
      persisted = response["data"]["id"];
    });
  }
  else{
    $.ajax({
      type: 'PATCH',
        url: '/games/' + persisted,
          data: JSON.stringify(boardData),
            contentType : 'application/json',
              dataType: 'json'
            }
          )
  }
  console.log(persisted)
}
function checkWinner(){
  updateBoard()
  let WIN_COMBINATIONS = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ]
  WIN_COMBINATIONS.forEach(function(combo) {
    win_tile_1 = board[combo[0]]
    win_tile_2 = board[combo[1]]
    win_tile_3 = board[combo[2]]
    if (win_tile_1 == "X" && win_tile_2 == "X" && win_tile_3 == "X"){
      setMessage('Player X Won!')
      return true;
    }
    else if (win_tile_1 == "O" && win_tile_2 == "O" && win_tile_3 == "O"){
      setMessage('Player O Won!')
      return true;
    }
    else {return false}
  });
}
function doTurn(tile){

  updateState(tile)
  turn++;

  if (checkWinner()){
    saveGame()
    resetBoard()
  }
  else if (turn === 9){
    setMessage('Tie Game')
    resetBoard()
  }
}
function previousGames() {
  $.get('/games', function(savedGames) {
    let gameList = '<ul>';
    savedGames['data'].forEach(function(savedGame) {
      gameList += '<li data-id="' + savedGame.id + '">' + savedGame.id + '</li>';
    })
    gameList += '</ul>'
    $('#games').html(gameList);
    $('li').on('click', function() {
      loadGame($(this));
    });
  });
}
function loadGame(gameData) {
  $.get('/games/' + gameData.data('id'), function(response) {
    gameState = response['data']['attributes']['state'];
    persisted = response['data']['id']
    turn = gameState.filter(element => element != "");
    $('td').each(function(index, td) {
      $(td).text(board[index]);
    });
    setMessage('');
    checkWinner();
  });
}
//Attaches listeners to the DOM
function attachListeners(){
  //Adds functionality to buttons
  $('button#previous').on('click', previousGames)
  $('button#save').on('click', saveGame)
  $('button#clear').on('click', resetBoard)
  //Allows tiles to be clicked and take turn
  $('td').on('click',function(){
    doTurn(this);
  })
}
$(document).ready(function(){
  attachListeners();
})
