// Code your JavaScript / jQuery solution here
var turn = 0;
var topRow;
var middleRow;
var bottomRow;
var firstColumn;
var secondColumn;
var thirdColumn;
var botToTopDiagonal;
var topToBottomDiagonal;
var completeBoard;
var saveButton;
var previousGamesButton;
var clearButton;

function player () {
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState (clickedSquare) {
  var playerToken = player();
  clickedSquare.innerHTML = playerToken;
}

function setMessage (string) {
  document.getElementById("message").innerHTML = "<p>" + string + "</p>";
}

function checkWinner () {
  var winCombos = [topRow, middleRow, bottomRow, firstColumn, secondColumn, thirdColumn, botToTopDiagonal, topToBottomDiagonal]
  for (let i = 0; i < winCombos.length; i++) {
    if (winCombos[i][0].innerHTML.length > 0 && winCombos[i][0].innerHTML === winCombos[i][1].innerHTML && winCombos[i][1].innerHTML === winCombos[i][2].innerHTML) {
      var congratulations = "Player " + winCombos[i][0].innerHTML + " Won!";
      setMessage(congratulations);
      return true;
    }
  }
  return false
}

function doTurn (clickedSquare) {
  if (clickedSquare.innerHTML.length === 0) {
    updateState(clickedSquare);
    var filledSpaces = completeBoard.reduce(function (accumulator, currentElement) {return accumulator + currentElement.innerHTML.length}, 0);
    turn += 1;
    // setMessage("");
    if (checkWinner()) {
      var state = completeBoard.map(square => square.innerHTML);
      if (document.getElementById("currentGame")) {
        var id = document.getElementById("currentGame").innerHTML
        var data = {state: state}
        $.ajax({url: "/games/" + id, method: "patch", data: data});
      } else {
        $.post("/games", {state: state});
      }
      turn = 0;
      for (var square of completeBoard) {
        square.innerHTML = "";
      }
    } else if (filledSpaces === 9) {
      setMessage("Tie game.")
      var state = completeBoard.map(square => square.innerHTML);
      if (document.getElementById("currentGame")) {
        var id = document.getElementById("currentGame").innerHTML
        var data = {state: state}
        $.ajax({url: "/games/" + id, method: "patch", data: data});
      } else {
        $.post("/games", {state: state});
      }
      turn = 0;
      for (var square of completeBoard) {
        square.innerHTML = "";
      }
    }
  }
  // } else {
  //   setMessage("That space has already been played! Please choose another.")
  // }
}

function attachListeners () {
  for (var square of completeBoard) {
    square.addEventListener("click", function (event) {
      if (!checkWinner()) {
        doTurn(this)
      }
    });
  }

  saveButton.addEventListener("click", function (event) {
    var state = completeBoard.map(square => square.innerHTML);
    if (document.getElementById("currentGame")) {
      var id = document.getElementById("currentGame").innerHTML
      var data = {state: state}
      $.ajax({url: "/games/" + id, method: "patch", data: data});
    } else {
      $.post("/games", {state: state}, function (jsonData) {
        document.getElementById("games").innerHTML = "<p id='currentGame' hidden>" + jsonData.data.id + "</p>" + document.getElementById("games").innerHTML;
      });
    }
  });

  previousGamesButton.addEventListener("click", function (event) {
    $.get("/games", function (jsonData) {
      if (document.getElementById("games").hasChildNodes() && document.getElementById("games").lastChild !== document.getElementById("currentGame")) {
        var lastLoadedGame = document.getElementById("games").lastChild.dataset.id
        var gameLIs = jsonData["data"].filter(game => game.id > lastLoadedGame).map(function (game) {
          return "<button class='js-prev' data-id='" + game.id + "'>Game " + game.id + "</button>"
        }).join('');
        document.getElementById("games").innerHTML += gameLIs;
      } else {
        var gameLIs = jsonData["data"].map(function (game) {
          // var updatedAt = game.attributes["updated-at"].replace("T", "-").replace("Z", "").split("-");
          // var dateString = updatedAt[1] + "/" + updatedAt[2] + "/" + updatedAt[0] + " at " + updatedAt[3]
          // return "<button class='js-prev' data-id='" + game.id + "'>Game " + game.id + ": -- " + dateString + "</button><br>"
          return "<button class='js-prev' data-id='" + game.id + "'>Game " + game.id + "</button>"
        }).join('');
        // if (document.getElementById("gamesList")) {
        //   document.getElementById("gamesList").innerHTML = gameLIs
        // } else if (jsonData["data"].length > 0) {
        //   document.getElementById("games").innerHTML += "<p id='gamesList'>" + gameLIs + "</p>"
        // }
        if (jsonData["data"].length > 0) {
          document.getElementById("games").innerHTML += gameLIs;
        }
      }
    });
    $("#games").on("click", ".js-prev" , function () {
      var id = $(this).data("id")
      $.get("/games/" + id, function (jsonData) {
        for (let i = 0; i < completeBoard.length; i++) {
          completeBoard[i].innerHTML = jsonData.data.attributes.state[i];
        }
        turn = completeBoard.reduce(function (accumulator, currentElement) {return accumulator + currentElement.innerHTML.length}, 0);
        if (document.getElementById("currentGame")) {
          document.getElementById("currentGame").innerHTML = jsonData.data.id
        } else {
          document.getElementById("games").innerHTML = "<p id='currentGame' hidden>" + jsonData.data.id + "</p>" + document.getElementById("games").innerHTML;
        };
      });
    });
  });

  clearButton.addEventListener("click", function (event) {
    if (document.getElementById("currentGame")) {
      document.getElementById("currentGame").remove();
    }
    turn = 0;
    for (var square of completeBoard) {
      square.innerHTML = "";
    }
  });
}

window.onload = () => {
  topRow = [document.querySelector('td[data-x="0"][data-y="0"]'), document.querySelector('td[data-x="1"][data-y="0"]'), document.querySelector('td[data-x="2"][data-y="0"]')];
  middleRow = [document.querySelector('td[data-x="0"][data-y="1"]'), document.querySelector('td[data-x="1"][data-y="1"]'), document.querySelector('td[data-x="2"][data-y="1"]')];
  bottomRow = [document.querySelector('td[data-x="0"][data-y="2"]'), document.querySelector('td[data-x="1"][data-y="2"]'), document.querySelector('td[data-x="2"][data-y="2"]')];
  firstColumn = [document.querySelector('td[data-x="0"][data-y="0"]'), document.querySelector('td[data-x="0"][data-y="1"]'), document.querySelector('td[data-x="0"][data-y="2"]')];
  secondColumn = [document.querySelector('td[data-x="1"][data-y="0"]'), document.querySelector('td[data-x="1"][data-y="1"]'), document.querySelector('td[data-x="1"][data-y="2"]')];
  thirdColumn = [document.querySelector('td[data-x="2"][data-y="0"]'), document.querySelector('td[data-x="2"][data-y="1"]'), document.querySelector('td[data-x="2"][data-y="2"]')];
  botToTopDiagonal = [document.querySelector('td[data-x="0"][data-y="2"]'), document.querySelector('td[data-x="1"][data-y="1"]'), document.querySelector('td[data-x="2"][data-y="0"]')];
  topToBottomDiagonal = [document.querySelector('td[data-x="0"][data-y="0"]'), document.querySelector('td[data-x="1"][data-y="1"]'), document.querySelector('td[data-x="2"][data-y="2"]')];
  completeBoard = topRow.concat(middleRow).concat(bottomRow);
  saveButton = document.getElementById("save");
  previousGamesButton = document.getElementById("previous");
  clearButton = document.getElementById("clear");
  attachListeners();
}
