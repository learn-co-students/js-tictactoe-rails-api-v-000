const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

$(document).ready(function() {
    attachListeners();
});

var player = function() {
    function isOdd(num) {
        return num % 2;
    }
    if (isOdd(turn) === 0) {
        return "X"
    } else {
        return "O"
    }
}

var updateState = (square) => {
    var token = player();
    $(square).text(token);
}

var setMessage = (msg) => {
    $("#message").text(msg)
}

var doTurn = (square) => {
    updateState(square);
    turn++;
    if (checkWinner()) {
        saveGame();
        resetBoard();
    } else if (turn === 9) {
        setMessage("Tie game.");
        saveGame();
        resetBoard();
    }
}

var saveGame = function() {
    var state = [];
    var gameData;

    $('td').text((square) => {
        state.push(square);
    })

    gameData = { state: state };

    if (currentGame) {
        $.ajax({
          type: 'PATCH',
          url: `/games/${currentGame}`,
          data: gameData
        });
    } else {
        $.post('/games', gameData, function(game) {
            currentGame = game.data.id;
            $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
            $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
        });
    }
}

var allPreviousGames = function() {
    $('#games').empty();
    $.get('/games', function(games){
        if (games.data.length) {
            games.data.forEach(showPreviousGameButton);
        }
    });
}

var showPreviousGameButton = (game) => {
    $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
    $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}
var reloadGame = (gameID) => {
    $('#message').innerHTML = '';

    $.get(`/games/${gameID}`, function(gameData) {
        debugger
        const id = gameData.data.id;
        const state = gameData.data.attributes.state;

        let index = 0;
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
            document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
            index++;
            }
        } 

        turn = state.join('').length;
        currentGame = id;
    })
}

var clearGame = function() {
    resetBoard();
    currentGame = 0;
}

var resetBoard = function() {
    $('td').text("");
    turn = 0;
}

var attachListeners = () => {
    $('td').on('click', function() {
        if (!$.text(this) && !checkWinner()) {
            doTurn(this);
          }
    });

    $('#save').on('click', () => saveGame());
    $('#previous').on('click', () => allPreviousGames());
    $('#clear').on('click', () => clearGame());
}

var checkWinner = () => {
    var board = {};
    var winner = false;

    $('td').text((index, square) => board[index] = square);

    const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

    WINNING_COMBOS.some(function(combo) {
        if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        setMessage(`Player ${board[combo[0]]} Won!`);
        return winner = true;
        }
    });

  return winner;
}



