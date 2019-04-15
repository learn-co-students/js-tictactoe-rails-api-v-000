$(document).ready(function() {
    attachListeners();
  });
  
  
  var winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  var gameID = 0;
  var turn = 0;
  //tests would not pass when "let" or "const" was used instead of "var"
  
  function player() {
    return (turn % 2 === 0 ? "X" : "O")
  }
  
  function updateState(square) {
    //if (!square.innerHTML) {
      square.innerHTML = player();
    // return true;
    //}// else {setMessage('Try another space.')}; - caused tests to fail
  }
  
  function currentState() {
    const squares = document.querySelectorAll('td');
    let state = [];
    squares.forEach(square => state.push(square.innerHTML));
    return state;
  }
  
  function turnCount() {
    turn = 0;
    currentState().forEach(function(square) {
      if (square !== "") {
        turn++;
      };
    });
    return turn;
  }
  
  function setMessage(string) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = string
  }
  
  function checkWinner() {
    var values = currentState();
    var winner;
    winCombinations.forEach(function(win) {
      if (values[win[0]] == values[win[1]] && values[win[1]] == values[win[2]] && values[win[0]] !== "") {
        winner = values[win[0]]
        setMessage(`Player ${winner} Won!`)
      };
    });
    if (winner) {return true}
    else {return false}
  }
  
  function doTurn(square) {
    updateState(square)
    turn++;
    if (checkWinner()) {
      saveGame();
      resetGame();
    } else if (turn === 9) {
      setMessage('Tie game.');
      saveGame();
      resetGame();
    };
  }
  
  function resetGame() {
    $('td').empty();
    //let squares = document.querySelectorAll('td');
    //squares.forEach(function(square) {
    //  square.innerHTML = "";
    //});
    gameID = 0;
    turn = 0;
  }
  
  function saveGame() {
    if (gameID !== 0) {
      //update existing game
      $.ajax({
        type: "patch",
        url: `/games/${gameID}`,
        data: {state: currentState()}
      });
    } else {
      //create new game and save to db
      $.post("/games", {state: currentState()}, function(savedGame) {
        gameID = savedGame["data"]["id"];
      });
    }
  }
  
  function previousGames() {
    const gamesDiv = document.getElementById('games');
    var gameList = "";
    $.getJSON('/games', function(response) {
      response["data"].forEach(function(game) {
        var gameButton = `<button class="prior-game" data-id="${game["id"]}">Game ${game["id"]}</button><br>`;
        gameList += gameButton;
      });
    }).done(function() {
      gamesDiv.innerHTML = gameList
      $(".prior-game").on('click', loadGame);
    });
  }
  
  function loadGame() {
    gameID = $(this).data("id");
    $.getJSON(`/games/${gameID}`, function(response) {
      var gameState = response["data"]["attributes"]["state"];
      const squares = document.querySelectorAll('td');
      function updateSquares(square, index) {
        square.innerHTML = gameState[index];
      };
      squares.forEach(updateSquares);
      turnCount();
    });
  }
  
  function attachListeners() {
    //const squares = document.querySelectorAll('td');
    const saveButton = document.getElementById('save');
    const previousButton = document.getElementById('previous');
    const clearButton = document.getElementById('clear');
  
    $('td').on('click', function () {
      if(!$.text(this) && !checkWinner()) {
        doTurn(this);
      };
    });
    //squares.forEach(function(square) {
    //  square.addEventListener('click', doTurn);
    //}); - tests did not like this version; but still worked
    saveButton.addEventListener('click', saveGame);
    previousButton.addEventListener('click', previousGames);
    clearButton.addEventListener('click', resetGame);
  };