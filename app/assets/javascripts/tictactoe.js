var turn = 0

var currentGame = 0

var winCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

var player = () => turn % 2 ? 'O' : 'X';

// function player() {
//   if (turn % 2 === 0) {
//     return "X";
//   } else {
//     return "O";
//   }
// }

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $("td").click(function() {
    if (!$.text(this) && !checkWinner())
      doTurn(this);
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGames());
  $('#clear').on('click', () => clearGame());

}

function saveGame() {
  var state = $("td").toArray().map((el) => { return el.innerHTML });
  var boardState = {state: state};

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: boardState
    });
  } else {
      $.post("/games", boardState, function(game) {
        //the POST route goes to #create controller method, creates new game with boardState attributes
      currentGame = game.data.id
  });
  }
}

function previousGames() {
  //clear out the games div so nothing is repeated
  $('#games').empty();
  $.get("/games", function(games) {
    //Games is a data object we can iterate over
    games.data.forEach(function(game) {
      $('#games').append(`<button data-id="${game.id}" onclick="loadGame(${game.id})">${game.id}</button><br>`);
    });
  });
}

function loadGame(id) {
  $.get(`/games/${id}`, function(game) {
    //array of the state of selected game
    let boardState = game.data.attributes.state
    turn = boardState.join("").length
    currentGame = game.data.id;

    let i = 0;
    boardState.forEach(function(square) {
      $("td")[i].innerHTML = square;
      i++;
    });
  });
}

function clearGame() {
  resetBoard();
}


function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    //Tie game message not working
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function updateState(td) {
  $(td).html(player());
}

function setMessage(message) {
  console.log(message);
  $("#message").html(message);
}

function checkWinner() {
  var winner = false;
  
  // generate board object
  // var board = {};
  // $("td").text((index, square) => (board[index] = square));
  var board = $("td").toArray().map((el) => { return el.innerHTML })

  winCombinations.forEach(position => {
    if (
      board[position[0]] === board[position[1]] &&
      board[position[1]] === board[position[2]] &&
      board[position[0]] !== ""
    ) {
      setMessage(`Player ${board[position[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

function resetBoard(){
  $('td').empty();
  turn = 0;
  currentGame = 0;
}






