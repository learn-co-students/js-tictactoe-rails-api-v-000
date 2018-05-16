// Code your JavaScript / jQuery solution here

$(document).ready(function() {
  attachListeners();
});

 const winCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ];

 var turn = 0;
 var currentGame = 0;

 var player = function () {
   return turn % 2 === 0 ? "X" : "O" ;
 }

 var updateState = function (el) {
   $(el).text(player());
 }

 var setMessage = function (string) {
   $("#message").text(string);
 }

 var getBoard = function() {
   // var board = {};
   // // debugger;
   // $('td').text((i, cell) => board[i] = cell);
   // return board;
   var arr = Array.prototype.slice.call( $("td") );
   return arr.map(td => { return td.innerText });
 }

 var checkWinner = function() {
  var board = getBoard();//{};
  var won = false;
  // debugger
  winCombinations.find(combo => {
    if (board[combo[0]] != "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      var message = `Player ${board[combo[0]]} Won!`;
      console.log(message);
      setMessage(message);
      won = true;
    }
  });

  // return winner;
  //  var currentBoard = getBoard();
  //  let won = false;

  //  var returnCombo = winCombinations.find(combo => {
  //    return (currentBoard[combo[0]] === currentBoard[combo[1]] && currentBoard[combo[1]] === currentBoard[combo[2]] && currentBoard[combo[1]] !== "")
  //  });

  //  if (returnCombo !== undefined) {
  //   let winner = currentBoard[returnCombo[0]];
  //   setMessage(`Player ${winner} Won!`);
  //   won = true;
  //  }
  return won;
 }

 var doTurn = function(td) {
  updateState(td);
  turn++;

  if (checkWinner()) {
    saveGame();
    clearBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    clearBoard();
  } else {
    return false;
  }
 }

 function attachListeners() {
  $("td").on("click", function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => clearBoard());
}

function clearBoard() {
  $("td").html("");
  $("#message").html("");
  turn = 0;
  currentGame = 0;
}

function saveGame() {
  var board = getBoard();
  if (currentGame != 0) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: {"state": board}
    });
  } else {
    $.post('/games', {"state": board}, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<div><button id="gameid-${game.data.id}">${game.data.id}</button></div>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}

function reloadGame(gameId) {
    $.get("/games/" + gameId, function(data) {
      const id = data.data.id;
      const state = data.data.attributes.state;

      let index = 0;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          document.querySelector(`[data-x="${j}"][data-y="${i}"]`).innerHTML = state[index];
          index++;
        }
      }

    turn = state.join('').length;
    currentGame = id;
    });
}


// THIS WORKS BRILLIANTLY BELOW BUT THE TESTS DON'T PASS
// function showPreviousGames() {
//   // $('#games').empty();
//   $.get("/games", function(games) {
//     html = "";

//     games.data.forEach((game) => {
//       html += "<div><button onclick='reloadGame(" + game.id + ")'>" + game.id + "</button></div>"
//     })

//     $('#games').append(html);
//   });
// }

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame);
    }
  });
}
// And this is just to attach the listener... 
function buttonizePreviousGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}
