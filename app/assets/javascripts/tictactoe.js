// Code your JavaScript / jQuery solution here

var turn = 0;

function player () {
    return ((turn%2 === 0) ? 'X' : 'O');
};

function updateState (tdElement) {
    return $(tdElement).html(player());
};

function setMessage (something) {
    return $('div#message').append(something);
};

const winCombinations = [
    [$('[data-x="0"][data-y="0"]').html(), $('[data-x="1"][data-y="0"]').html(), $('[data-x="2"][data-y="0"]').html()], // top row
    [$('[data-x="0"][data-y="1"]').html(), $('[data-x="1"][data-y="1"]').html(), $('[data-x="2"][data-y="1"]').html()], // middle row
    [$('[data-x="0"][data-y="2"]').html(), $('[data-x="1"][data-y="2"]').html(), $('[data-x="2"][data-y="2"]').html()], // bottom row
    [$('[data-x="0"][data-y="0"]').html(), $('[data-x="0"][data-y="1"]').html(), $('[data-x="0"][data-y="2"]').html()], // 1st col
    [$('[data-x="1"][data-y="0"]').html(), $('[data-x="1"][data-y="1"]').html(), $('[data-x="1"][data-y="2"]').html()], // 2nd col
    [$('[data-x="2"][data-y="0"]').html(), $('[data-x="2"][data-y="1"]').html(), $('[data-x="2"][data-y="2"]').html()], // 3rd col
    [$('[data-x="0"][data-y="0"]').html(), $('[data-x="1"][data-y="1"]').html(), $('[data-x="2"][data-y="2"]').html()], // neg diag
    [$('[data-x="2"][data-y="0"]').html(), $('[data-x="1"][data-y="1"]').html(), $('[data-x="0"][data-y="2"]').html()]  // pos diag
];
function checkWinner () {
    winCombinations.forEach(function(combo) {
        let spot1 = combo[0];
        let spot2 = combo[1];
        let spot3 = combo[2];

        if ((spot1 === "X" && spot2 === "X" && spot3 === "X") || (spot1 === "O" && spot2 === "O" && spot3 === "O")) {
            var message = `Player ${spot1} Won!`;
            setMessage(message);
            return true;
        }; 
    });
};

function doTurn () {
    // updateState(tdElement);
    // checkWinner();
    // turn++;
};

function attachListeners (tdElement) {

};

$(document).ready(() => {
// needs to invoke attachListeners()
});