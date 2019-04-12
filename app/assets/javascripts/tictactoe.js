// Code your JavaScript / jQuery solution here
var turn = 0;

function player() {
    const token = (turn % 2) ? "O" : "X";
    nextTurn();
    return token;
}

function nextTurn() { return ++turn }

function updateState(htmlTd) { return htmlTd.innerHTML = player() }

function setMessage(message) { return $("div#message").html(message) }

function checkWinner() {

}

function doTurn() {

}

function attachListeners() {

}