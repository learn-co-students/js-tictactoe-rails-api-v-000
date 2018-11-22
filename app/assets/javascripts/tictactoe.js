var turn = 0;
var currentGame = 0;

function player() {
    return (turn % 2 === 0 ? 'X' : 'O');
}

function updateState(el) {
    var token = player();
    // var x = $(this).data('x');
    // var y = $(this).data('y');

    // var target = $(`td[data-x=${x}][data-y=${y}]`);
    var target = $(el);
    target.text(token);
}

function setMessage(string) {
    $('#message').text(string);
}

function checkWinner() {
    var squares = extractValue();
    var horizontal = splitHorizontal(squares);
    var vertical = splitVertical(squares);
    var diagonal = splitDiagonal(squares);
    var combinations = horizontal.concat(vertical, diagonal);  
    // console.log(combinations);
    if (checkChunks(combinations) === true) {
        setMessage(`Player ${player()} Won!`);
        return true;
    } else {
        return false;
    };
}

function doTurn(el) {
    // This comes at the beginning of the block because if it's at the bottom, checkWinner() is not invoked at the winning step.
    updateState(el);

    turn++;

    if (checkWinner()) {
        saveGame();
        resetGame();
    } else if (turn === 9) {
        setMessage("Tie game.");
        saveGame();
        resetGame();
    }
}

function attachListeners() {
    var box = $('td');
    for (var i = 0 ; i < box.length; i++) {
        box[i].addEventListener('click', function() {
            if (checkWinner() === false && $.text(this) === '') {
                doTurn(this);
            }
        });
    }

    $('#save').on('click', function() {
        saveGame();
    });

    $('#previous').on('click', function() {
        previousGames()
    });

    $('#clear').on('click', function() {
        resetGame()
    });
}

function previousGames() {
    $('#games').empty();
    $.get('/games', function(savedGames) {
        if (savedGames.data.length) {
        savedGames.data.forEach(function(game) {
            $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
            $(`#gameid-${game.id}`).on('click', function() { 
                reloadGame(game.id);
            });
        });
        }
    });
}

function saveGame() {
    var state = [];
    var gameData;

    $('td').text(function(index, square) {
        state.push(square);
    });

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
            $("#gameid-" + game.data.id).on('click', function() {
                reloadGame(game.data.id)
            });
        });
    }
}

// Helper methods below

function splitHorizontal(arr) {
    var newSquares = [];
    newSquares.push([arr[0], arr[1], arr[2]]);
    newSquares.push([arr[3], arr[4], arr[5]]);
    newSquares.push([arr[6], arr[7], arr[8]]);
    return newSquares;
}

function splitDiagonal(arr) {
    var newSquares = [];
    newSquares.push([arr[0], arr[4], arr[8]]);
    newSquares.push([arr[2], arr[4], arr[6]]);
    return newSquares;
}

function splitVertical(arr) {
    var newSquares = [];
    newSquares.push([arr[0], arr[3], arr[6]]);
    newSquares.push([arr[1], arr[4], arr[7]]);
    newSquares.push([arr[2], arr[5], arr[8]]);
    return newSquares;
}

function checkChunks(chunks) {
    var output = '';
    var outputArr = [];
    chunks.forEach(function(el) {
        output = el.every((val, i, arr) => val === arr[0] && val !== '');
        outputArr.push(output);
    })
    if (outputArr.includes(true)) {
        return true;
    } else {
        return false;
    }
}

function extractValue() {
    var values = [];
    $('td').each(function () {
        values.push($(this).text());
    });
    return values;
}

function resetGame() {
    var squares = $('td');
    squares.empty();
    $('#message').text('');
    $('#games').text('');
    turn = 0;
    currentGame = 0;
}

function reloadGame(gameID) {
    document.getElementById('message').innerHTML = '';

    var xhr = new XMLHttpRequest;
    xhr.open('GET', `/games/${gameID}`, true);
    xhr.onload = function() {
        var data = JSON.parse(xhr.responseText).data;
        var id = data.id;
        var state = data.attributes.state;

        var index = 0;
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
                index++;
            }
        }

        turn = state.join('').length;
        currentGame = id;

        if (!checkWinner() && turn === 9) {
        setMessage('Tie game.');
        }
    };

    xhr.send(null);
}

$(document).ready(function() {
    attachListeners();
});