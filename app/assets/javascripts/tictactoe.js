// Code your JavaScript / jQuery solution here
  var turn = 0;

  var gameId = 0;

  var WIN_COMBINATIONS = [
     [0,1,2],
     [3,4,5],
     [6,7,8],
     [0,3,6],
     [1,4,7],
     [2,5,8],
     [0,4,8],
     [2,4,6]
  ]

  function resetGame(){
    gameId = 0;
    turn = 0;
    $("td").text("");
  }

// Returns the token of the player whose turn it is, 'X' when the turn variable is even and 'O' when it is odd.

function player() {
  if(turn & 1){
    return 'O'
  } else {
    return 'X'
  }
}

// Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.

  function updateState(space){
    return $(space).text() !== "" ? false : $(space).text(player());
  }

  // Accepts a string and adds it to the div#message element in the DOM.

  function setMessage(string){
    $("#message").text(string);
  }

  function getBoard() {
    return $("td").toArray().map(element => element.innerHTML);
  }

  // Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
  // If there is a winning combination on the board, checkWinner() should invoke setMessage(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'

  function checkWinner(){
    let board = getBoard();
    let winner = false;

    $('td').text((index, square) => board[index] = square);

    WIN_COMBINATIONS.some(function(combo) {
      if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        setMessage(`Player ${board[combo[0]]} Won!`);
        return winner = true;
      }
    });
    return winner;
  }


  // Increments the turn variable by 1.
  // Invokes the updateState() function, passing it the element that was clicked.
  // Invokes checkWinner() to determine whether the move results in a winning play.

  function doTurn(space){
    if (updateState(space)){
      turn ++
      if(checkWinner()) {
        saveGame();
        resetGame();
      } else if(turn === 9){
        setMessage("Tie game.");
        saveGame();
        resetGame();
      }
    }
  }

  function getGame(id) {
    gameId = id;
    turn = 0;
    $.get(`/games/${id}`, function(data) {
      let tds = $('td').toArray();
      data['data']['attributes']['state'].forEach(function(space, idx) {
        space !== "" ? turn += 1 : turn = turn;
        $(tds[idx]).text(space);
      });
    });
  }

  function saveGame() {
    let board = {state: getBoard()};
    if (gameId === 0) {
      $.post('/games', board).done(function(data) {
        gameId = data['data']['id'];
      });

    } else {
      $.ajax({
        type: "PATCH",
        url: `/games/${gameId}`,
        data: board
      })
    }
  }

  // Attaches the appropriate event listeners to the squares of the game board as well as for the button#save, button#previous, and button#clear elements.
  // When a user clicks on a square on the game board, the event listener should invoke doTurn() and pass it the element that was clicked.
  // NOTE: attachListeners() must be invoked inside either a $(document).ready() (jQuery) or a window.onload = () => {} (vanilla JavaScript). Otherwise, a number of the tests will fail (not to mention that your game probably won't function in the browser).
  // When you name your save and previous functions, make sure to call them something like saveGame() and previousGames(). If you call them save() and previous() you may run into problems with the test suite.

  function attachListeners(){
    $("td").click(function() {
      checkWinner() ? false : doTurn(this);
    })

    $("#save").click(saveGame);

    $("#previous").on("click", function () {
      $.get("/games", function(data) {
        $("#games").text("");
        data['data'].forEach(function(game) {
          let id = game['id'];
          $("#games").append(`<button data-id='${id}' onclick='getGame(${id})'>${id}</button><br>`);
        });
      });
    });

    $("#clear").click(resetGame);
  }

  $(function() {
    attachListeners();
  })
