$(document).ready(attachListeners)

const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
 var turn = 0
 var currentGame = 0
function player() {
  if ((turn % 2) === 1) {
    return "O"
  } else {
    return "X"
  }
}

function updateState(square) {
  square.innerHTML = player()
}

function setMessage(string) {
  $("#message").html(string)
}

function checkWinner() {
  let counter = false
  WINNING_COMBOS.forEach(function(combo){

    if (document.querySelectorAll("td")[combo[0]].innerHTML !== "" && document.querySelectorAll("td")[combo[0]].innerHTML === document.querySelectorAll("td")[combo[1]].innerHTML && document.querySelectorAll("td")[combo[1]].innerHTML === document.querySelectorAll("td")[combo[2]].innerHTML) {
      if (document.querySelectorAll("td")[combo[0]].innerHTML === "X") {
        setMessage("Player X Won!");
        counter = true;
      } else {
        setMessage("Player O Won!");
        counter = true;
      }
    }
  })

  return counter
}

function doTurn(square) {
    updateState(square)
    turn++
    const status = checkWinner()

    if (status === false && document.querySelectorAll("td")[0].innerHTML !== "" && document.querySelectorAll("td")[1].innerHTML !== "" && document.querySelectorAll("td")[2].innerHTML !== "" && document.querySelectorAll("td")[3].innerHTML !== "" && document.querySelectorAll("td")[4].innerHTML !== "" && document.querySelectorAll("td")[5].innerHTML !== "" && document.querySelectorAll("td")[6].innerHTML !== "" && document.querySelectorAll("td")[7].innerHTML !== "" && document.querySelectorAll("td")[8].innerHTML !== "") {
      saveGame()
      setMessage("Tie game.")
      resetBoard()
    } else if (status === true) { debugger
      saveGame()
      resetBoard()
    }

}

function iWasClicked() {
  if (this.innerHTML === "") {
    doTurn(this)
  }
}

function attachListeners() {
  let square
  for (i=0; i<9; i++) {
    square = document.querySelectorAll("td")[i]
    square.addEventListener("click", iWasClicked)
  }

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function removeListeners() {
  let square
  for (i=0; i<9; i++) {
    square = document.querySelectorAll("td")[i]
    square.removeEventListener("click", iWasClicked)
  }
}

function resetBoard() {
  for (i=0; i<9; i++) {
    document.querySelectorAll("td")[i].innerHTML = ""
  }
  turn = 0;
  currentGame = 0;
}

function saveGame() {
  var state = []
  var gameData;

  for (i=0; i<9; i++) {
      state.push(document.querySelectorAll("td")[i].innerHTML)
  }
  gameData = { state: state }

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    })
  } else {
    $.post('/games', gameData, function(game) { 
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">Game # ${game.data.id}</button><br>`)
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    })
  }

}

function buttonizePreviousGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function reloadGame(gameID) {
  document.getElementById('message').innerHTML = ''

  $.get(`/games/${gameID}`, function(game) {
    currentGame = game.data.id
    const state = game.data.attributes.state

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }

    turn = state.join('').length;

    // if (!checkWinner() && turn === 9) {
    //      setMessage('Tie game.');
    //    }
  })
}

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame);
    }
  });
}
