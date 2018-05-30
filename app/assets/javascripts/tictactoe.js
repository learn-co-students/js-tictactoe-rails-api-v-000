// Code your JavaScript / jQuery solution here
var WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
var currentGame = 0;

var turn = 0;

let game;

let clicked = 0;

$(document).ready(function() {
  attachListeners();
});


function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function updateState(square) {
  $(square).text(player())
  // var gamestate = []
  // gamestate =
}

function setMessage(message) {
  $("#message").text(message);
}

function checkWinner() {
  var winner = false;
  var board = {}

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })

  return winner;
}

function resetGame() {
  $('td').empty();
  turn = 0;
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner() === true) {
    saveGame()
    resetGame()
  } else if (turn === 9 && checkWinner() !== true) {
    saveGame()
    setMessage("Tie game.")
    resetGame()
  }
}

function attachListeners() {
  console.log($('td'));
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
}

$(document).ready(function() {
  $("#save").click(function() {
    saveGame()
  });

  $("#games").click(function(event){
    var state = event.target.dataset.state.split(',')
    currentGame = event.target.dataset.id
    turn = 0
    state.forEach(function(square){
      if (square !== ""){
      turn+= 1}
    })
    $('td').each(function(i){
      $(this).text(state[i])
    })
  })

  $("#previous").click(function() {
    $("#games").html("")
    $.get("/games", function(savedGames) {
      console.log(savedGames)
      if (savedGames.data.length > 0) {
        savedGames.data.forEach(function(game) {
          $("#games").append(`<button data-state="${game.attributes.state}" data-id=${game.id}>${game.id}</button>`)
            $.get(`/games/${game.id}`)
          currentGame = game.id
        })
      }
    })
  });

  $("#clear").click(function() {
    resetGame()
  //  alert("You started a new game.");
  });
});

function saveGame() {
  //square is equal to a specific position on the board.
  let board = $("td").map(function(square) {
    return this.innerHTML
  }).get()

  let gameBoardInfo = {
    state: board
  }

  if(currentGame === 0) {
    $.post("/games", gameBoardInfo)
      .then(function(game) {
        currentGame = game.data.id
      })
  } else {
    $.ajax({
      type: "PATCH",
      url: `/games/${currentGame}`,
      data: gameBoardInfo,
    })
  }
  // else if(currentGame !== game.data.id && currentGame !== 0) {
  //   $.post("/games", gameBoardInfo).then(function(game) {
  //     currentGame = game.data.id
  //   })
  // }

  alert("The game was saved.");
}
