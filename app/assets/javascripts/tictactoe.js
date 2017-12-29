// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGameId = 0;


function player() {
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(sq) {
  sq.innerHTML = player();
}

function setMessage(string) {
  $('#message').append(string);
}

function checkWinner() {

  var combos = [[0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8], 
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8], 
    [0, 4, 8], 
    [2, 4, 6]]

  var board = $('td');

  var win = false;
  var winning = [];
  
  combos.some(combo => {
    if (board[combo[0]].innerHTML !== "" && board[combo[0]].innerHTML === board[combo[1]].innerHTML &&
    board[combo[1]].innerHTML === board[combo[2]].innerHTML) {
      winning = combo;
      setMessage("Player " + board[winning[0]].innerHTML + " Won!");    
      return win = true;
    };
  });
  return win;
}

function resetBoard() {
  $('td').empty();  
  turn = 0;
  currentGameId = 0;
  setMessage('');
}

function doTurn(sq) {
  if (sq.innerHTML === "") {
    turn ++;
    updateState(sq);
  }
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }

}

$(document).ready(function() {
  attachListeners();
});

function saveGame() {
  // $('#save').on('click', function() {
    //get current board status as array 
    var gameState = [];
    var tdAry = $('td').toArray()
    tdAry.forEach(square => { gameState.push(square.innerText)})

    // $('td').text().split("").forEach(char => gameStatus.push(char))
    var gameParams = {state: gameState}
    // debugger;
    if (currentGameId) {
      // {debugger};
      $.ajax({
        type: 'PATCH',
        url: `/games/${currentGameId}`,
        data: gameParams
      })
    } else {
      // {debugger};
      $.post('/games', gameParams, function(game) { 
        currentGameId = game.data.id;
      });
    

      //   type: 'POST',
      //   url: '/games',
      //   data: gameParams
      // })


      // var posting = $.post('/games', gameParams);
      // posting.done(function(game) {
      //   console.log(game);
      //   currentGameId = game.data.id 
      //   {debugger};
      // });
    }
  // });
}

function attachListeners() {
  $('td').on('click', function() {
    if (!checkWinner()) {
    doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());

  $('#previous').on('click', function() {
    var games = $.get('/games')
    $('#games').empty();
    games.done(function(data) {
      data.data.forEach((game) => {
        $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
        $(`#gameid-${game.id}`).on('click', function() {
          var currentGame = $.get(`/games/${game.id}`);      
          var gameState = game.attributes.state; 
          //populate board 
          gameState.forEach((mark, index) => {
            $('td')[index].innerHTML = mark
          });
          //set game id and turn
          currentGameId = game.id 
          if (gameState.filter(sq => sq !== "").length % 2 == 0) {
            turn = 2
          } else {
            turn = 1
          }
        })
      })
    });

  });

  $('#clear').on('click', function() {
    $('td').text("");  
    turn = 0;
    currentGameId = 0;
    // {debugger};
  });

}



