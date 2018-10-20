// Code your JavaScript / jQuery solution here
self.turn = 0;
var currentGame = 0;

function player() {

  if (self.turn % 2 === 0 || isNaN(self.turn)) {
    return 'X'
  }
  if (self.turn % 2 > 0) {
    return 'O'
  }
}

function updateState(square) {
  square.innerHTML = self.player();
}

function setMessage(string) {
  self.document.getElementById('message').innerHTML = string;
}

function checkWinner() {
  let squares = self.document.querySelectorAll('td');
  let boardArray = [];
  let result = false;
  for (let i = 0; i < 9; i++) {
    boardArray.push(squares[i].innerHTML)
  }

  for (let i = 0; i < 7; i += 3){
    if (boardArray[i] != '' && boardArray[i] === boardArray[i+1] && boardArray[i+1] === boardArray[i+2]) {
      setMessage("Player " + boardArray[i] + " Won!");
      result = true;
    }
  }
  if (boardArray[0] != '' && boardArray[0] === boardArray[4] && boardArray[4] === boardArray[8]) {
    setMessage("Player " + boardArray[0] + " Won!");
    result = true;
  }

  if (boardArray[2] != '' && boardArray[2] === boardArray[4] && boardArray[4] === boardArray[6]) {
    setMessage("Player " + boardArray[2] + " Won!");
    result = true;
  }

  for (let i = 0; i < 3; i++){
    if (boardArray[i] != '' && boardArray[i] === boardArray[i+3] && boardArray[i+3] === boardArray[i+6]) {
      setMessage("Player " + boardArray[i] + " Won!");
      result = true;
    }
  }
  return result;
}

function resetBoard() {
  self.turn = 0;
  $('td').empty();
  currentGame = 0;
}

function doTurn(square) {

  self.updateState(square);
  self.turn += 1;

  if (self.turn === 9 && !self.checkWinner()) {
    setMessage('Tie game.');
    saveGame();
    resetBoard();
  }
  if (self.checkWinner()) {
    saveGame();
    resetBoard();
  }
}

function attachListeners() {
  let squares = self.document.querySelectorAll('td');
  let message = self.document.getElementById('message').innerHTML;
  squares.forEach(function(square) {
    $(square).on('click', function() {
      if (square.innerHTML === '' && !checkWinner()) {
        doTurn(square);
      }
    });
  })
}


function previousGames() {
  $("#previous").on("click", function() {
    $.get("/games", function(previousGames) {
      $("#games").empty()
      if (previousGames.data != [] ) {
        previousGames.data.forEach(function(game) {
          let button = document.createElement("BUTTON");
          let squares = $('td');
          let id = game.id
          button.innerHTML = id;

          $(button).on('click', function() {
            currentGame = id;

            $.get('/games/' + currentGame, function(data) {
              let turn = 0;
              let state = data.data.attributes.state;
              for (let i = 0; i < 9; i++) {
                squares[i].innerHTML = state[i];
                if (state[i] != "") {
                  turn++
                }
              }
              self.turn = turn;
            });
          });
          $("#games").append(button);
        })
      }
    });
  });
}

function saveGame() {
  let data = {};
  let state = [];
  let squares = self.document.querySelectorAll('td');
  squares.forEach(function(square) {
    state.push(square.innerHTML);
  })
  data = {state: state}
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: '/games/' + currentGame,
      data: data
    });
  } else {
    $.post('/games', data, function(game) {
      currentGame = game.data.id
    })
  }
}

function clearGame() {
  $("#clear").on("click", function() {
    resetBoard();
  })
}

$(function () {
  attachListeners();

  // previous
  previousGames();

  // save
  $("#save").on("click", function() {
    saveGame();
  })


  clearGame();

});
