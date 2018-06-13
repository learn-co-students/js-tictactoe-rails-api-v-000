this.winningCombinations = [[0,1,2],
                            [3,4,5],
                            [6,7,8],
                            [0,3,6],
                            [1,4,7],
                            [2,5,8],
                            [0,4,8],
                            [2,4,6]];

this.turn = 0;
let currentGame; 

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(square) {
  square.textContent = player();
}

function setMessage(msg) {
  $("#message").text(msg);
}

function checkWinner() {
  for(combo of winningCombinations) {
    if ($("td")[combo[0]].textContent === $("td")[combo[1]].textContent && $("td")[combo[0]].textContent === $("td")[combo[2]].textContent) {
      let winner = $("td")[combo[0]].textContent;
      if(winner !== "") {
        setMessage(`Player ${winner} Won!`);
        return true;
      }
    }
  }
  return false;
}

function doTurn(square) {
  if (square.textContent === '') {
    updateState(square);
    if (full()) {
      setMessage("Tie game.");
      this.turn = 0;
      resetBoard();
    } else if (checkWinner()) {
      resetBoard();
    } else {
      this.turn++;
    }
  } else {
    setMessage("That square is already taken!")
  }
}

function full() {
  for(element of $("td")){
    if (element.textContent === "") {
      return false;
    }
  }
  return true;
}

function resetBoard() {
  for(element of $("td")) {
    element.textContent = "";
  }
}

function attachListeners() {
  for(element of $("td")) {
    element.addEventListener("click", function() {
      doTurn(this);
    })
  }

  $("#previous").on("click", function() {
    $.get('/games', function(data) {
      let games = data.data;
      if (games.length > 0) {
        //for(game of games) {
          //$("#games").append(`<button data-id=${game.id}>${game.id}</button>`);
        //}
        for(let i = $("#games").children().last().data("id") || 0; i < games.length; i++) {
          $("#games").append(`<button data-id=${i + 1}>${i + 1}</button>`);
        }
      }
    })
  })
}

function newGame() {
  let game = $.post('/games', {
    state: ["","","","","","","","",""]
  })
  game.done(function(data){
    currentGame = data.data.id;
  })
}

$(function() {
  newGame();
  attachListeners();
})