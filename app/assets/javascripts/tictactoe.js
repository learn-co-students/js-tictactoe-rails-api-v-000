// Code your JavaScript / jQuery solution here
var turn = 0;
// var squares; //hoisting trick part 1.
// var squares = document.querySelectorAll('td'); //why won't this load
var winCombinations = [[0,1,2],[3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

$(document).ready(function() {
  console.log("ready")
  attachListeners();
  saveGame();
  getPreviousGames();
  clearBoard();
  loadSavedGame();
  // squares = document.querySelectorAll('td'); //hoisting trick pt 2.
});

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(square) {
  square.innerHTML = player();
}

function setMessage(message) {
  $('#message').text(message);
}

function checkPositionTaken(square) {
  return square.innerHTML !== "";
}

function checkWinner() {
  var squares = document.querySelectorAll('td');
  var winnerPresent = winCombinations.filter(function(combo){
    return (squares[combo[0]].innerText === squares[combo[1]].innerText && squares[combo[1]].innerText === squares[combo[2]].innerText && checkPositionTaken(squares[combo[0]]))
  });
  if (winnerPresent.length > 0) {
    saveBoardState();
    setMessage(`Player ${squares[winnerPresent[0][0]].innerText} Won!`);
    return true;
  } else {
    return false;
  }
}

function doTurn(square) {
  updateState(square)
  turn++;
  if (checkWinner()) {
    $('td').empty();
    turn = 0;
  } else if (turn === 9 ) {
    saveBoardState();
    setMessage('Tie game.');
    $('td').empty();
    turn = 0;
  }
}

function attachListeners() {
  $("td").on('click', function() {
    //this...magically knows that you clicked on a specific square??
    //ANSWER: td is a square, not a table
    if (this.innerText === "" && checkWinner() === false && turn !== 9) {
      doTurn(this);
    }
  })
}

function saveGame() {
  $("#save").on('click', function() {
    saveBoardState();
  }); //onclick
} //saveGame

function saveBoardState() {
  var board = $("table").children().children().children();
  var boardArr = [];
  for (square of board) {
    boardArr.push(square.innerHTML);
  }
  if ($("table").attr("gameid")) {
    var id = $("table").attr("gameid");
    var patchRequest = $.ajax({
      url: '/games/' + id,
      data: { 'state[]' : boardArr },
      type: 'PATCH',
      contentType : 'application/json',
      processData: false,
      dataType: 'json'
    })
  } else {
    var postRequest = $.post('/games', { 'state[]': boardArr })
    postRequest.done(function(renderedJSONHash) {
      var id = renderedJSONHash.data.id;
      $("table").attr("gameid", id);
    })
  }
}

function getPreviousGames() {
  $("#previous").on('click', function() {
    $("#games").empty();
    $.get('/games', function(resp) {
      var games = resp.data;
      games.map((game => $("#games").append("<button class=js-load data-id=" + game.id + ">" + game.id +"</button><br>")))
    });
  });
}

function clearBoard() {
  $("#clear").on('click', function() {
    $('td').empty();
    $('table').removeAttr('gameid');
    turn = 0;
  });
}

function setTurn() {
  var turnCount = 0;
  var board = $("table").children().children().children();
  for (square of board) {
    if (square.innerHTML !== "") {
      turnCount ++;
    }
  }
  turn = turnCount;
}

function loadSavedGame() {
  $("#games").on('click', "button.js-load", function() {
    var id = $(this).attr('data-id');
    $.get('/games/' + id, function(resp) {
      var savedBoard = resp.data.attributes.state
      var boardOnDisplay = $("table").children().children().children();
      for (var i = 0; i < boardOnDisplay.length; i++) {
        boardOnDisplay[i].innerHTML = savedBoard[i];
      }
      setTurn();
      $("table").attr("gameid", id);
    });
  });
}
