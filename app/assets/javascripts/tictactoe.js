var turn = 0;
var winner = ""
var token = player()
var gameId = 0
WIN_COMBINATIONS = [
    [0,1,2], [3,4,5], [6,7,8], [0,4,8], [0,3,6], [1,4,7], [2,5,8], [2,4,6]
  ]

$(document).ready(function() {
  attachListeners();
})

function getValue(cell) {
  return cell.innerHTML
}

function attachListeners() {
  document.querySelector("table").addEventListener('click', function(e) {
    doTurn(e.target)
  })

  getSaveListener()

  getPreviousListener()

  document.getElementById("clear").addEventListener('click', function(e) {
    resetGame()
  })
}

function getSaveListener() {
  document.getElementById("save").addEventListener('click', function() {
    saveOrUpdate()
  })
}

function saveOrUpdate() {
  var cells = document.querySelectorAll('td')
  var values = []
  cells.forEach(function(cell) {
    values.push(getValue(cell))
  })

  if (gameId === 0 ) {
    $.post('/games',
      { state: values },
      function(data) {
        var game = this["success"]["arguments"][0]["data"]
        gameId = game["id"];
    });
  } else {
    $.ajax({
      url: `/games/${gameId}`,
      type: 'PATCH',
      data: {state: values, id: gameId},
      success: function(data) {
        console.log(data)
      }
    })
  }
}

function getPreviousListener() {
  document.getElementById("previous").addEventListener('click', function(e) {
        $.get("/games", function(data) {
          getPreviousGame(data)
        })
    })
}

function getPreviousGame(data) {
  var previousGames = data["data"]
  var previousGameNode = document.getElementById("games");
  previousGames.forEach(function(game) {
    if (document.getElementById(game["id"]) === null) {
      previousGameNode.innerHTML += `<BUTTON id='${game["id"]}' onclick=showPreviousGame(${game["id"]})>Game ${game["id"]}</button>`
    }
  })
}

function showPreviousGame(id) {
  resetBoard()
  $.get(`/games/${id}`, function(data) {
    gameId = id
    var spots = document.querySelectorAll('td')
    var state = data["data"]["attributes"]["state"]
    for (let i = 0; i < spots.length; i++) {
      if (state[i] != "") {
        spots[i].innerHTML = state[i]
        turn += 1
      }
    };
  });
}

function player() {
    if (this.turn % 2 === 0 ) {
        let token = 'X';
        return token;
    }
    else {
        let token = 'O';
        return token;
    };
};

function doTurn(spot) {
    if (spot.innerHTML === ""){
      updateState(spot)
      turn += 1
    }
    if (checkWinner()) {
      saveOrUpdate()
      resetGame()
    } else if(turn === 9) {
      setMessage('Tie game.')
      saveOrUpdate()
      resetGame()
    }
  
  }

function updateState(state) {
    var token = player();
    if ($(state).text() === ""){
        $(state).text(token);
    };
};

function checkWinner() {
    let board = {};
    let winner = false;
    
    $('td').text(function (index, space) {
      board[index] = space;
    });
  
    WIN_COMBINATIONS.forEach(function (combo) {
      if(board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== "") {
        setMessage(`Player ${board[combo[0]]} Won!`);
        $("#save").click();
        return winner = true;
      };
    });
    return winner;
  };

function setMessage(theMessage) {
    document.getElementById("message").innerHTML = theMessage;
};

function resetBoard() {
    turn = 0
    $('td').empty();
};

function resetGame() {
  resetBoard()
  gameId = 0;

}

function box(num) {
  return $("table td")[num - 1].innerHTML
}

function isEven(num) {
  return num % 2 === 0;
}