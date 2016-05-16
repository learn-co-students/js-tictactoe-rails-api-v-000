$(document).ready(function(){
  attachListeners();
});

var turn = 0;
var currentGame = 0;
var gameState = [];
var playable = true;

var winCombinations = [
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[2,0],[1,1],[0,2]],
];

var attachListeners = function(){
  $('td').on('click', function(event){
    if (playable && event.target.textContent === ""){
      doTurn(event);
    }
  });
  $('#save').on('click', function(){
    saveState();
    var ajaxMethod = currentGame === 0 ? 'POST' : 'PATCH';
    var ajaxURL = currentGame === 0 ? '/games' : '/games/' + currentGame
    ajaxSave(ajaxMethod, ajaxURL);
  });
  $('#previous').on('click', ajaxList);
  $('#games').on('click', ajaxLoad);
};

var ajaxSave = function(method, ternaryURL, gameOver=false){
  $.ajax({
    url: ternaryURL, 
    type: method,
    dataType: 'json',
    data: {'game':{
      'state':gameState,
      'id':currentGame}
    },
    success: function(response, textStatus, xhr){
      if(gameOver){
        currentGame = 0;
      } else {
        currentGame = response.game.id;
      }
    }
  });
};

var ajaxList = function(){
  //get whole list of id's
  //append them to '#games'
  $.get('/games', function(response){
    var gameElements = "";
    response.games.forEach(function(d){
      gameElements += ("<div data-gameid=" + d.id + ">" + d.id + "</div>");
    });
    $('#games').empty().append(gameElements);
  });
};

var ajaxLoad = function(event){
  $.get(('/games/' + event.target.innerText), function(response){
    currentGame = response.game.id;
    response.game.state.forEach(function(d,i){
      x_coord = i%3;
      y_coord = Math.floor(i/3);
      $('[data-x=' + x_coord + '][data-y=' + y_coord + ']')
        .text(d);
    });
    turn = response.game.state.map(function(d,i){
      return (d == "X" || d == "O") ? 1 : 0; //array of 1's per play
    }).reduce(function(d,p){
      return d+p;  // add them together
    });
    if (turn == 9 || !!checkWinner(false)){
      playable = false;
    } else {
      playable = true;
    };
  });
};

var doTurn = function(event){
  //play 'event's move
  updateState(event);
  //a turn has been taken
  turn += 1;
  //check for victory
  checkWinner(true);
};

var player = function(){
  return turn%2 == 0 ? "X" : "O";
};

var updateState = function(event){
  event.target.textContent = player();
};

var checkWinner = function(clear_on_over){
  //check for victory at each winCombo
  winCombinations.forEach(function(combo){
    winner = checkCombo(combo);
    if (winner){
      if (clear_on_over){
        wrapGame("Player " + winner + " Won!");
      }
      return true;
    }
  });
  //with no victories, it might be a tie
  if (turn === 9){
    if (clear_on_over){
      wrapGame("Tie game");
    }
    //we can represent a tie by returning 'undefined'
    return undefined;
  }
  //otherwise, it's a game in process
  return false;
};

var checkCombo = function(combo){
  //check this combo for victory
  //return "X" or "O" for victory
  //return false otherwise
  var plays_at_combo = combo.map(function(d){
    return $('[data-x=' + d[0] + '][data-y=' + d[1] + ']').text();
  });
  
  var allXs = plays_at_combo.every(function(d){
    return d == "X";
  });
  var allOs = plays_at_combo.every(function(d){
    return d == "O";
  });

  if (allXs){
    return "X";
  } else if (allOs){
    return "O";
  } else{
    return false;
  }
};

var wrapGame = function(msg){
  saveState();
  // $('#save').click();
  var ajaxMethod = currentGame === 0 ? 'POST' : 'PATCH';
  var ajaxURL = currentGame === 0 ? '/games' : '/games/' + currentGame;
  ajaxSave(ajaxMethod, ajaxURL, true);
  message(msg);
  resetBoard();
  turn = 0;
  // if (currentGame != 0) {
  currentGame = 0;
  // }
};

var saveState = function(){
  gameState = $.map($('td'), function(d, i){
    return $(d).text();
  });
};

var message = function(string_in){
  $('#message').text(string_in);
};

var resetBoard = function(){
  $('td').text('')
};
