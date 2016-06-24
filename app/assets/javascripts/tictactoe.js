var turn = 0;
var gameState = []
var METHOD = 'POST'
var URL = '/games'
var currentGame = ''

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
  $('#games').on('click', 'li', function(e){
    resumeGame(e);
    $("#message").text('');
  });
  $("#new").click(function(){
    currentGame = ''
    $("#message").text('');
   boardReset();
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
        message( "Player " + player() + " Won!");
        saveGame();
        return boardReset();
     };
    };  
    return false 
  };

  function checkTie(){
    if (checkWinner() === false && turn === 9){
      message('Tie game');
      saveGame();
      return boardReset();
    };
    return false
  }

  function boardReset(){
    turn = 0;
    $('td').each(function(){
      $(this).text('')});
    gameState = [];
    METHOD = 'POST';
    URL = '/games';
    currentGame = ''
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

function updateBoardState(){
  gameState = [];
  $('td').each(function() {
    gameState.push($(this).text());
  });
}


function saveGame(){
    updateBoardState();

    if(currentGame != ''){
      URL = '/games/' + currentGame;
      METHOD = 'PATCH';
    };

    //console.log(currentGame);
     //console.log(gameState);    
    //console.log(URL);
    //console.log(METHOD);
  
   posting = $.ajax({
    url: URL,
    method: METHOD,
    data: {
      state: gameState
    }
  });

    posting.done(function(data) {
      //console.log(data);
      currentGame = data["id"];
    });  
  };

function getGames(){
  $("#games").empty();

  allGames = $.ajax({
    url: '/games',
    method: 'GET',
   dataType: 'json'
  });

 allGames.done(function(data){
  var games = data['games']
    for(var i = 0; i < games.length; i++ ){
        $("#games").append('<li data-gameid=' + games[i]["id"] + '>' + games[i]["id"] + '</li>');
      };      
    });  
}


function showGames(){
  $("#games").toggle()
  getGames();
};

function resumeGame(event){
  id = $(event.target).text();
  currentGame = id;
  URL = '/games/' + id;
  METHOD = 'PATCH';

   retrieval = $.ajax({
    url: URL,
    method: 'GET',
    dataType: 'json'
  });

    retrieval.done(function(data) {
      var cells = data["state"];
      var n = 0;
      $('td').each(function(){
        $(this).text(cells[n]);
        n++;
      });
    });

}


