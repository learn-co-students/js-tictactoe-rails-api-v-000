// Code your JavaScript / jQuery solution here

$(document).ready(function(){
    attachListeners()
})

var turn = 0 
var gameId = 0

var WIN_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8], 
    [0, 4, 8], 
    [2, 4, 6]
]

var board = 0

function player() {
    if (turn % 2 == 0) {
        return "X"
    } else {
        return "O"
    }
}

function updateState(square) {
    $(square).text(player())
}

function setMessage(string) {
    $("div#message").text(string)
}

function checkWinner() {
    var winner = false;
    var board = [];

    $('td').text((index, square) => board[index] = square);

    WIN_COMBINATIONS.forEach(function(position) {
        if (board[position[0]] === board[position[1]] && board[position[1]] == board[position[2]] && board[position[0]] !== "") {
            setMessage(`Player ${board[position[0]]} Won!`)
            return winner = true 
        }
    })
    return winner;
}

function doTurn(square) {
updateState(square)
turn++;
if (checkWinner()) {
    saveGame()
    resetBoard()
} else if (turn === 9) {
    setMessage('Tie game.')
    saveGame()
    resetBoard()
}
}

function saveGame() {
    let state = Array.from($('td'), e => e.innerText);
    if (gameId) {
        $.ajax({
            type: 'PATCH',
            url: `/games/${gameId}`,
            dataType: 'json',
            data: {state: state}
        });
    } else {
        $.post(`/games`, {state: state}, function(game) {
            gameId = parseInt(game.data.id);
        });
    };
};



function resetBoard() {
    turn = 0
    $('td').empty()
}

function previousGames() {
    $('div#games').empty();
    $.get('/games', function(games) {
        if (games.data.length) {
            games.data.map(function(game) {
                $('div#games').append(`<button id="gameid-${game.id}">Retrieve Game: #${game.id}</button><br>`)
                $("#gameid-"+game.id).on('click', () => loadGame(game.id))
            })
        }
    })
}

function loadGame(gameid) {
    $.get(`/games/${gameid}`, function(game) {
        let state = game.data.attributes.state;
        $('td').text((index, token) => state[index]);
        gameId = gameid
        turn = state.join('').length;
        checkWinner();
    });
};

function attachListeners() {
    $('td').on('click', function() {
        if (!$.text(this) && !checkWinner()) {
            doTurn(this);
        }
    })
    $("#save").on('click', () => saveGame())
    $("#previous").on('click', () => previousGames())
    $("#clear").on('click', () => {
        resetBoard()
        gameId = 0
        setMessage("")
    })
}