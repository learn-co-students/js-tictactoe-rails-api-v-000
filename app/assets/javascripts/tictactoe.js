// Code your JavaScript / jQuery solution here

var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

$(document).ready(function() {
    attachListeners();
});


function player(){
    if (isNaN(window.turn) || window.turn == undefined) {
        return "X"
    };
    return window.turn % 2 === 0 ? "X" : "O" ;
}

function updateState(square){
    var token = player();
    $(square).text(token);
}

function message(string){
    $("#message").text(string);
}

function checkWinner(){
    var board = [];
    var winner = false;

    $('td').text(function(index, square) { board[index] = square }); // get all the td's in order andput them in the board

    WINNING_COMBOS.forEach( function(combo) {
        if (board[combo[0]] != "" && board[combo[0]] == board[combo[1]] && board[combo[1]] == board[combo[2]]) {
            message("Player " + board[combo[0]] + " Won!");
            return winner = true;
        }
    });

    return winner;
}

function doTurn(square){
    updateState(square);
    turn++;
    if (checkWinner()) {
        saveGame();
        resetBoard();
    } else if (turn === 9) {
        message("Tie game.");
        saveGame();
        resetBoard();
    }
}

function saveGame() {
    
}

function resetBoard(){
    $('td').empty();
    turn = 0;
    currentGame = 0;
}

function attachListeners(){
    $('td').on('click', function() {
        if (!$(this).text() && !checkWinner()) {
            doTurn(this);
        }
    });

    $('#save').on( 'click', function(){ saveGame()});
    $('#previous').on( 'click', function(){ showPreviousGame()});
    $('#clear').on( 'click', function(){ resetBoard()});
}

function showPreviousGame() {
    $('#games').empty();
    $.get('/games', function(savedGames) {
        if (savedGames.data.length) {
            savedGames.data.forEach(function(game) {
                $('#games').append("<button id='gameid-" + game.id + "'>" + game.id + "</button><br>");
                $("#gameid-" + game.id).on('click', function(){ reloadGame(game.id) });
            });
        }
    });
}

function reloadGame(gameID) {
    message("");
    $.get('/games/' + gameID, function(data) {
        var index = 0, state = data.data.attributes.state;
        for (var y = 0; y < 3; y++){
            for (var x = 0; x < 3; x++) {
                $("[data-x='" + x + "'][data-y='" + y + "']").html(state[index]);
                index++;
            }
        }

        turn = state.join("").length; //count the X and Y positions in the state
        currentGame = data.data.id;

        if(!checkWinner() && turn == 9){
            message('Tie game.');
        }
    })
}