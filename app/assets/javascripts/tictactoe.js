// Code your JavaScript / jQuery solution here
var turn = 0;
var gameId = 0;

function getSquares() {
    var squaresDOM = $.find('td');
    return $.makeArray(squaresDOM).map ( square => square.innerText); 
}
function player() {
    return turn & 1 ? 'O' : 'X';
} 

function setMessage (message) {
    $('#message').append(message);
}

function checkWinner () {
    var squares = getSquares();
    console.log("Squares",squares);
    const winners = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7],  [2,5,8], [0,4,8], [2,4,6]];

    winner = winners.find ( function (combo) {       
        return squares[combo[0]]!='' && squares[combo[0]]==squares[combo[1]] &&
            squares[combo[0]]==squares[combo[2]]      
    });
    if (winner !== undefined) {
        let winnerMark = squares[winner[0]];
        setMessage(`Player ${winnerMark} Won!`);
        saveGame();
        clearGame();
    }

    return (winner === undefined) ? false : true;
}

function updateState (square) {
 
    let x = parseInt(square.dataset.x) + 1;
    let y = parseInt(square.dataset.y) + 1;
    let currentSquare = $(`tr:nth-of-type(${y}) td:nth-of-type(${x})`).text();
    if (currentSquare === '') {
        $(`tr:nth-of-type(${y}) td:nth-of-type(${x})`).text(player());
        return true;
    }
    return false;
}

function gameOver() {
    const winners = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7],  [2,5,8], [0,4,8], [2,4,6]];
    var squares = getSquares();
    winner = winners.find ( function (combo) {       
        return squares[combo[0]]!='' && squares[combo[0]]==squares[combo[1]] &&
            squares[combo[0]]==squares[combo[2]]      
    });
    return (winner || turn>=9) ? true : false;    
}
function doTurn (square) {
    if (!gameOver()) {
        if (! updateState(square)) {
            setMessage("Invalid move. Square already taken.  Choose again");
        }
        else {
            ++turn;
            if (!checkWinner() && turn>8) {
                setMessage("Tie game.");
                saveGame();
                clearGame();
            }
        }
    }
}

function clearGame() {
    $.find('td').forEach ( square => square.innerText='' );
    turn = 0;
    gameId = 0;
}

function saveGame() {
    var squares = getSquares();
    if (gameId == 0) {
        $.post("/games", 
                { state: squares}, 
                function(response,status) { 
                    console.log("Create Game",response);
                    gameId=response.data.id       
                });
    }
    else {
        let data = { state: squares};
        console.log("Updating game",gameId,JSON.stringify(data));
        $.ajax({
            url : `/games/${gameId}`,
            data : JSON.stringify(data),
            type : 'PATCH',
            contentType : 'application/json'
        });
    }
}

function showPreviousGame(e) {
    $.get(`/games/${this.id}`, function(response) { 
        console.log("Get Previous Game",response)
        gameId = response.data.id;
        let turnCount = 0;
        response.data.attributes.state.forEach( function (square,index) {
            let y = (Math.floor(index/3)) + 1;
            let x = (index % 3) + 1;  
            $(`tr:nth-of-type(${y}) td:nth-of-type(${x})`).text(square);
            if (square != '') ++turnCount;
        });
        turn = turnCount;;
    });    
}
function buildPreviousGameButtons(games) {
    $("#games").empty();

    games.forEach ( function (game){
        var button = $('<button/>',
        {
            text: `${game["id"]}`,
            id: `${game["id"]}`,
            click: showPreviousGame
        });             
        $("#games").append(button);
    });
}
function getPreviousGames() {
    $.get("/games", function(response) { 
        buildPreviousGameButtons(response.data);
    });
}
function attachListeners() {
    $("td").click(function(e){    
        doTurn( this);
        return false;
    });
    $("#clear").click(function(e){    
        clearGame();
        return false;
    });
    $("#save").click(function(e){    
        saveGame();
        return false;
    });
    $("#previous").click(function(e){    
        getPreviousGames();
        return false;
    });
}

$(function () {
    attachListeners();
});