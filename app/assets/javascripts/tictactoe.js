// Code your JavaScript / jQuery solution here

// set up opening variables
var currentGame = 0
var turn = 0
var winCombos = [
    // wins across
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // wins up and down
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // wins diagnolly
    [0, 4, 8],
    [2, 4, 6]
]

// set up button actions
// create event listeners
function attachListeners() {
    $('td').on('click', function() {
        if (!$.text(this) && !checkWinner()) {
            doTurn(this);
        }
    });
    // when save is clicked
    $("#save").on('click', function() {
        var state = [];
        var gameData = {};

        $('td').text(function(i, square) {
            state.push(square);
        });
        gameData = { state: state };

        // if there is a current game persisted in the DB send patch request
        if (currentGame) {
            $.ajax({
                type: 'PATCH',
                url: `/games/${currentGame}`,
                data: gameData
            });
        } else { // create a new game record if not
            $.post('/games', gameData, function(game) {
                currentGame = game.data.id;
                $('#games').append(`<button id="gameId-${game.data.id}">${game.data.id}</button><br>`);
                $("#gameId-" + game.data.id).on('click', function() {
                    reloadGame(game.data.id);
                })
            })
        }
    })


    // clear the board when previous is clicked and load previous game
    $("#previous").on('click', function() {
        $('#games').empty();
        $.get('/games', function(savedGames) {
            if (savedGames.data.length) {
                savedGames.data.forEach(buttonPreviousGame);
            }
        });
    })

    // reset all when clear is clicked
    $("#clear").on('click', function() {
        $('td').empty();
        turn = 0;
        currentGame = 0;
    });
}

// add a previous game button for each previous game clicked on and reload the game
function buttonPreviousGame(game) {
    $('#games').append(`<button id="gameId-${game.id}">${game.id}</button></br>`);
    $(`#gameId-${game.id}`).on('click', function() {
        reloadGame(game.id);
    })
}

// clear the page, setup a new game board and load the game with proper gameId
function reloadGame(gameId) {
    currentGame = gameId;

    $.ajax({
        url: '/games/' + gameId,
        method: 'GET',
        dataType: "json"
    }).done(function(json) {
        var state = json.data.attributes.state
        $('td').text((index, td) => {
            return state[index]
        });

        turn = state.filter(val => { return val != '' }).length
    });
}

function player() {
    if (turn % 2 === 0) {
        return 'X'
    } else
        return 'O'

}

function updateState(place) {
    moveTo = player()
    $(place).text(moveTo);
}

function message(msg) {
    $('#message').text(msg);
}

function checkWinner() {
    var playerWon = false;
    var board = {}

    $('td').text((index, td) => board[index] = td);

    winCombos.some(function(array) {
        if (board[array[0]] !== '' && board[array[0]] === board[array[1]] && board[array[1]] === board[array[2]]) {
            message(`Player ${board[array[0]]} Won!`);
            playerWon = true;
        }
    });
    return playerWon;
}

function doTurn(place) {
    self.updateState(place);
    turn++
    if (checkWinner()) {
        $("#save").trigger('click');
        $('td').empty();
        turn = 0;
        currentGame = 0;
    } else if (turn === 9) {
        $("#save").trigger('click');
        message("Tie game.")
        $('td').empty();
        turn = 0;
        currentGame = 0;
    }
}
$(document).ready(function() {
    attachListeners();
});