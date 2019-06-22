// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;
var currentGame = 0;


$(document).ready(function() {
    attachListeners();
});

function player() {
    if (turn % 2 ===0) {
        return 'X';
    } else {
        return 'O';
    }
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(message) {
    $('#message').text(message);
}

function checkWinner() {
    var winner = false;
    var board = {};
    $('td').text((index, square) => board[index] = square);

    WINNING_COMBOS.forEach(function(position) {
        if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== ""){
            setMessage(`Player ${board[position[0]]} Won!`)
            return winner = true;
        }
    })

    return winner;
}

function doTurn(square) {
    updateState(square);
    turn++;
    if (checkWinner()) {
      saveGame();
      clearBoard();
    } else if (turn === 9) {
      saveGame();
      setMessage("Tie game.");
      clearBoard();
    }
}

function clearBoard() {
  $("td").empty();
  turn = 0;
  currentGame = 0;
}

function attachListeners() {
    $('td').click(function() {
        if (!$.text(this) && !checkWinner()) {
            doTurn(this);
          }
    });

    $('#save').click(function(e) {
        saveGame();
      });

    $('#previous').click(function(e) {
       previousGame();
     });

    $('#clear').click(function(e) {
       clearBoard();
       $('#message').empty();
     });


}

function saveGame() {
  var state = Array.from($("td"), td => td.innerText)
  var params = { state: state }
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: params
    });
  } else {
    $.post("/games", params, function(resp) {
      currentGame = resp.data.id;
      setMessage("Game saved.");

    })
  }
}

  function previousGame() {
    $("div#games").html('');
    $.get('/games', function(games) {
      if (games.data.length > 0) {
        games.data.forEach(function(game){
          var id = game["id"];
          console.log(id)
          var button = '<button id="game-' + id + '">' + id + '</button>'
          $("div#games").append(button);
          $(`#game-${id}`).on('click', () => loadGame(id));
        });
      }
    })
  }


  function loadGame(id){
    $.get(`/games/${id}`, function(game) {
      state = game.data.attributes.state
      squares = document.querySelectorAll("td")
      currentGame = id;
      turn = state.join("").length;
      var i = 0;
      squares.forEach(function(square) {
        square.innerHTML = state[i];
        i++;
      })
    })
  }