//
// var
//
//
var message = document.getElementById("message");

var turn = 0;
function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(td) {
  td.innerHTML = player();
}

function setMessage(msg) {
  message.innerHTML = msg;
}

var board = [];
function makeBoard() {
  $("td").text((index, x) => (board[index] = x));
  return board;
}

function checkWinner() {
  makeBoard();
  const WINS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < WINS.length; i++) {
    let [a, b, c] = WINS[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      setMessage(`Player ${board[a]} Won!`);
      return !!board[a];
    }
  }
  return false;
}

function resetGame() {
  $("td").empty();
  board = [];
  cleared = true;
  turn = 0;
}

notTaken = td => {
  return td.innerHTML === "";
};

doTurn = td => {
  var win = checkWinner();
  if (notTaken(td) && turn < 9 && !win) {
    updateState(td);
    turn++;
    cleared = false;
  }
  if (turn === 9 && !win) {
    setMessage("Tie game.");
    resetGame();
    getGames("/games", "POST");
  } else {
    getGames("/games", "POST");
  }
};

function getGames(url, type, cb) {
  $.ajax(url, {
    type: type
  }).done(x => {
    cb(x.data);
  });
}

function patchGame(data) {
  let type = "PATCH";
  let gid = data.id;
  let url = `/games/${gid}`;
  if (cleared) {
    type = "POST";
    url = "/games";
  }
  $.ajax(url, {
    type: type
  });
}

var games = document.getElementById("games");
function loadGames(data) {
  data.forEach(game => {
    let button = `
  <button onclick="getGame(${game.id})">${game.id}</button>
    `;
    if (!games.innerHTML.includes(button)) {
      games.innerHTML += button;
    }
  });
}
var currgameId = null;
function getGame(id) {
  let url = `/games/${id}`;
  $.ajax(url, {
    type: "GET"
  }).done(x => {
    currgameId = x.data;
    console.log(currgameId);
    populateBoard(x.data.attributes.state);
  });
}

populateBoard = board => {
  for (let i = 0; i < 9; i++) {
    squares[i].innerHTML = board[i];
  }
  let newarr = board.filter(x => x !== "");
  turn = newarr.length;
  return board;
};

squares = document.querySelectorAll("td");
pbutton = document.getElementById("previous");
sbutton = document.getElementById("save");
cbutton = document.getElementById("clear");

$(document).ready(
  (attachListeners = () => {
    squares.forEach(square => {
      square.addEventListener("click", e => {
        doTurn(square);
      });
    });

    pbutton.addEventListener("click", () => {
      getGames(`/games`, "GET", loadGames);
    });

    sbutton.addEventListener("click", () => {
      if (currgameId) {
        patchGame(currgameId);
      } else {
        getGames(`/games`, "POST", patchGame);
      }

      console.log("save");
    });

    cbutton.addEventListener("click", () => {
      resetGame();
      console.log("clear");
    });
  })
);
