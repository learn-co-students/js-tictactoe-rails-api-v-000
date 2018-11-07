var turn = 0;
var currentGame = 0;

function player(){
 if(turn % 2){
  return 'O'
 }else{
  return 'X'
 }
}

function updateState(square){
  token = player();
  $(square).text(token)
}

function setMessage(string){
  $('div#message').text(string)
}

function checkWinner(){
  var won = false;
  let board = {};

  $('td').text(function(index, string){
    board[index] = string
  });
  const WIN_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

  WIN_COMBOS.some(function(combo){
    if(board[combo[0]] != "" && board[combo[0]] == board[combo[1]] && board[combo[1]] == board[combo[2]]){
      setMessage(`Player ${board[combo[0]]} Won!`);
      won = true;
      return true;
    }
  });

  return won
}

function resetBoard(){
  $('td').text('')
  turn = 0
  currentGame = 0
}

function attachListeners(){
  $('td').on('click', function() {
    if(this.textContent == "" && !checkWinner()){
      doTurn(this)
    }
  });

  $('button#previous').on('click', previousGames);
  $('button#save').on('click', saveGame);
  $('button#clear').on('click', resetBoard);
}

function saveGame(){
  let board = []

  $('td').text(function(index, currentcontent){
    board.push(currentcontent)
  })

  var dataForCreate = { state: board }

  if(currentGame){
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: dataForCreate
    });
  }else{
    $.post('/games', dataForCreate, function(game){
      currentGame = game.data.id;
      addButtonForGame(game)
    })
  }
}

function doTurn(square){
  updateState(square);
  turn++;
  if(checkWinner()){
    saveGame();
    resetBoard();
  }else if (turn == 9){
    setMessage("Tie game.")
    saveGame();
    resetBoard();
  }
}

function previousGames(){
  $('#games').empty();
  $.get('/games', (games) => {
    if (games.data.length) {
      games.data.forEach((game) => addButtonForGame(game));
    }
  });
}

function addButtonForGame(game){
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id))
}



function reloadGame(id){
  $('#message').empty();
  $.get(`/games/${id}`, function(response){
    
    currentGame = response.data.id
    var state = response.data.attributes["state"]

    turn = state.join('').length;

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }
  })
}

$(document).ready(function(){
  attachListeners()
})

