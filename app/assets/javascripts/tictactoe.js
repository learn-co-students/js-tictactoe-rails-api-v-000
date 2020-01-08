// Code 

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  Array.from(document.getElementsByTagName('td')).forEach(function(element){
    element.addEventListener("click", function(event) {
      if (!checkWinner()) {
        doTurn(element);
      };
    });
  });
  $('button#previous').on("click", showGames);
  $('button#save').on("click", saveGame);
  $('button#clear').on("click", clearGame);
}

const board = function() {
  let arr = []
  $('td').each(function() {
    arr.push(this.innerHTML);
  });
  return arr;
}

const winCombinations =  [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]];

var turn = 0
var gameId = 0

function player() {
  return (((turn % 2) == 1) ? 'O' : 'X');
}

function updateState(element) {

  if (element.innerHTML === "") {
    element.innerHTML = (player());
  } else {
    --turn
    setMessage("Play Somewhere Else.")
  }
};

function setMessage(string) {
  $('div#message').html(string);
}

function doTurn(element) {

  updateState(element);
  turn++
  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9){
    setMessage("Tie game.");
    saveGame();
    clearGame();
  }
}

function checkWinner() {

  function matchesComboX(el) {
     return board()[el] === 'X'
  };
  function matchesComboO(el) {
     return board()[el] === 'O'
  };
  var oWinner = winCombinations.some(function(combination) {
    return combination.every(matchesComboO) === true;
  });
  var xWinner = winCombinations.some(function(combination) {
    return combination.every(matchesComboX) === true;
  });

  if (oWinner) {
    setMessage('Player O Won!');
    return true;
  } else if (xWinner) {
    setMessage('Player X Won!');
    return true;
  } else {
    return false;
  }
}

function showGames() {
  $.get("/games", function(data){
    if (data.data !== []) {
      $.each(data.data, function(i, item) {
        if ($(`#games #${item.id}`).length < 1) {
          $('div#games').append(`<button id="${item.id}">${item.id}</button><br>`);
          $(`#${item.id}`).on("click", function() {
            getGame(item.id);
          });
        };
      });
    };
  });
}

function getGame(itemId) {
  $.get(`/games/${itemId}`, function(data) {
    gameId = data.data.id
    var newBoard = data.data.attributes.state
    turn = newBoard.join("").length
    var i = 0
    var currentBoard = Array.from(document.getElementsByTagName('td'))
    currentBoard.forEach(function(square) {
      square.innerHTML = newBoard[i];
      i++
    })
  });
}

function saveGame() {
  var state = board();
  var gameData = { state: state };

  if (gameId) {
    $.ajax({
      url: `/games/${gameId}`,
      type: 'PATCH',
      data: gameData,
    });
  } else {
    $.post("/games", gameData, function(data) {
      gameId = data.data.id;
      $('div#games').append(`<button id="${data.data.id}">${data.data.id}</button><br>`)
    });
  }
}

function clearGame() {
  turn = 0;
  gameId = 0;
  Array.from(document.getElementsByTagName('td')).forEach(function(element){
    element.innerHTML = ""
  });
}