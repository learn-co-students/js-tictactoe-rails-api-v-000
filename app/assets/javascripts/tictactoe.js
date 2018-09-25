// Code your JavaScript / jQuery solution here
var turn = 0;
var gameId = 0;

function player() {
    return turn & 1 ? 'O' : 'X';
} 

function setMessage (message) {
    $('#message').append(message);
}

function checkWinner () {
  //  var squaresDOM = window.document.querySelectorAll('td');
    var squaresDOM = $.find('td');
    var squares = $.makeArray(squaresDOM).map ( square => square.innerText);
    console.log("Squares",squares);
    const winners = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7],  [2,5,8], [0,4,8], [2,4,6]];

    winner = winners.find ( function (combo) {       
        return squares[combo[0]]!='' && squares[combo[0]]==squares[combo[1]] &&
            squares[combo[0]]==squares[combo[2]]      
    });
    if (winner !== undefined) {
        let winnerMark = squares[winner[0]];
        setMessage(`Player ${winnerMark} Won!`);
    }

    return (winner === undefined) ? false : true;
}

function updateState (square) {
 
    let x = parseInt(square.dataset.x) + 1;
    let y = parseInt(square.dataset.y) + 1;
    console.log("updateState",x,y,player());
    let currentSquare = $(`tr:nth-of-type(${y}) td:nth-of-type(${x})`).text();
    if (currentSquare === '') {
        $(`tr:nth-of-type(${y}) td:nth-of-type(${x})`).text(player());
        return true;
    }
    return false;
}

function doTurn (square) {
    if (! updateState(square)) {
        setMessage("Invalid move. Square already taken.  Choose again");
    }
    else {
        ++turn;
        if (!checkWinner() && turn>8)
            setMessage("Draw!");
    }
}

function clearGame() {
    $.find('td').forEach ( square => square.innerText='' );
    turn = 0;
    gameId = 0;
}

function saveGame() {
    var squaresDOM = $.find('td');
    var squares = $.makeArray(squaresDOM).map ( square => square.innerText);
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
}

$(function () {
    attachListeners();
});