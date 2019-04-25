// Code your JavaScript / jQuery solution here
$(document).ready(function() {
   td_nodes = document.querySelectorAll("td")
  attachListeners();
  $("#previous").on('click', previousGames);
  $("#save").on('click', saveGame);
  $("#clear").on('click', resetBoard)
});

var currentGame = 0
var td_nodes
var turn = 0


const  WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(element) {

  $( element ).text( player() );
}

function setMessage(string) {
  document.getElementById('message').innerHTML = string;
}

function checkWinner() {
  let winner = false
  WIN_COMBINATIONS.forEach((combo) => {
      if (td_nodes[combo[0]].innerHTML == td_nodes[combo[1]].innerHTML && td_nodes[combo[1]].innerHTML == td_nodes[combo[2]].innerHTML &&  td_nodes[combo[1]].innerHTML != "") {
        setMessage(`Player ${td_nodes[combo[0]].innerHTML} Won!`)
        return  winner = true
        }
  });
  return winner
}

function resetBoard() {
  turn = 0;
     td_nodes.forEach((td) => {
       td.innerHTML = "";
     });
  currentGame = 0
}

function doTurn(element) {
  updateState(element);
  turn++;
   if (checkWinner()) {
    saveGame();
    resetBoard();
    } else if (turn == 9) {
     setMessage("Tie game.");
     saveGame();
     resetBoard();
   }
}

 function attachListeners() {
  $( "td" ).on( "click", function() {
    if (!this.innerHTML && !checkWinner()) {
      doTurn(this)
    }
  });
 }

 function isButton(buttonId) {
   const buttons = $("#games").children();
   if (buttons.length === 0) {
     return false
   }
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].id === buttonId) {
        return true
      }
    }
    return false
 }

 function previousGames() {
      $.get("/games", function(data) {
        for (let i = 0; i < data.data.length; i++) {
          currentGame = data.data[i].id
          buttonId = `game_id_${currentGame}`
          if (!isButton(buttonId)) {
            $('#games').append(`<button id="${buttonId}">${currentGame}</button>`)
            $(`#${buttonId}`).on('click', function() {
              currentGame = this.innerHTML
              reloadGame(currentGame);
             })
          }
        }
      });
 }

function saveGame() {
  gameState = []
  for (let i = 0; i < td_nodes.length; i++) {
    gameState.push(td_nodes[i].innerHTML)
  }
  if (parseInt(currentGame) === 0) {
      $.post('/games', { state: gameState }, function(response) {
      currentGame = response.data.id
       console.log(currentGame)
      $('#games').append(`<button id="game_id_${currentGame}">${currentGame}</button>`)
      $(`#game_id_${currentGame}`).on('click', () => reloadGame(currentGame))
      });

  } else {
    $.ajax({
      type : 'PATCH',
      url : `/games/${currentGame}`,
      contentType: 'application/json',
      data : JSON.stringify({state: gameState})
      });
    }
}

 function checkTurn(stateArr) {
   turn = stateArr.join("").length
   if (!checkWinner() && turn === 9 ) {
    setMessage("Tie game!")
   } else if (turn < 9 && !checkWinner()) {
     setMessage("Game in progress")
   }
 }

function reloadGame(id) {
  const req = new XMLHttpRequest()
  req.overrideMimeType("application/json")
  req.open("GET", `/games/${id}`, true)
  req.onload = () => {
    const data = JSON.parse(req.responseText).data
    const state = data.attributes.state
    let index = 0
    for (let y = 0; y < 3; y++ ) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x = "${x}"][data-y = "${y}"]`).innerHTML = state[index]
        index++;
      }
    }
    currentGame = data.id
    checkTurn(state);
  }
  req.send(null)
}
