// Code your JavaScript / jQuery solution here
var cells = Array.from($("table tr td"));
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
$(function() { attachListeners() });

function player() { return (turn % 2) ? "O" : "X"; }

function updateState(htmlTd) { return (htmlTd.innerHTML = player()) }

function setMessage(message) { return $("div#message").html(message) }

function checkWinner() {
    let winnerCombIdx = WINNING_COMBINATIONS.find((winning_row) =>
        (winning_row.every((index) => (cells[index].innerHTML === 'X') ||
            winning_row.every((index) => cells[index].innerHTML === 'O'))));

    if (!!winnerCombIdx) {
        setMessage(`Player ${cells[winnerCombIdx[0]].innerHTML} Won!`)
    }
    return !!winnerCombIdx;
}

function doTurn(htmlTd) {
    let anyWinners = checkWinner();
    let isCellFree = htmlTd.innerHTML === "";
    if (isCellFree && !anyWinners) {
        updateState(htmlTd);
        turn++;
        if (anyWinners) {
            resetBoard();
        } else if (turn === 9) {
            setMessage("Tie game.");
            resetBoard();
        }
    }
}

function resetBoard() {
    turn = 0;
    cells.map(cell => cell.innerHTML = "");
}


function attachListeners() {
    cells.map((cell) => cell.addEventListener("click", function() { doTurn(this) }));
    $("#save").click(() => console.log("Saved"));
    $("#previous").click(() => console.log("Previous"));
    $("#clear").click(() => resetBoard());
}