var turn = 0;
var winningCombos = [
                      [[0,0],[1,0],[2,0]], 
                      [[0,1],[1,1],[2,1]], 
                      [[0,2],[1,2],[2,2]], 
                      [[0,0],[1,1],[2,2]], 
                      [[0,0],[0,1],[0,2]], 
                      [[2,0],[2,1],[2,2]], 
                      [[1,0],[1,1],[1,2]], 
                      [[2,0],[1,1],[0,2]]
                    ]
var currentGame = 0;

$(document).ready(function(){
  attachListeners();
});

function attachListeners(){
  $('td').on("click",function(event){
    event.preventDefault();
    doTurn(event);
  });
  
  $('#previous').on("click", function(event){
    event.preventDefault();
    getAllGames();
  });

  $('#save').on("click",function(event){
    event.preventDefault();
    saveGame();
  });

}

function doTurn(event){
    updateState(event);
    turn++;
    checkWinner();
}

function checkCombos(){
  var cell_1;
  var cell_2;
  var cell_3;
  
  winningCombos.some(function(combo){
    cell_1 = $('td[data-x=' + combo[0][0] + '][data-y=' + combo[0][1] + ']').text();
    cell_2 = $('td[data-x=' + combo[1][0] + '][data-y=' + combo[1][1] + ']').text();
    cell_3 = $('td[data-x=' + combo[2][0] + '][data-y=' + combo[2][1] + ']').text();
    
    if(cell_1 === cell_2 && cell_1 === cell_3 && (cell_1 === 'X' || cell_1 === 'O')){
      message("Player " + cell_1 + " Won!");
      saveGame();
      resetBoard();
      return true;
    }
  });
  return false;
}

function checkWinner(){
  var winBool;
  
  winBool = checkCombos();
  debugger;
  
  if (turn === 9 && winBool === false){
    message("Tie game");
    saveGame();
    resetBoard();
  }
  else{
    return false;
  }
}

function updateState(event){
  $(event["currentTarget"]).html(player());
}

function player(){
  if(turn % 2 === 0){
    return "X";
  }
  else{
    return "O";
  }
}

function message(string){
  $('#message').text(string);
}

function resetBoard(){
  turn = 0;
  $('td').each(function(cell){
    $(this).text("");
  });
}

function getAllGames(){
  var appendText;
  
  $.get('/games', function(response){
    
    if (response["games"].length > 0){
      response["games"].forEach(function(game){
        appendText += '<li id="[data-game-' + game["id"] + ']">' + game["id"] + '</li>' 
      });
    }
  
  }).done(function(){
    $('#games').html(appendText);
    debugger;
  });
}

function getBoard(){
  return $.map($('td'),function(cell){
    return ($(cell).text());
  });
}

function saveGame(){
  debugger;
  var url;
  var method;
  if (currentGame === 0){
     url = "/games";
     method = "POST";
  }
  else{
    url = "/games/" + currentGame
    method = "PATCH";
  }

  $.ajax({
    url:url,
    method:method,
    data:{
      game:{
        state:getBoard()
      }
    }
  }).done(function(response){
    currentGame = response["game"]["id"];
    $('#list').append('<li id="[data-game-' + currentGame + ']">' + currentGame + '</li>');
  });
}