// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;

var winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

$(function() {
    attachListeners();
});

function attachListeners() {
    $('td').on('click', function(element) {
       if ($(this).is(':empty') && turn !== 9 && !checkWinner()) {
           doTurn(this); 
       };
    });

    $('#save').on('click', () => {
        saveGame();
    });

    $('#previous').on('click', () => {
        showGames();
    })

    $('#clear').on('click', () => {
        resetBoard();
    });

}

function checkWinner() {
    var board = {};
    var winner = false;
    
    $('td').text((i, td) => {
        board[i] = td;
    });

    winningCombos.some((combo) => {
        if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== '') {
            saveGame();
            winner = true;
            message(`Player ${board[combo[0]]} Won!`);
        }
    });

    return winner;
}

function player() {
    if (turn % 2 === 0) {
        return 'X';
    } else {
        return 'O';
    }
}

function doTurn(element) {
    updateState(element);
    ++turn;
    if (checkWinner() === true) {
        saveGame();
        resetBoard();
    } else if (turn === 9 && checkWinner() === false) {
        message("Tie game.");
        saveGame();
        resetBoard();
    }
}

function updateState(element) {
    if (player() === 'X') {
        $(element).html('X');
    } else {
        $(element).html('O');
    }
}

var message = function message(str) {
    $('#message').html(str);
}

function resetBoard() {
    $('td').empty();
    turn = 0;
    currentGame = 0;
}

function saveGame() {
    var state = [];

    $('td').text((index, td) => {
        state.push(td);
    });

    if (currentGame !== 0) {
        $.ajax({
        url: `/games/${currentGame}`,
        data: {
            state: state,
            id: currentGame
        },
        type: 'PATCH'
        });
    } else {
        $.post('/games', { state: state }).done((data) => {
             currentGame = data["data"]["id"];
        });
    }
}

function loadGame(event) {
    var id = $(event.target).data('id');
    $.get(`/games/${id}`, (game) => {
        currentGame = game["data"]["id"];
        var $td = $('td');
        game["data"]["attributes"]["state"].forEach((data, i) => {
            if (data) {
                $td[i].innerHTML = data;
                ++turn;
            } else {
                $td[i].innerHTML = '';
            }
        });
    });
}

function showGames() {
    $.get('/games', (data) => {
        var games = data["data"];
        if (games.length > 0) {
            var gamesHtml = "";

            $(games).each((i, game) => {
                gamesHtml += '<button data-id="' + game["id"] + '" class="game-button">' + game.id + '</button><br>';
            });

            $('#games').html(gamesHtml);
            $('.game-button').on('click', (event) => {
                loadGame(event);
            });
        }
    });
}













