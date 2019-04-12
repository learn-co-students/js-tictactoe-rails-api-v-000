// Code your JavaScript / jQuery solution here
$(document).ready(function() {
    attachListeners();
  });

var turn = 0;
var gameId = 0;

var winCombinations = [
    [0,1,2], [3,4,5], [6,7,8], 
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

function player() {
    return ( turn % 2 === 0 ? "X" : "O");
}

function updateState(square) {
    square.innerHTML = player(); 
}

function currentState() {
    const squares = document.querySelectorAll('td');
    let state = [];
    squares.forEach(square => state.push(square.innerHTML));
    return state;
  }

function setMessage(string) {
    const gameMessage = document.getElementById('message');
    return gameMessage.innerHTML = string
}

function saveGame() {
    currentState().save 
}

function resetGame() {
    $('td').empty();

    gameID = 0;
    turn = 0;
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
      setMessage("Tie game.");
      saveGame();
      resetGame();
    };
  }

  function attachListeners() {
    const saveButton = document.getElementById("save")
    const previousButton = document.getElementById("previous")
    const clearButton = document.getElementById("clear")

    saveButton.addEventListener("click", saveGame);
    previousButton.addEventListener("click", previousGame);
    clearButton.addEventListener("click", resetGame);
  };
  