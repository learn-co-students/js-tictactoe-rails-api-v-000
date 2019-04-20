// Code your JavaScript / jQuery solution here
var $board;
var turn = 0;
var currentGameId = null;
var root = "/games";
var WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
$(function() {
    $board = $("table tr td");
    attachListeners()
});

function player() { return (turn % 2) ? "O" : "X"; }

function updateState(htmlTd) { return (htmlTd.innerHTML = player()) }

function setMessage(message) { return $("div#message").html(message) }

function checkWinner() {
    $board = $("table tr td");
    let winnerCombIdx = WINNING_COMBINATIONS.find((winning_row) =>
        (winning_row.every((index) => ($board[index].innerHTML === 'X') ||
            winning_row.every((index) => $board[index].innerHTML === 'O'))));

    if (!!winnerCombIdx) {
        setMessage(`Player ${$board[winnerCombIdx[0]].innerHTML} Won!`)
    }
    return !!winnerCombIdx;
}

function doTurn(htmlTd) {
    updateState(htmlTd);
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

function attachListeners() {
    $board.each(function(i) {
        $(this).click(function() {
            let isCellFree = !$(this).text();
            let isEndOfGame = checkWinner() || turn === 9;
            if (isCellFree && !isEndOfGame) {
                doTurn(this);
            }
        })
    });
    $("#save").click(() => saveGame());
    $("#previous").click(() => previousGames());
    $("#clear").click(() => resetBoard());
}

function resetBoard() {
    currentGameId = null;
    turn = 0;
    $board.empty();
}

function previousGames() {
    $.get(root, function(savedGames) {
        let $games = $("#games");
        if (!!savedGames.data.length) {
            $games.empty();
            savedGames.data.forEach(game => $games.append(`<button id=${game.id} onclick="showGame(this)">${game.id}</button></br>`));
        }
    })
}

function saveGame() {
    let board = $("table tr td").map(function() { return $(this).text() }).get();
    if (currentGameId) {
        $.put(`${root}/${currentGameId}`, { state: board });
    } else {
        $.post(root, { state: board }, function(savedGame) {
            currentGameId = savedGame.data.id;
        })
    }
}

$.put = function(url, data) {
    $.ajax({
        url: url,
        type: 'PATCH',
        data: data,
    });
}

function showGame(elem) {
    $.get("/games/" + elem.id, function(game) {
        let savedGame = game.data.attributes["state"];
        currentGameId = game.data.id;
        turn = savedGame.filter((cell) => !!cell).length
        $("table tr td").map(function(index) { return $(this).text(savedGame[index]) });
    })
}
