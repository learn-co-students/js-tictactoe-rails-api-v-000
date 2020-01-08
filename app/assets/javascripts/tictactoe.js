var gameId = 0; 
var turn = 0; 

function player(){
    var currentPlayer = "O"
    if (window.turn % 2 === 0 || window.turn === 0) {
      currentPlayer = "X";   
    } 

    return currentPlayer;
}

function updateState(square){
        square.innerHTML = player(); 
}

function setMessage(message){
    var messageDiv = window.document.getElementById('message');

    messageDiv.innerHTML = message;
}

function checkWinner(){
    var winner = false; 
    var squares = window.document.querySelectorAll('td');
    var winningToken; 
    var winCombinations = [
        [0, 1, 2], 
        [3, 4, 5], 
        [6, 7, 8], 
        [0, 3, 6], 
        [1, 4, 7], 
        [2, 5, 8], 
        [0, 4, 8], 
        [2, 4, 6]
    ]

    function winFunction(winArray) {
        var firstPosition = squares[winArray[0]].innerHTML; 
        var secondPosition = squares[winArray[1]].innerHTML; 
        var thirdPosition = squares[winArray[2]].innerHTML; 

        if (firstPosition === "X" || firstPosition === "O") {
            if (firstPosition === secondPosition && secondPosition === thirdPosition) {
                winningToken = firstPosition; 
                winner = true;
                setMessage(`Player ${winningToken} Won!`)
            }
        }
    }
    
    winCombinations.forEach(winFunction); 

    return winner; 
}

function doTurn(square) {
    var squares = window.document.querySelectorAll('td');
    var catsGame = 0; 

    if (square.innerHTML === "") {
        updateState(square); 
        window.turn++;
    };

    if (checkWinner()) {
        saveGame();
        window.turn = 0; 
        squares.forEach(function(position) {
            position.innerHTML = ""; 
        });
    };

    squares.forEach(function(position) {
        if (position.innerHTML === "X" || position.innerHTML === "O") {
            catsGame++; 
        };
    });

    if (catsGame === 9) {
        saveGame();
        setMessage("Tie game.")
        window.turn = 0; 
        squares.forEach(function(position) {
            position.innerHTML = ""; 
        });
    }
}

function showPreviousGames(){
    $("#games").empty();
    $.get('/games', (games) => {
        gamesData = games.data
        gamesData.forEach(function (gameObject) {
                gameNode = $("#games").append($(`<button id=${gameObject.id} >${gameObject.id}</button><br>`));
            });
    });
  };

  function readBoardState() {
    var squares = window.document.querySelectorAll('td');
    var boardState = []; 
    squares.forEach(function(position) {
        boardState.push(position.innerHTML)
    });
    
    return boardState;
}

  function saveGame(){
    var board = readBoardState(); 
    values = {state: board}; 
      if (gameId === 0) {
        var posting = $.post('/games', values);
        posting.done(function(response) {
            gameId = response.data.id
          });
      } else {
        $.ajax({
            type: "Patch",
            url: "/games/" + gameId,
            data: values,
        });
    }
  }

  function clearGame(){
    var squares = window.document.querySelectorAll('td');

    squares.forEach(function(position) {
        position.innerHTML = ""; 
    });

    turn = 0; 
    gameId = 0;
  }

  function loadPreviousGame(event){
    var savedGameId = event.originalEvent.originalTarget.id
    gameId = savedGameId; 

    $.get(`/games/${savedGameId}`, (game) => {
        var savedGameBoard = game.data.attributes.state; 
        var squares = window.document.querySelectorAll('td');
        var counter = 0; 
        turn = 0; 

        squares.forEach(function(position) {
            position.innerHTML = savedGameBoard[counter]; 
            counter++; 
            if (position.innerHTML !== "") { turn++}; 
        });
    });  
  }

function attachListeners(){
    var squares = window.document.querySelectorAll('td');
    $(squares[0]).click(function() {
        var won = checkWinner();

        if (!won) {
        doTurn(squares[0])
        }
    });
    $(squares[1]).click(function() {
        var won = checkWinner();

        if (!won) {
        doTurn(squares[1])
        }
    });
    $(squares[2]).click(function() {
        var won = checkWinner();

        if (!won) {
        doTurn(squares[2])
        }
    });
    $(squares[3]).click(function() {
        var won = checkWinner();

        if (!won) {
        doTurn(squares[3])
        }
    });
    $(squares[4]).click(function() {
        var won = checkWinner();

        if (!won) {
        doTurn(squares[4])
        }
    });
    $(squares[5]).click(function() {
        var won = checkWinner();

        if (!won) {
        doTurn(squares[5])
        }
    });
    $(squares[6]).click(function() {
        var won = checkWinner();

        if (!won) {
        doTurn(squares[6])
        }
    });
    $(squares[7]).click(function() {
        var won = checkWinner();

        if (!won) {
        doTurn(squares[7])
        }
    });
    $(squares[8]).click(function() {
        var won = checkWinner();

        if (!won) {
        doTurn(squares[8])
        }
    });

    $('#previous').on('click', () => showPreviousGames());
    $('#save').on('click', () => saveGame());
    $('#clear').on('click', () => clearGame());
    $('#games').on('click', (event) => loadPreviousGame(event));
};

$( document ).ready(function() {
    attachListeners();
});