// Code your JavaScript / jQuery solution here
var $cells;
var turn = 0;
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
    $cells = $("table tr td");
    attachListeners()
});

function player() { return (turn % 2) ? "O" : "X"; }

function updateState(htmlTd) { return (htmlTd.innerHTML = player()) }

function setMessage(message) { return $("div#message").html(message) }

function checkWinner() {
    $cells = $("table tr td");
    let winnerCombIdx = WINNING_COMBINATIONS.find((winning_row) =>
        (winning_row.every((index) => ($cells[index].innerHTML === 'X') ||
            winning_row.every((index) => $cells[index].innerHTML === 'O'))));

    if (!!winnerCombIdx) {
        setMessage(`Player ${$cells[winnerCombIdx[0]].innerHTML} Won!`)
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

function resetBoard() {
    turn = 0;
    $cells.empty();
}


function attachListeners() {
    $cells.each(function(i) {
            $(this).click(function() {
                let isCellFree = !$(this).text();
                let isEndOfGame = checkWinner() || turn === 9;
                if (isCellFree && !isEndOfGame) {
                    doTurn(this);
                }
            })
        }
        //)
    );
    $("#save").click(() => saveGame());
    $("#previous").click(() => previousGames());
    $("#clear").click(() => resetBoard());
}

function previousGames() {
    $.get("/games", function(savedGames) {
        let $games = $("#games");
        if (!!savedGames.data.length) {
            $games.empty();
            savedGames.data.forEach(game => $games.append(`<button id=${game.id} onclick="showGame(this)">${game.id}</button></br>`));
        }
    })
}

function saveGame() {
    let state = $("table tr td").map(function() { return $(this).text() }).get();
    $.post("/games", { state: state });
}

function showGame(elem) {
    $.get("/games/" + elem.id, function(game) {
        console.log(game.data.attributes["state"]);
    })
}