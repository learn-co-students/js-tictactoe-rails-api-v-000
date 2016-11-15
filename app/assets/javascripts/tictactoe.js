$(document).ready(function() {
  attachListeners();
  showOldGame();
  oldGames();
  saveGame();
  reset();
});

var turn = 0;

function attachListeners() {
  $('td').on('click', function(event) {
    doTurn(event);
  });
}

function doTurn(event) {
  updateState(event);
  checkWinner();
  turn += 1;
  if (turn == 9) {
    message("Cat's Game!");
  }
}

function updateState(event) {
  var mark = player();
    $(event.target).text(mark);
};


function player() {
  if (turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}


function checkWinner() {
  for (var i=0; i<winningCombos.length;i++) {
    var one = "#" + winningCombos[i][0];
    var two = "#" + winningCombos[i][1];
    var three = '#' + winningCombos[i][2];

    var first = ($(one).text());
    var second = ($(two).text());
    var third = ($(three).text());

    if (first == "X" && second == "X" && third == "X") {
      message('Player X Won!');
    } else if (first == "O" && second == "O" && third == "O") {
      message('Player O Won!');
    }
  }
}

function message(string) {
  $('#message').text(string);
  turn = -1;
  endGame();
}

function endGame() {
  var gameData = getGameBoard();

  $.ajax({
    url: '/games',
    method: 'POST',
    dataType: 'json',
    data: { game: {state: JSON.stringify(gameData)}}
  })

  $('td').each(function() {
    $(this).text("");
  })
}

function reset() {
  $('#reset').on('click', function() {
    turn = 0;
    $('td').each(function() {
      $(this).text("");
    })
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
       $('.old-games').append('<li class="old" id=' + data[i]['id'] + '>' + data[i]['id'] + '</li>');
    })
  })
}

function showOldGame() {
  $(document.body).on('click', '.old', function() {
    var oldBoard = [];
    var thisId = $(this).attr('id');
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
  });
}


function saveGame() {
  $(document.body).on('click', '#save', function() {
    endGame();
 });
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
