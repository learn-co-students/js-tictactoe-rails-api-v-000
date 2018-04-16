// Code your JavaScript / jQuery solution here
var turn;
var gameId;
$(document).ready(initialize)

function initialize() {
  attachListeners();
  turn = 0;
  gameId = undefined;
}

function player() { // X=even, Y=odd
  if ((turn % 2) === 0) {
    return "X"; 
  } else {
    return "O";
  }
}

function updateState(el) { // Pass an element to update it with the current player's symbol
  const x = el.attributes[0].nodeValue; // Get x coordinate (0-2)
  const y = el.attributes[1].nodeValue; // Get y coordinate (0-2)
  let square = $(`[data-x=${x}][data-y=${y}]`);

  if (square.text() === "") {
    square.text(player());
    return true;
  } else {
    return false;
  }
}

function setMessage(string) {
  $("#message").text(string);
}

function checkWinner() {
  let xSpots = [];
  let o_spots = [];
  let win = [
    [0,1,2],[0,3,6],[0,4,8],[6,4,2],[2,5,8],[6,7,8],[3,4,5],[1,4,7]
  ];
  let square;

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      square = $(`[data-x=${x}][data-y=${y}]`).text()

      if (square === "X") {
        xSpots.push(x + y*3);
      } else if (square === "O") {
        o_spots.push(x + y*3);
      }
    }
  }

  // Check each player's spots for a win combination
  for (let i = 0; i < win.length; i++) {
    if (xSpots.includes(win[i][0]) 
      && xSpots.includes(win[i][1]) 
      && xSpots.includes(win[i][2])) {
        setMessage('Player X Won!');
        return true;  
    } else if (o_spots.includes(win[i][0]) 
      && o_spots.includes(win[i][1]) 
      && o_spots.includes(win[i][2])) {
        setMessage('Player O Won!');
        return true;
    } 
  }
  // -- code will only get here if no player has won ---
  // If board is full, it's a tie
  if (fullBoard()) {
    setMessage('Tie game.');
  }
  return false;
}

function doTurn(el) {
  if (updateState(el)) {
    turn += 1;
  }
  if (checkWinner()) {
    saveGame();
    resetGame();
  } else if (fullBoard()) {
    // Must be a draw
    saveGame();
    resetGame();
  }
  /*
  updateState(el);
  turn++;
  */
}

function attachListeners() {
  // Add listeners to board
  const squares = window.document.querySelectorAll('td');
  for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener("click", function(event) {
      if (!checkWinner()) {
        doTurn(event.currentTarget);
      }
    });
  }
  
  // Add listener to 'Save' button
  document.getElementById("save").addEventListener("click", saveGame);
  
  // Add listener to 'Previous' button
  document.getElementById("previous").addEventListener("click", previousGames);
  
  // Add listener to 'Clear' button
  document.getElementById("clear").addEventListener("click", resetGame)
}

function previousGames() {
  $.get("/games", function(response) {
    let games = response.data;
    let htmlString = "";
    
    for (let i = 0; i < games.length; i++) {
      htmlString += `<button type="button" onclick="loadGame(this)" data-loadid="${games[i].id}">${games[i].id}</button><br>`;
    }
    $("#games").html(htmlString);
  });
}

function saveGame() {
  const squares = window.document.querySelectorAll('td');
  let board = {state: []};
  
  for (let i = 0; i < squares.length; i++) {
    board.state.push(squares[i].textContent);
  }
  
  if (gameId) {
    // Save existing game
    const req = new XMLHttpRequest();
    req.addEventListener("load", function() {});
    req.open("PATCH", `/games/${gameId}`);
    req.send(board);
  } else {
    // Save new game
    $.post("/games", board, function(response) {
      gameId = response.data.id;
    });
  }
}

function resetGame() { // Clears board and resets turn to 0
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      $(`[data-x=${x}][data-y=${y}]`).text("");
    }
  }
  gameId = undefined;
  turn = 0;
}

function loadGame(el) {
  let loadId = el.dataset.loadid;
  let x = 1;
  
  const req = new XMLHttpRequest();
  req.addEventListener("load", function() {
    let response = JSON.parse(this.response);
    let gameState = response.data.attributes.state;
    
    // Load game board
    const squares = window.document.querySelectorAll('td');
    for (let i = 0; i < squares.length; i++) {
      squares[i].textContent = gameState[i];
      
      // Load turn 
      if (squares[i].textContent != "") {
        turn += 1;
      }
    }
    
    // Record game ID
    gameId = loadId;
  });
  req.open("GET", `/games/${loadId}`);
  req.send();
}

function endGame() {
  return (checkWinner() || fullBoard());
}

function fullBoard() { // Helper function to check if board is full
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if ($(`[data-x=${x}][data-y=${y}]`).text() === "") {
        return false;
      }
    }
  }
  return true;
}

