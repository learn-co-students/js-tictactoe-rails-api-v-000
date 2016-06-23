var turn = 0;
var gameState = []

var winCombinations = [
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]], 
  [[0,2],[1,2],[2,2]], 
  [[0,0],[1,1],[2,2]], 
  [[0,0],[0,1],[0,2]], 
  [[2,0],[2,1],[2,2]], 
  [[1,0],[1,1],[1,2]], 
  [[2,0],[1,1],[0,2]]
  ]

$(function(){

  attachListeners();

});

function attachListeners(){
  $('table').on('click', 'td', function(e){
    doTurn(e);
  });
 $("#save").click(function(){
    saveGame();
  });
  $("#previous").click(function(){
    showGames();
  });

};

function updateState(event){
  $(event.target).text(player());
};

function doTurn(event){
  turn += 1;
  updateState(event);
  checkWinner();
  checkTie();
};


function checkWinner(){
  for(var i = 0; i < winCombinations.length; i++) {
    tokens = [];
    for (var n = 0; n < winCombinations[i].length; n++){
      var x = winCombinations[i][n][0];
      var y = winCombinations[i][n][1];
      var selector = $('[data-x="' + x + '"][data-y="' + y + '"]');
      tokens.push(selector.text());
      };
       if (tokens.every(function(e){return (e === player())})){
        return message( "Player " + player() + " Won!");
     };
    };  
    return false 
  };

  function checkTie(){
    if (checkWinner() === false && turn === 9){
      message('Tie game');
    };
  }

  function boardReset(){
    turn = 0;
    $('td').text('');
    gameState = [];
   }


function player(){
  if(turn % 2 === 0){
    return "X";
  }
  else {
    return "O";
  }
};


function message(winner){
  $('#message').text(winner);
};

function saveGame(){
  $('td').each(function() {
    gameState.push($(this).text());
  });
  
   posting = $.ajax({
    url: '/games',
    method: 'POST',
    data: {
      state: gameState
    }
  });

    posting.done(function(data) {
      var game = data;
       $("#games").append('<li data-id =' + game["id"] + '>' + game["id"] + '</li>');
       boardReset();
    });
  };


function showGames(){

};

