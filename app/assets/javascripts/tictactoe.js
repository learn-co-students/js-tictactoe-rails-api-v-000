$(function() {
    attachListeners();
})

const WIN_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

var currentGame;
var games = {};
var turn = 0;

var attachListeners = function() {
    $('td').click(function(event) {
        doTurn(event);
    })
    console.log('attached')
    $('#save').click(function(e) {
        saveGame();
        e.preventDefault();
    })
    $('#previous').click(function(e) {
        loadGames();
        e.preventDefault();
    })
}

var doTurn = function(event) {
    updateState(event.target)

    if (checkWinner() || tieGame()) {
        saveGame(true);
        resetBoard();
    } else {
        turn++;
    }
}

var resetBoard = function() {
    turn = 0;
    setState(['', '', '', '', '', '', '', '', '']);
}

var player = function() {
    return (turn % 2 === 0) ? "X" : "O";
}

var tieGame = function() {
    if (turn == 8) {
        message("Tie game");
        return true;
    }
    return false;
}
var checkWinner = function() {
    var board = getState();
    //var win = board.some((row) => { return row[0] !== "" && row[0] === row[1] && row[1] === row[2] }) || [0, 1, 2].some((column) => { return board[0][column] !== "" && board[0][column] === board[1][column] && board[1][column] === board[2][column] }) ||
    //    (board[1][1] !== "" && ((board[1][1] === board[0][0] && board[1][1] == board[2][2]) || (board[1][1] === board[0][2] && board[1][1] === board[2][0])));
    let win = false;
    WIN_COMBINATIONS.forEach(function(item) {
        if (board[item[0]] == board[item[1]] && board[item[0]] == board[item[2]] && board[item[0]] != "") {
            win = true;
        }
    })

    //if win show winMessage
    if (win) message("Player " + player() + " Won!")
    return win
}

var message = function(text) {
    $('#message').html(text)
}

var saveGame = function(reset) {
    var url = '/games'

    if (currentGame) {
        url = url + '/' + currentGame;
    }
    $.ajax({
        type: currentGame ? "PATCH" : "POST",
        url: url,
        data: { game: { state: getState() } },
        success: function(response) {
            currentGame = reset ? undefined : response.game.id;
        },
        dataType: 'json'
    })

}

function loadGame(el) {
    currentGame = el.innerText;
    game = $.grep(games, function(i) {
        return i.id == currentGame;
    })[0]
    if (game) setState(game.state)
}

var loadGames = function() {
    $.getJSON('/games', function(response) {
        games = response.games;
        showGames();
    }).fail(function(error) { displayError(error) });
}

var showGames = function() {
    $list = $('div#games');
    $list.empty();
    games.forEach((game) => {
        $li = $('<li>');
        $li.text(game.id);
        $li.click(function() { loadGame(this) });
        $list.append($li)
    })
}

var updateState = function(element) {
    $(element).html(player())
}

var setState = function(state) {
    turn = 0;
    $('table td').each(function(index) {
        $(this).html(state[index])
        if (state[index] != '') turn++;
    })
}

var getState = function() {
    return $('table td').map(function() {
        return this.innerHTML
    }).get();
}

var displayError = function() {
    $('#errors').text("I'm sorry, there's been an error. Please try again.");
}