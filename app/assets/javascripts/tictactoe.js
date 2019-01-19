//------------ Initial Variables ------------//

//Possible Winning Outcomes (This is a constant)
var WINNING_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8,], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]];
var turn = 0;
var board = 0;

$(document).ready(function() {
  attachListeners();
});

function player(){
  if(turn % 2 === 0){
    return 'X';
  }
  else{
    return 'O';
  }
}

function updateState(square){
  //square ==> <td data-x="0" data-y="1"></td>
  //Setting a currentPlayer varaiable that will call the player function
  var currentPlayer = player();
  //Search for square and put the innerHTML or text as currentPlayer
  $(square).text(currentPlayer);
}

function setMessage(message){
  $('#message').text(message);
}

function checkWinner(){
  var winner = false;
  //Board will start as an empty object
  var board = {};
  //Goal is to populate the board object with the index and the square
  //square ==> <td data-x="0" data-y="1"></td>
  $('td').text((index, square)=> board[index]= square);
  WINNING_COMBINATIONS.forEach(function(position){
    if(board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== ""){
      //board[position[0]] ==> Signifies which ever X or O won. I.e the test calls for: "Player (X or O) Won!"
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })
  return winner;
}

function doTurn(square){
  updateState(square);
  turn ++;
  if (checkWinner()){
    saveGame();
    clearGame();
  }else if (turn === 9){
    setMessage("Tie game.");
    saveGame();
    clearGame();
  }
}

function attachListeners(){
  $("td").on('click', function(){
    // Check to ensure that the square is empty
    if (this.innerHTML === "" && checkWinner() === false){
      doTurn(this);
    }
  });

  $("#clear").on("click", function(){
    clearGame();
  });

  $("#save").on("click", function(){
    saveGame();
  });

  $("#previous").on("click", function(){
    showPreviousGames();
  });
}


function saveGame(){
  var state = [];
  var gameData;

  $('td').each(function(){
    state.push($(this).text());
  });

  gameData = {state: state};

  if (board){
    $.ajax({
      type: 'PATCH',
      url: `/games/${board}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData).done(function(game){
      board = game.data.id;
   })
  }
}

function clearGame(){
  //Clears the board
  $('td').empty()
  //resets turn to 0
  turn = 0;
  board = 0;
}

function showPreviousGames(){
  $('#games').text();
  $.get('/games', function(games){
    games.data.map(function(game){
      if ($(`#gameid-${game.id}`).length === 0){
        $('#games').append(`<button id="gameid-${game.id}">Game: ${game.id}</button><br>`);
        $("#gameid-" + game.id).click(() => reloadGame(game.id));
      }
    })
  })
}

function reloadGame(gameid){
  $('#message').text("");
  $.get(`/games/${gameid}`, function(game){
    var state = game.data.attributes.state;
    $("td").text((i,text) => state[i]);
    board = gameid;
    // set board equal to gameid
    turn = state.join('').length
    checkWinner();
  })
}
