var turn = 0;

var winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ];

$(function() {
  currentGame = $('td').map(function(index, item){
   return $(item).text();
  });
  attachListeners(); 
});

function attachListeners(){

  $('td').on('click', function(event){
    doTurn(event);
  });
  $('#save').on('click', function(event){
    saveGame();
  });
  $('#previous').on('click', function(event){
    getGames();
  });
}

function doTurn(event){
  updateState(event);
  turn += 1;
  checkWinner();
}

//calls on player and adds return value to the clicked cell
function updateState(event){
  $(event['currentTarget']).text(player());
}

//if turn number is even, return 'X'; else, return 'O'
function player(){
  if(turn % 2 === 0){
    return 'X';
  } else {
    return 'O';
  };
}

//evaluates board to see if anyone has won
//if winner, make "Player X Won!" or "Player O Won!"
//then call message(string);
function checkWinner(){
  var currentGame = $('td').map(function(index, item){ return $(item).text(); });
  var winner = winningCombo(currentGame);
  if (typeof winner === "undefined" && turn === 9){
    message("Tie game");
  } else if (typeof winner === "undefined"){
    return false;
  } else {
    var string = "Player " + currentGame[winner[0]] + " Won!";
    message(string);
  };
}

function message(string){
  $('#message').text(string);
  resetBoard();
}

function resetBoard(){
  $('td').each(function(index, item){
    $(item).text("");
    turn = 0;
  });
}

function winningCombo(currentGame){
  return winCombos.find(function(combo){
   return (currentGame[combo[0]] === 'X' && currentGame[combo[1]] === 'X' && currentGame[combo[2]] === 'X') || (currentGame[combo[0]] === 'O' && currentGame[combo[1]] === 'O' && currentGame[combo[2]] === 'O')
  });
}

function saveGame(){
  // var currentGame = $('td').map(function(index, item){
  //  return $(item).text();
  // });
  gameArray = jQuery.makeArray(currentGame);
  gameArray = gameArray.map(function(pos){
    if(pos === ""){
      return " ";
    } else {
        return pos;
      };
    });
  var posting = $.post("/games", gameArray.join(""));

  posting.done(function(data){
    $("#save").on('click', function(data){
      var currentGame = $('td').map(function(index, item){
        return $(item).text();
        });
      gameArray = jQuery.makeArray(currentGame);
      gameArray = gameArray.map(function(pos){
        if(pos === ""){
          return " ";
        } else {
            return pos;
          };
        });

    var patching = $.ajax({
      url: '/games/' + $('td a:last').text(),
      type: 'PATCH',
      data: gameArray.join("")
      });
    });
  });
}

function getGames(){
  // var currentGame = $('td').map(function(index, item){
  //  return $(item).text();
  // });
  var games = $.get("/games");
  games.done(function(data){
    gameList = data["games"]
    gameList.forEach(function(game, index, self){
      if($('#games').text().length < self.length){
        $('#games').append('<a href="/games/' + game["id"] + '">' + game["id"] + '</a><br />');
      };
    })
  });
}






