$(document).ready(function() {
  attachListeners();
  showOldGame();
  oldGames();
  saveGame();
  reset();
});

var turn = 0;
var boardId;


function attachListeners() {
  $('td').on('click', function(event) {
    doTurn(event);
  });
}

function doTurn(event) {
  $('#message').html('');
  updateState(event);
  turn+=1;
  checkWinner();


  if (turn == 9) {
    message("Tie game");
  }
}

function updateState(event) {
  $(event.target).html(player());
};


function player() {
  if (turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}


function checkWinner() {
  var gameOver = false;
  for (var i=0; i<winningCombos.length;i++) {
    var one = "#" + winningCombos[i][0];
    var two = "#" + winningCombos[i][1];
    var three = '#' + winningCombos[i][2];

    var first = ($(one).text());
    var second = ($(two).text());
    var third = ($(three).text());

    if (first == "X" && second == "X" && third == "X") {
      message('Player X Won!');
      gameOver = true;
    } else if (first == "O" && second == "O" && third == "O") {
      message('Player O Won!');
      gameOver = true;
    }
  }
  if (gameOver == false) {
    return false;
  }
}

function message(string) {
  $('#message').text(string);
  endGame();
}

function endGame() {
  var gameData = getGameBoard();

  if (boardId == undefined) {
  $.ajax({
    url: '/games',
    method: 'POST',
    dataType: 'json',
    data: { game: {state: JSON.stringify(gameData)}}
  })
} else {
  $.ajax({
    url: '/games',
    method: 'PATCH',
    dataType: 'json',
    data: { game: {id: boardId, state: JSON.stringify(gameData)}}
  })
}
  $('td').each(function() {
    $(this).html("");
  })
  turn = 0;

  // if ($('#message').text() == "Player X Won!" || $('#message').text() == "Player O Won!" || $('#message').text() == "Tie game") {
    boardId = undefined;
  // }
}

function reset() {
  $('#reset').on('click', function() {
    turn = 0;
    $('td').each(function() {
      $(this).text("");
    })
    boardId = undefined;
  })
}

function getGameBoard() {
 	var board = [];
 	$('td').each(function() {
    var whichLetter = $(this).text()
    board.push(whichLetter);
 	});
 	return board;
 };

var winningCombinations = [
  [[0,0],[1,1],[2,2]],
  [[2,0],[1,1],[0,2]],
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  [[0,0],[1,0],[2,0]],
  [[0,2],[1,2],[2,2]],
  [[0,1],[1,1],[2,1]]
]

var winningCombos = [
  ['0-td','4-td','8-td'],
  ['2-td','4-td','6-td'],
  ['0-td','3-td','6-td'],
  ['1-td','4-td','7-td'],
  ['2-td','5-td','8-td'],
  ['0-td','1-td','2-td'],
  ['6-td','7-td','8-td'],
  ['3-td','4-td','5-td']
]


////////////START BOARD

function oldGames() {
  $('#previous').on('click', function() {
    $('.old').remove();
    $.get('/games', function(data) {
      for (i=0;i<data.length;i++)
       $('#games').append('<li class="old" id=' + data[i]['id'] + '>' + data[i]['id'] + '</li>');
    })
  })
}

function showOldGame() {
  $(document.body).on('click', '.old', function() {
    clicked = true;
    var oldBoard = [];
    var thisId = $(this).attr('id');
    boardId = thisId;
    $.get('/games', function(data) {
      for (var i=0; i<data.length;i++) {
        if (data[i].id == thisId) {
          var parsedBoard = JSON.parse(data[i].state);
          var boardData = JSON.stringify(parsedBoard);
          for (var j = 0; j < boardData.length; j++) {
            var insert = boardData.replace(/[\]\["]/g, "").split(',')[j]
            oldBoard.push(insert);
            $('#'+j+'-td').text(insert);
          }
        }
      }
      var updated = oldBoard.slice(0,9);
    keepPlaying(updated);
    })

    // $('#save').on('click', function() {
    //   pauseGame(thisId);
    // })
  });
}


function saveGame() {
    $(document.body).on('click', '#save', function() {
      endGame();
    })
  }



 function keepPlaying(board) {
    marks = [];
    for (var i=0; i<board.length; i++) {
      if (board[i] == "X" || board[i] == "O") {
        marks.push(board[i]);
      }
    }
    turn = marks.length;
}



 function pauseGame(thisId) {
   var gameData = getGameBoard();

   $.ajax({
     url: '/games',
     method: 'PATCH',
     dataType: 'json',
     data: { game: {id: thisId, state: JSON.stringify(gameData)}}
   })

   $('td').each(function() {
     $(this).html("");
   })

   boardId = undefined;
 }
