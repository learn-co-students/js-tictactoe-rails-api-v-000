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


function checkCombo(combo){
  for(var i = 0; i < combo.length; i++){
    if ($('[data-x="'+ combo[i][0]+'"][data-y="'+ combo[i][1]+'"]').text() != player()){
      return false;
    }
  }
  return true;
}

function checkWinner() {
  for(var i = 0; i < winningCombos.length; i++){
    if (checkCombo(winningCombos[i])){
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

function resetBoard(){
  $('td').text("");
  turn = 0;
  currentGame = 0
}

function message(message){
  $('#message').text(message);
}

function player(){
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(square){
  square.text() == "" ? square.text(player()) : turn -= 1;
}

function doTurn(square){
  updateState(square);
  if (checkWinner() || tieGame()){
    saveGame();
    resetBoard();
  } else {
    turn += 1;
  }
}

function checkedCells(){
  var currentBoard = ["","","","","","","","",""];
  $('td').each(function(index, cell){
    currentBoard[index] = $(cell).text();
  });
  return currentBoard;
}

function loadGames(games){
  games.forEach(function(game){
    var listItem = $('<li>', {'data-id': game.id, 'data-state': game.state, text: game.id});
    $('#games').append(listItem);
  });
}

function getAllGames(){
  $.getJSON('/games').done(function(response){
    loadGames(response['games']);
  });
}

function loadGame(game){
  $('td').each(function(index){
    $(this).html(game[index]);
  });
}

function saveGame(){
  var url = '/games'
  var method = 'POST'

  if (currentGame != 0){
    url = '/games/' + currentGame;
    method = 'PATCH';
  }

  $.ajax({
    type: method,
    url: url,
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
};

function attachListeners(){
  $('td').click(function(){
    doTurn($(this));
  });

  $('#save').click(function(event){
    saveGame();
  });

  $('#previous').click(function(event){
    getAllGames();
  });

  $('#games').click(function(event){
    loadGame($(event.target).data('state'));
    currentGame = $(event.target).data('id');
  })
}

$(function(){
  attachListeners();
});
