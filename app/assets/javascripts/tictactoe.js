// Code your JavaScript / jQuery solution here
const WIN_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                    [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;

$(document).ready(function() {
    attachListeners();
});

var player = () => turn % 2 ? 'O' : 'X'


function updateState(){

}

function setMessage(){

}

function checkWinner(){

}

function doTurn(){

}

function resetBoard(){

}

function saveGame(){

}

function showPreviousGames(){

}

function attachListeners(){

    $('#save').on('click', () => saveGame());
   $('#previous').on('click', () => showPreviousGames());
   $('#clear').on('click', () => resetBoard());
}
