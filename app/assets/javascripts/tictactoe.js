// Code your JavaScript / jQuery solution here

var turn = 0
var currentGame
const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

$(document).ready(function() {
    attachListeners();
});

function player() {
    if(turn%2 === 0) {
        return "X"
    } else {
        return "O"
    }
}

function checkWinner() {
    var board = [];
    var winner = false;

    $("td").text(function(index,currentText) {
        board[index] = currentText;
    });
    
    winningCombos.forEach(function(combo) {
        if( board[combo[0]] !== "" && 
            board[combo[0]] === board[combo[1]] &&
            board[combo[0]] === board[combo[2]] )
        {
            setMessage(`Player ${board[combo[0]]} Won!`);
            winner = true;
            //turn = 0;
        }
    })
    return winner;
}

function updateState(td_element) {
    $(td_element).text(player())
}

function setMessage(string) {
    $("#message").text(string)
}

function doTurn(td_element) {
    updateState(td_element);
    turn++;
    if(checkWinner()) {
        saveGame();
        clearBoard();
    }
    else if(turn === 9) {
        setMessage("Tie game.");
        saveGame();
        clearBoard();
    }
}

function attachListeners(){
    $("td").on("click",function() {
 
        if($(this).text() === "" && checkWinner() === false) {
            doTurn(this);
        }
    });

    $("#save").on("click",function(){
        saveGame();
    });
    $("#previous").on("click",function(){
        previousGames();
    });
    $("#clear").on("click",function(){
        clearBoard();
    });
}

function saveGame(){
    var state = []
    var game = {}

    $("td").text(function(index,val) {
        state[index] = val;
    })

    game["state"] = state

    if(!currentGame){
        $.ajax({
            type: 'post',
            url: '/games',
            data: game
        }).done(function(game_data) {
            currentGame = game_data["data"]["id"]
        });
    } else {
        $.ajax({
            type: 'patch',
            url: `/games/${currentGame}`,
            data: game
        });
    }
}

function previousGames(){
    $.ajax({
        type: 'get',
        url: '/games'
    }).done(function(response) {
        $("#games").empty();
        response["data"].forEach(function(game) {
            $("#games").append(`<button id="gameid-${game.id}">Game ${game.id}</button>`)
            $(`#gameid-${game.id}`).on('click',function(){
                $.get(`/games/${game.id}`,function(response){
                    response["data"]["attributes"]["state"].forEach(function(v,i) {
                        $("td")[i].innerHTML = v;
                    });
                    turn = $("td").text().length;
                    currentGame = game.id;
                });
            });
        });
    });
}


function clearBoard(){
    $("td").text("")
    turn = 0;
    currentGame = null;
}