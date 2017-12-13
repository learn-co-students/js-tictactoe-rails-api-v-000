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
  var result = player();
  sq.innerHTML = result;
}

function setMessage(string) {
  $('div#message').append(string);
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

function doTurn(sq) {
  turn ++;
  updateState(sq);
  if (checkWinner()) {  //someone won 
    $('td').text("");  
    turn = 0;
  } else if (turn === 9) {
    setMessage("Tie game.");
  }
}

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $('td').on('click', function() {
    doTurn(this);
  });

  $('#save').on('click', function() {
    //get current board status as array 
    var gameStatus = [];
    $('td').text().split("").forEach(char => gameStatus.push(char))
    var gameParams = {state: gameStatus}
    if (currentGameId !== 0) {
      $.ajax({
        type: 'PATCH',
        url: `/games/${currentGameId}`,
        data: gameParams
      })
    } else {
      var posting = $.post('/games', gameParams);
      posting.done(function(data) {
        console.log(data);
        currentGameId = data.data.id 
        {debugger};
      });
    }
  });

  $('#previous').on('click', function() {
    var games = $.get('/games')
    $('#games').empty();
    games.done(function(data) {
      {debugger};
      data.data.forEach((game) => {
        $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
        })
    });

  });

  $('#clear').on('click', function() {
    $('td').text("");  
    turn = 0;
    // {debugger};
  });


}



