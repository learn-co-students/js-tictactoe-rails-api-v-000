// Code your JavaScript / jQuery solution here
var winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

var turn = 0
var currentGame = 0

var player = () => turn % 2 ? 'O' : 'X';

function doTurn(element) {
  updateState(element)
  turn++
  if (checkWinner()) {
    saveGame()
    clearGame()
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame()
    clearGame()
  }
}

function updateState(element) {
  $(element).text(player())
}

function setMessage(message) {
  $("#message").text(message)
}

function checkWinner() {

  var board = {}
  var winner = false

  $('td').text((index, square) => board[index] = square);

  winCombos.forEach(function (combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`)
      return winner = true
    }
  })

  return winner
}

function clearGame() {
  $("td").empty();
  turn = 0;
  currentGame = 0;
}


function saveGame() {
  var state = $("td").toArray().map(x => x.innerText);

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: { state: state }
    });
  } else {
    $.post('/games', { state: state }).done(function (resp) {
      currentGame = resp.data.id
    })
  }
}

function previousGames() {
  if ($("#games").html() === "") {
    $.get('/games', function (resp) {

      var idArray = resp.data.map(x => x.id)

      idArray.forEach(x =>
        $("#games").append(`<button class="saved-games" id="${x}"> Game Number: ${x}</button><br><br>`))

      $("button.saved-games").on("click", function (e) {
        e.preventDefault()
        loadGame(this.id)
      });
    });
  }

}

function loadGame(gameId) {

  $("#message").empty()
  $.get(`/games/${gameId}`, function (resp) {

    var state = resp.data.attributes.state
    $("td").text((i, text) => state[i]);

    currentGame = gameId;
    turn = state.join("").length
    checkWinner();
  })
}

function attachListeners() {

  $("td").on("click", function () {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  })

  $("#save").click(() => saveGame())
  $("#previous").click(() => previousGames())
  $("#clear").click(() => clearGame())

}


///////////////////////////AFTER PAGE LOAD //////////


$(document).ready(function () {

  attachListeners();

})

