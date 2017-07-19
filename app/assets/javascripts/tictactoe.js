const winCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [6,4,2]
    ];
var turn = 0;
var currentGame = 0;

$(function() {
    attachListeners();
});

var attachListeners = () => {
    $('td').on('click', function() {
        if (!$.text(this) && !checkWinner()) {
        doTurn(this);
        }
    });

    $("#save").on('click', () => saveGame());
    $("#previous").on('click', () => previousGames() );
    $("#clear").on('click', () => resetBoard());
}

var player = () => {
    return turn % 2 === 0 ? 'X' : 'O';
}

var doTurn = td => {
    updateState(td)
    turn++;

    if (checkWinner()) {
        saveGame();
        resetBoard();
    } else if (turn === 9) {
        message("Tie game.");
        saveGame();
        resetBoard();
    }
}

var resetBoard = () => {
    turn = 0;
    $('td').text('');
    currentGame = 0;
}

var updateState = td => {
    var token = player();
    
    $(td).text(token);
}

var message = (string) => {
    $('#message').text(string)
}

var checkWinner = () => {
    var isWinner = false;
    var board = {}

    $('td').text((index, td) => board[index] = td);

    winCombos.some(function(array) {
        if (board[array[0]] !== '' && board[array[0]] === board[array[1]] && board[array[1]] === board[array[2]]) {
            message(`Player ${board[array[0]]} Won!`);
            isWinner = true;
        }
    });
    return isWinner;
}

var loadBoardState = () => {
    var state = []
    $('td').text((index, td) => {
        state.push(td)
    });

    return { state: state }
}

var saveGame = () => {
    var gameData = loadBoardState();
    
    if (parseInt(currentGame) === 0) {
        $.post('/games', gameData, function(game) {
            currentGame = game.data.id;
        });
    }  else {
        $.ajax( {
            url: '/games/' + currentGame,
            method: 'PATCH',
            data: 'gameData'
        });
    }

}

var previousGames = () => {
    $.get('/games', function(game_data) {
        game_data.data.forEach(game => {
            if ($(`#games button#gameid-${game.id}`).length === 0) {

                $("#games").append(`<button id="gameid-${game.id}">Game #${game.id} - updated at "${game.attributes["updated-at"]}"</button><br>`);

                $(`#games button#gameid-${game.id}`).on('click', () => reloadGame(game.id));
            }
        });
    });
}

var reloadGame = gameId => {
    currentGame = gameId;

    $.ajax ({
        url: '/games/' + gameId,
        method: 'GET',
        dataType: "json"
    })
    .done(function(json) {
        var state = json.data.attributes.state
        $('td').text((index, td) => {
            return state[index]
        });
        
        turn = state.filter( val => { return val != '' }).length
    });
}