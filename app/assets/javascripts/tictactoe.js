// Code your JavaScript / jQuery solution here
$(function () {
  attachListeners();

})
var turn = 0;
var currentGame = 0;
var winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

const testArray = [1, 2, 3, 4]


function player() {
  if (isEven(turn)) {
    return "X"
  } else {
    return "O"
  }
}

function isEven(num) {
  if (num % 2 === 0) {
    return true;
  }
  else {
    return false;
  }
}

function doTurn(elem) {
  // console.log(elem);
 updateState(elem);
 if (checkWinner()) {
   for (i = 0; i < 9; i++) {
   $("td")[i].innerHTML = ""
   }
   turn = 0
 }
  // turn += 1;
  // updateState(elem);
  // checkWinner();

}

function turnCount() {
  counter = 0
  for (var i = 0; i < 9; i++) {
    if ($("td")[i].innerHTML === "X" || $("td")[i].innerHTML === "O") {
      counter++
    }
  }
  return counter
}

function updateState(elem) {
  if ($(elem).is(':empty')) {
    $(elem).text(player());
    turn += 1
  }
  // else{
  //   turn -= 1;
  // }
}

function setMessage(winner) {
  $("#message").text(winner);
}

function checkWinner() {
  for (var i = 0; i < winCombos.length; i++) {
    if ($("td")[winCombos[i][0]].textContent === "X"
        && $("td")[winCombos[i][1]].textContent === "X"
        && $("td")[winCombos[i][2]].textContent === "X") {
          saveGame();
          setMessage("Player X Won!")
          return true
    } else if ($("td")[winCombos[i][0]].textContent === "O"
        && $("td")[winCombos[i][1]].textContent === "O"
        && $("td")[winCombos[i][2]].textContent === "O") {
          saveGame();
          setMessage("Player O Won!")
          return true
    } else if(turn > 7) {
          saveGame();
          setMessage("Tie game.")
          return true
    }
  }
  return false
}

function saveGame() {
  var myArray = []
  var gameState;
  for (var i = 0; i < 9; i++) {
      myArray.push($("td")[i].innerHTML);
  }
  gameState = { state: myArray}
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameState
    });
  } else {
    $.post('/games', {'state' : myArray}, function(data) {
      currentGame = data.data.id
      console.log(data.data);
    });
  // console.log(myArray);
  }
}

function previousGame() {
  $("#games").html("")
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame);
    }
  })
}

function buttonizePreviousGame(game) {
  $("#games").append(`<button class="js-next" id="${game.id}">Game ${game.id}</button> <br>`);
  $(".js-next").on("click", function() {
    var gameId = parseInt($(this).attr("id"))
    currentGame = gameId;
    console.log(currentGame);
    $.get("/games/" + gameId + ".json", function(data) {
      var board = data.data.attributes["state"]
      for (var i = 0; i < board.length; i++) {
        $("td")[i].innerHTML = board[i]
      }
      turn = turnCount();
      // console.log(board);
    });
  });
}

function loadGame() {
  // console.log(this);
}

function clearGame() {
  turn = 0;
  currentGame = 0;
  for (i = 0; i < 9; i++) {
    $("td")[i].innerHTML = ""
  }
}

function attachListeners() {
  // $("#ttt tbody tr").on("click", "td", doTurn);
  $("td").click(function() {
    if(!checkWinner())
    {
      doTurn(this);
    }
  });
  $("#save").on("click", saveGame);
  $("#previous").on("click", previousGame);
  $("#clear").on("click", clearGame)
}
