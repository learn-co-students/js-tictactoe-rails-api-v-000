// Code your JavaScript / jQuery solution here

$(document).ready(function() {
    // used for calling methods or attaching event listeners during the time the page loads
    attachListeners();
});

var WIN_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

var turn = 0;

var currentGame = 0;

var board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

function player() {
    if (turn % 2 == 0) {
        return "X"
    } else {
        return "O"
    }
} 

function updateState(square) {
    var token = player();
    $(square).append(token);
}


var message = function message(string) {
    $('#message').html(string);
}

function currentBoard() {
    board = [];
    $('td').each(function() {
        board.push($(this).text());
    })
    return board;
};

function checkWinner() {
    currentBoard()
    for (var i = 0; i<WIN_COMBINATIONS.length; i++) {
        var row = WIN_COMBINATIONS[i]
        if (board[row[0]] == board[row[1]] && board[row[2]] == board[row[1]] && board[row[0]] != ""){
            message(`Player ${board[row[0]]} Won!`)
            return true;
        }
    }
    return false
}

function resetBoard() {
    $('td').empty();
    turn = 0;
    currentGame = 0;
}

function doTurn(square) {

    updateState(square);
    turn++;
    if (checkWinner() === true) {
        saveGame();
        resetBoard();
    } else if (turn === 9 && checkWinner() === false) {
        message("Tie game.");
        saveGame();
        resetBoard();
    }
}

function saveGame(){
    if (currentGame === 0 ) {
        $.ajax({
        type: 'POST',
        url: '/games',
        data: {
            game: {
                state: currentBoard()
            }
        }
        });
    } else {
        $.ajax({
        type: 'PATCH',
        url: "/games/" + currentGame,
        data: {
            game: {
                state: currentBoard()
            }
        }
        });
    }
}

function listPreviousGames(){
    $.get('/games').done(function(response){
        var buttons = response.data.map(g => `<button>${g["id"]}</button>`);

        $("#games").html(buttons) 
    })     

}

function clearGame(){
    resetBoard();
}



function attachListeners() {
    $('td').on('click', function(){
       if ($(this).is(':empty') && turn != 9 && !checkWinner()){
           doTurn(this); 
       };
    });

    $('#save').on('click', function(){
        saveGame();
    })

    $('#previous').on('click', function(){
        listPreviousGames();
    })
    
    $('#clear').on('click', function(){
        clearGame();
    })

    $('#games').on("click", function (event) { 
        $.get(`/games/${event.target.innerHTML}`).done(function(response){ 
            var state = response.data.attributes.state
            $('td').each(function(i, td) {
                td.innerHTML = state[i]
            })
            turn = state.filter(function(t){
                 return t !=""
            }).length  

            currentGame = response.data.id
        })        
    })
    
 
}