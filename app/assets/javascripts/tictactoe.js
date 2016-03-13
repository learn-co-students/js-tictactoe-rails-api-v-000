var turn = 0;
var currentGame = 0;
var winningCombos = [[[0,0],[1,0],[2,0]],
                    [[0,1],[1,1],[2,1]],
                    [[0,2],[1,2],[2,2]],
                    [[0,0],[1,1],[2,2]],
                    [[0,0],[0,1],[0,2]],
                    [[2,0],[2,1],[2,2]],
                    [[1,0],[1,1],[1,2]],
                    [[2,0],[1,1],[0,2]]];


function checkCombos(combos){
  for(var i = 0; i < combos.length; i++){
    if ($('[data-x="' + combos[i][0]+ '"][data-y="' + combos[i][1] + '"]').text() != player()){
      return false;
    }
  }
  return true;
}

function checkWinner() {
  for(var i = 0; i < winningCombos.length; i++){
    if (checkCombos(winningCombos[i])){
      message('Player ' + player() + ' Won!');
      return true;
    }
  }
  return false;
}

function tieGame(){
  if ($('td').text().length == 9){
    message('Tie game');
    return true;
  }
  return false;
}

function message(message){
  $('#message').text(message);
}

function player(){
  return turn % 2 === 0 ? "X" : "O";
}

function resetBoard(){
  $('td').text("");
  turn = 0;
  currentGame = 0
  clearList();
}

function clearList(){
  $('#games').text("");
}

function updateState(cell){
  cell.text() == "" ? cell.text(player()) : turn -= 1;
}

function doTurn(cell){
  updateState(cell);
  if (checkWinner() || tieGame()){
    saveGame();
    resetBoard();
  } else {
    turn += 1;
  }
}

function checkedCells(){
  var board = [];
  $('td').each(function(){
    board.push($(this).text());
  });
  return board;
}

function listGames(games){
  clearList();

  games.forEach(function(game){
    var listItem = $('<li>', {'data-id': game.id, 'data-state': game.state, text: game.id});
    $('#games').append(listItem);
  });
}

function getAllGames(){
  $.getJSON('/games').done(function(response){
    listGames(response.games);
  });
}

function loadGame(game){
  $('td').each(function(index){
    $(this).html(game[index]);
  });
}

function deleteGame(){
  $.ajax({url: '/games/' + currentGame, type: 'DELETE'});
  resetBoard();
}

function saveGame(){
  var url = '/games'
  var method = 'POST'

  if (currentGame != 0){
    url = '/games/' + currentGame;
    method = 'PATCH';
  }

  $.ajax({
    url: url,
    type: method,
    dataType: 'json',
    data: {
      game: {
        state: checkedCells()
      }
    },
    success: function(data){
      if (currentGame == 0){
        currentGame = data.id;
      }
    }
  });
  clearList();
};

function attachListeners(){
  $('td').click(function(){
    doTurn($(this));
  });

  $('#save').click(function(){
    saveGame();
  });

  $('#previous').click(function(){
    getAllGames();
  });

  $('#games').click(function(event){
    loadGame($(event.target).data('state').split(','));
    currentGame = $(event.target).data('id');
  })

  $('#delete').click(function(){
    deleteGame();
  })
}

$(function(){
  attachListeners();
});
