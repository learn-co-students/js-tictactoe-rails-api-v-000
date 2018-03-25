// Code your JavaScript / jQuery solution here
// https://github.com/Booligan/ttt-with-ai-project-v-000/blob/master/lib/game.rb
var turn = 0;

function player() {
    return turn%2 === 0 ? 'X':'O';
}

function updateState(tdElement) {
    let token = player();
    $(tdElement).html(token) ;
}

function setMessage(message) {
    $('div#message').html(message) ;
}

function checkWinner() {
    let currentBoard = [];
    
}