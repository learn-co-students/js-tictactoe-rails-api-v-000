var currentGame = 0;
var turn = 0;
var winningBoard = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [2,5,8],
    [1,4,7]
];

$(document).ready(function() {
  attachListeners();
});

function player() {
   if (turn % 2 === 0) {
        return "X";
   }
   else {
    return "O";
    }
}

function updateState(square) { 
    $(square).text(player()); 
}

function setMessage(string) { 
    $("#message").text(string); 
}

function checkWinner() {
    var winner = false; 
    var board = []; 
    for (var i = 0; i < 9; i++) {
        board.push($("td")[i].innerHTML)
    }
    winningBoard.some(function(combo) {
        if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== "") {
                setMessage(`Player ${board[combo[0]]} Won!`)
                return winner = true;
        }
    });
    return winner;
}

function doTurn(square) { 
    updateState(square)
    turn++
    if (checkWinner()) {
        saveGame();
        clearBoard();
    }
    else if (turn === 9) {
        setMessage("Tie game.")
        saveGame();
        clearBoard();
    }
}

function clearBoard() { 
    $("td").empty();
    turn = 0;
    currentGame = 0;
}

function saveGame() { 
    var state = [];
    $('td').text((index, square) => {
        state.push(square);
  });
    if (currentGame) {
        $.ajax({
            url: `/games/${currentGame}`,
            data: {state: state},
            type: 'PATCH'
        });
    }
    else {
      $.post('/games', {state: state}, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => loadGame(game.data.id));
    });
  }
}
function loadGame(game) {
    $("#message").empty();
    $.get(`/games/${game}`, function(data) {
        var currentId = data.data.id;
        var currentState = data.data.attributes.state;
        var i = 0 
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                $(`[data-x = "${x}"][data-y = "${y}"]`).html(currentState[i])
                i++
            }
        }
        turn = currentState.join('').length; 
        currentGame = currentId;
    });
}
    
function previousGames() { 
    $("#games").empty();
    $.get('/games', function(previousGames) {
        if(previousGames.data.length) {
           previousGames.data.forEach(function(game) {
            $("#games").append(`<button id ="game-${game.id}">${game.id}</button>`);
            $(`#game-${game.id}`).on('click', () => loadGame(game.id));
        });
           }
    });
}

function attachListeners() {
    $("td").on('click', function() { 
    if (!$.text(this) && !checkWinner()) {
        doTurn(this);
    }
    });
    $("#save").on('click', function() {
        saveGame(); 
    });
    $("#previous").on('click', function() {
        previousGames();
    });
    $("#clear").on('click', function() {
        clearBoard();
    });
}
