window.onload = () => {
  attachListeners();
};

// $(function() {
//   attachListeners();
// })


const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
var games ={};
var turn = 0;
var gameNumber = 0;

function attachListeners() {
  // document.getElementById("save").addEventListener("click", saveGame);
  // document.getElementById("previous").addEventListener("click", previousGame);
  // document.getElementById("clear").addEventListener("click", clearGame);
  // document.querySelectorAll("td").addEventListener("click", function() {
  //   if (!checkWinner() && !$.text(this)) {
  //     doTurn(this);
  //   }
  // });
  $("#save").on("click", saveGame);
  $("#save").on("previous", previousGame);
  $("#save").on("clear", clearGame);
  $("td").on("click", function() {
    if (!checkWinner() && !$.text(this)){
      doTurn(this);
      }
    });
}

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(string) {
  $.get("#message").innerHTML = string;
  document.getElementById("message").innerHTML = string;
}

function doTurn(square) {
  updateState(square)
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn ===9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function checkWinner() {
  let winner = false;
  let board =[];
  let squares = document.querySelectorAll("td");
  $("td").text((index, square) => board[index]=square);
  winningCombinations.some(function(combination) {
    if (board[combination[0]] !=="" && board[combination[0]] === board[combination[1]] && board[combination[1]] === board[combination[2]]) {
      setMessage(`Player ${board[combination[0]]} Won!`);
      return winner=true;
    }
  })
   return winner;
}

function getState() {
  let state=[];
  $("td").text((index, square) =>{
    state.push(square);
  });
}

function saveGame() {
  let savedGame={state: getState()}
  if (gameNumber) {
    $.ajax({
      type: (!!gameNumber) ? "PATCH" : "POST",
      url: `/games/${gameNumber}`,
      data: savedGame,
    })
  }
  else 
  $.post("/games", savedGame, function () {

  })
}

function previousGame() {
  $("#games").empty();
  $.get("/games", function (response) {
    games = response.games;
    showGames();
  })
}

function showGames() {
  $list=$("#games")
  $list.empty();
  if (!!games) {
    games.forEach((game) => {
      $li=$("<li>");
      $li.text(game.id);
      $li.on("click", function() {
        loadGame(this);
      })
      $list.append($li);
    })
  }
}

function loadGame() {

}

function clearGame() {
  gameNumber++;
  resetBoard();
}

function resetBoard() {
  $("td").empty();
  turn=0;
  gameNumber=0;
  $.get("#message").innerText='';
}
