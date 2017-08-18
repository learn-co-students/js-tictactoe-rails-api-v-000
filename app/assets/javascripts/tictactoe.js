// Code your JavaScript / jQuery solution here
var turn = 0;
// var gameId = 0;
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var player = () => turn % 2 ? 'O' : 'X';

function updateState(el) {
   $(el).text(player())
}

function message(string) {
    $('#message').text(string)
}

function checkWinner() {
    var board = [];
    var winner = false;
    // build current board
   $('td').each(function() {
        board.push(this.textContent); 
    }); 
    // iterate through board and see if there's a winning combo
    WINNING_COMBOS.some(function(combo) {
        if (board[(combo[0])] !== '' && board[(combo[0])] === board[(combo[1])] && board[(combo[1])] === board[(combo[2])]) {
            message(`Player ${board[combo[0]]} Won!`);
            return winner = true;     
        }
    });
    return winner;
}

function doTurn(el) {
    updateState(el)
    turn += 1;
    if (checkWinner()) {
        resetGame()
    } else {       
        checkTieGame()
    }
}

function resetGame() {
    $('td').each(function() {
        $(this).text('');
    });  
    turn = 0;
}

function checkTieGame() {
    if (turn === 9) {
        resetGame()
       return message('Tie game.');
    }
}

function appendSavedGames() {
    $.get('/games').done(function(response) {
        if (response.data.length !== 0) {
            response.data.forEach(function(game) {                
                if (game.id > $('#games button:last').text()){
                    $('#games').append(`<button>${game.id}</button> <br>`)
                }
            })
        }
    })
}

function attachListeners() {
   $('td').on("click", function() {
       if(!$.text(this) && !checkWinner()){
           doTurn(this)
       }
   })
   $('#clear').on("click", () => resetGame())
   $('#previous').on("click", () => appendSavedGames())
   $('#save').on("click", () => saveGame(getGameId()))
}

function saveGame(gameId) {
    debugger;
    if (gameExists(gameId)) {
        // make ajax PATCH request
        $.ajax({
            method: 'PATCH',
            url: `/games/${gameId}`,
            data: { state: buildBoard() }
        })
    } else {
        debugger;
        $.post('/games', { state: buildBoard() }).done(function(response) {
        })
    }
}

function gameExists(gameId) {
    debugger;
    $.get(`games/${gameId}`)
}

function buildBoard() {
    let currentBoard = [];
    $('td').each(function() {
        currentBoard.push(this.textContent); 
    }); 
    return currentBoard;
}

function getGameId() {
    $.get('/games').done(function(response) {
    debugger;
        if (response.data.length > 1) {
            return response.data[response.length - 1];
        }
        var gameId = response.data.id
    })
    return gameId;
}

$(document).ready(attachListeners())
