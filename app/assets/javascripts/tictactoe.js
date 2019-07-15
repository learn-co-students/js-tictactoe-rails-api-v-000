var WIN_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;
var currentGame = 0;

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(square) {
  var currentPlayer = player();
  $(square).text(currentPlayer);
}

function setMessage(string) {
   $("div#message").text(string);
}

function checkWinner() {
  var winner = false;
  var board = {}
  $('td').text((index, square) => board[index] = square);
  WIN_COMBOS.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  });
  return winner
}

function doTurn(square) {
  updateState(square);
  turn++ ;
  if (checkWinner()) {
    saveGame()
    clearBoard()
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame()
    clearBoard()
  }
}


function attachListeners() {
  $("td").click(function( object ) {
    if (this.innerHTML === "" && !checkWinner()) {
      doTurn(this)
    }
  })
  $( "#save" ).on("click", () => saveGame() );
  $( "#previous").on( "click", () => previousGames() );
  $( "button#clear" ).click( () =>clearBoard() )
}

$(document).ready(function() {
  attachListeners()
});

function saveGame() {
  var state = []
  $('td').text((index, square) => {
    state.push(square)
  });

  if (currentGame) {
    $.ajax( {
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        url : '/games/' + currentGame,
        type : 'PATCH',
        data : JSON.stringify({state: state}),
        success : function(response) {
            console.log(response);
        },
      })
  } else {
    var posting = $.post('/games', {state: state});
    posting.done(function(data) {
        var game = data;
        currentGame = game['data']["id"]
    });
  }
}

  function previousGames() {
    $.getJSON("/games", function(games) {
      let array = []
      if (games) {
        var gamesList = games['data']
        for (let game of gamesList) {
          let li = `<button onclick="load(${game.id})">${game.id}</button><br>`
          array.push(li)
        }
        $('#games').empty()
        $('#games').append(array)
      }
    })
  }

function load(id) {
    currentGame = id
    $.get("/games/" + id, function(data) {
      var game = data.data.attributes.state;
      turn = 0
      for (let i = 0; i < 9 ; i++ ) {
        $('td')[i].innerHTML = game[i]
        if (game[i] === "X" || game[i] === "O") {
          turn++
        }
      }
    })
  }

function clearBoard() {
  turn = 0;
  $("td").empty()
  currentGame = 0
}
