
var turn = 0;
var gameId = 0;

function doTurn(td) {
  updateState(td);
  var won = checkWinner()
  turn++;

  var tie = !won && turn === 9;
  var gameOver = won || tie;

  if (gameOver) {
    if (tie) {
      setMessage("Tie game.");
    }
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $("td").empty();
  turn = 0;
  gameId = 0;
}

function updateState(td) {
  $(td).text(player());
}

function setMessage(msg) {
  $("div#message").html(msg);
}

function getBoardArray() {
  var tds = Array.from(document.getElementsByTagName("td"));
  return tds.map(td => td.innerHTML);
}

function checkWinner() {
  var board = getBoardArray();
  var winningCombos = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];;

  var x = 0;
  var win = false;

  while (!win && x < winningCombos.length) {
    if (board[winningCombos[x][0] - 1] === board[winningCombos[x][1] - 1] && board[winningCombos[x][0] - 1] === board[winningCombos[x][2] -1] && board[winningCombos[x][0] - 1] !== "") {
      win = true;
      var winner = board[winningCombos[x][0] - 1];
      var msg = `Player ${winner} Won!`;
      setMessage(msg)
    }
    x++;
  }

  return win;
}

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function saveGame() {
  var currentGame = { "state": getBoardArray() };

  if (gameId === 0) {
    // create a new instance the game
     $.post("/games", currentGame, function(resp) {
       gameId = parseInt(resp.data.id);
     })
   } else {
    //  if the game has update been saved to the db and the user clicks save, update it
     $.ajax({
       url: `/games/${gameId}`,
       method: "PATCH",
       data: currentGame
     })
  }
}

function loadBoard(id) {
  gameId = id

  $.get(`/games/${id}`, function(resp) {
    $('td').toArray().forEach((el, i) => {
      el.innerHTML = resp.data.attributes.state[i];

      if (el.innerHTML != "") {
        turn++;
      }
    })
  })
}

function attachListeners() {
  $("td").on("click", function(e) {
    e.preventDefault();
    if (this.innerHTML === "" && !checkWinner()) {
      doTurn(this)
    }
  })

  $("#previous").on("click", function(e) {
      // AJAX interactions with the Rails API Clicking the button#previous element sends a GET request to the "/games" route: (clear children before attaching)
      $("#games").empty();

      $.get("/games", function(response) {
        console.log(response)
        var buttons = "";

        response.data.forEach(game => {
          $("#games").append(`<button data-id="${game.id}" onclick="loadBoard(${game.id})">${game.id}</button>`)
        })

      });
  })

  $("#save").on("click", function() {
      // button#save element when the current game has not yet been saved sends a POST request to the "/games" route:
      console.log("save")
      saveGame();
  })

  $("#clear").on("click", function(e) {
      //  when an unsaved game is in progress clears the game
      resetBoard();
  })
}

$(function() {
  attachListeners();
})
