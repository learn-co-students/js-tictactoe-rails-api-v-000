///LOAD GAMES IS NOT WORKING

var turn = 0;
var win_combos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
var gameId = 0;
var currentGame = 0;
var board = [];

//SET LISTENERS ------------------------
function attachListeners(){
    $("td").click(function(event){
        doTurn(event);
    });
    
    $("#save").click(function(){
        save();
    });
    $("#previous").click(function(){
        showGames();
    });
    $("#games").on("click", "[data-gameid]", function(event) {
        loadGame(event);
    });
}

//GAMEPLAY -------------------------------
function doTurn(event){
    turn++;
    updateState(event);
    checkWinner();
}

function player(){
    if (turn % 2 === 0){
        return 'X';
    } else {
        return 'O';
    }
}

function updateState(event){
    $(event.target).text(player()); //add if already occupied, cannot play there
}

function getBoard(){
    board = [];
    $.each($("td"), function(index, cell){
        board.push($(this).text()); //adds value of cell to board array
    });
}

function checkWinner(){
    for(var i = 0; i < win_combos.length; i++){
        //if all three indexes of win_combo are X, return win message
        //else if all three indexes of win combo are O, return win message
        //else if board is full and there is no winner, return tie message
        
        getBoard();
        if (board[win_combos[i][0]] == 'X' && board[win_combos[i][1]] == 'X' && board[win_combos[i][2]] == 'X'){
            message('Player X won!');
        } else if (board[win_combos[i][0]] == 'O' && board[win_combos[i][1]] == 'O' && board[win_combos[i][2]] == 'O'){
            message('Player O won!');
        } 
    }
}

function message(text){
    $('#message').text(text);
}

//PERSISTENCE ------------------------------

function save(){
    getBoard();
    
    var gameData = {
        game: {
            id: gameId, //need to increment gameID on new game
            state: board
        }
    };
    
    if (gameId === 0){ //if its the first game, need to create new (otherwise we just need to update)
        $.ajax({
            url:'/games',
            type:'POST',
            dataType: 'json',
            data: gameData
        });
    } else {
        $.ajax({
            url:'/games',
            type:'PATCH',
            dataType: 'json',
            data: gameData
        });
    }
}

function showGames(){
    $.get('/games', function(data){
        if (data.games.length > 0){
            var html = '';
            $.each(data.games, function(i, game){
                html += "<p data-gameId='" + game.id + "'>Game " + game.id + "</p>";
            });
            $("#games").html(html);
        } else{
            $("#games").html("No previous games")
        }
    });
}

function loadGame(event){
    currentGame = $(event.target).data('gameId');
    alert(currentGame);
    var url = '/games/'+ currentGame;
    $.get(url, function(data){
        board = data.game.state;
        $('td').each(function(index, cell){
            $(this).text(board[index]);     
        });
    });
}


$(document).ready(function(){
    attachListeners();
});