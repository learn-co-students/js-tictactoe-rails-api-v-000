// Code your JavaScript / jQuery solution here

$(document).ready(function(){
    attachListeners()
})

var turn = 0 

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

}

function doTurn() {

}

function attachListeners() {

}