// Code your JavaScript / jQuery solution here
//var turnCount = 0;

var turn = $('td').toArray().filter(function(square) {
  return square.innerHTML === 'X' || square.innerHTML ==='O';
}).length;

function board(board) {
  return board.map(function(element) {
    return element.innerHTML;
  });
}

function winCombos(board) {
  return [ [board[0], board[1], board[2]], [board[3], board[4], board[5]], [board[6], board[7], board[8]],
  [board[0], board[3], board[6]], [board[1], board[4], board[7]], [board[2], board[5], board[8]],
  [board[0], board[4], board[8]], [board[2], board[4], board[6]] ];
};

function player() {
  if (turn % 2 === 0) {
    turn++;
    return 'X';
  } else {
    turn++;
    return 'O';
  }
}

function updateState(square) {
  square.innerHTML = player();
}

function setMessage(string) {
  document.getElementById('message').innerHTML = string;
}

//token is either 'X' or 'O'
function winner(token) {
  return winCombos(board( $('td').toArray() )).map(function(e) {
    return e.every(function(value) {
      return value === token;
    });
  }).includes(true);
}

function checkWinner() {
  if (winner('X')) {
    setMessage('Player X Won!');
    return true;
  } else if (winner('O')) {
    setMessage('Player O Won!');
    return true;
  } else {
    return false;
  };
}

function doTurn(square) {
  updateState(square);
  if (checkWinner()) {
    //reset board;
    saveGame();
    //$('tbody').removeData('data-id')
    console.log('Already called');
    clearBoard();
    //$('td').each(function() {
      //this.innerHTML = "";
    //});
    //turn = 0;
  } else if (turn === 9) {
    setMessage('Tie game.');
    //reset board
    saveGame();
    clearBoard();
    // $('tbody').removeData('data-id')
    // $('td').each(function() {
    //   this.innerHTML = "";
    // });
    // turn = 0;
  } else {
    console.log(turn);
  }
  //updateState(square);
}

function saveGame() {
  var values = $('td').map(function() {
    return this.textContent;
  }).toArray();

  function callback(response) {
    $('tbody').data( "data-id", response["data"]["id"] );
  };

  if ($('tbody').data('data-id') === undefined) {
    $.post('/games', { state: values }).done(callback)
    // $.post('/games', { state: values }).done(function(callback) {
    //   $('tbody').data( "data-id", response["data"]["id"] );
    //});
  } else {
    $.ajax({
      type: 'PATCH',
      url: '/games/' + $('tbody').data('data-id'),
      data: { state: values }
    });
  };
}

function clearBoard() {
  turn = 0;
  $('tbody').removeData('data-id')
  $('td').each(function() {
    this.innerHTML = "";
  });
}

function previousGames() {
  $('#games button').on('click', function(e) {

    $.get('/games/' + e.currentTarget.textContent, function(response) {
      //debugger
      var counter = 0;
      response.data.attributes.state.forEach(function(element) {
        $('td')[counter].innerHTML = element;
        console.log(element);
        counter++;
        turn = $('td').toArray().filter(function(square) {
          return square.innerHTML === 'X' || square.innerHTML ==='O';
        }).length;
      });
      $('tbody').data( "data-id", response["data"]["id"] );
    });
  });
}

function attachListeners() {
  $('td').on('click', function(e) {
    if (checkWinner()) {
      $('tbody').removeData('data-id')
      $('td').each(function() {
        this.innerHTML = "";
      });
    }
    else if (turn === 9) {
      $('tbody').removeData('data-id')
      $('td').each(function() {
        this.innerHTML = "";
      });
    }
    else if (this.innerHTML === "") {
      doTurn(this);
    } else {
      console.log("Invalid move. Choose Open Square.");
    };
  });
}

$(document).ready(function() {
  attachListeners();

  $('#save').on('click', function(e) {
    e.preventDefault;
    var values = $('td').map(function() {
      return this.textContent;
    }).toArray();

    var posting;

    if ($('tbody').data('data-id') === undefined) {
      posting = $.post('/games', { state: values });
      posting.done(function(response) {
        $('tbody').data( "data-id", response["data"]["id"] );
      });
    } else {
      $.ajax({
        type: 'PATCH',
        url: '/games/' + $('tbody').data('data-id'),
        data: { state: values }
      });
    };
  });

  $('#previous').on('click', function(e) {
    e.preventDefault();
    var $buttonArray = $('#games button').map(function() {
      return this.textContent;
    }).toArray();

    if ($buttonArray.length === 0) {
      $.get('/games', function(response) {
        var arr = response.data
        if (arr.length > 0) {
          arr.forEach(function(game) {
            var id = game.id;
            var content = '<button data-id="' + id + '">' + id + '</button><br>';
            $('#games').append(content);
          })
          previousGames();
        };
      })
    } else {
      $.get('/games', function(response) {
        var arr = response.data

        arr.forEach(function(game) {
          var id = game.id;
          var content = '<button data-id="' + id + '">' + id + '</button><br>';
          if (!$buttonArray.includes(id)) {
            $('#games').append(content);
          };
        });
        previousGames();
      });
    };

    $('#games button').on('click', function(e) {
      //debugger

      $.get('/games/' + e.currentTarget.textContent, function(response) {
        //debugger
        var counter = 0;
        response.data.attributes.state.forEach(function(element) {
          $('td')[counter].innerHTML = element;
          console.log(element);
          counter++;
        });
        $('tbody').data( "data-id", response["data"]["id"] );
      });
    });
  });

  $('#clear').on('click', function(e) {
    turn = 0;
    $('tbody').removeData('data-id')
    $('td').each(function() {
      this.innerHTML = "";
    });
  });
});
