// Code your JavaScript / jQuery solution here

$(document).ready(function () {
    clearBoard();
    attachListeners();
});


function player() {
    if(window.turn % 2){
        return "O"
    }else {
        return "X"
    }
}

function updateState(squareSelection) {
    squareSelection.innerHTML = player();
}
function setMessage(message) {
    $('div#message').html(message)
}
function checkWinner() {
    const squares = window.document.querySelectorAll('td');
    const winningCombos  = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    let winningPosition = [];

    winningCombos.forEach(function (item) {
        let winningIndex1 = item[0];
        let winningIndex2 = item[1];
        let winningIndex3 = item[2];

        let boardPosition1 = squares[winningIndex1].innerHTML;
        let boardPosition2 = squares[winningIndex2].innerHTML;
        let boardPosition3 = squares[winningIndex3].innerHTML;

        if(boardPosition1 === "X" && boardPosition2 === "X" && boardPosition3 ==="X"  || boardPosition1 === "O" && boardPosition2 === "O" && boardPosition3 ==="O"){
            setMessage(`Player ${boardPosition1} Won!`);
            winningPosition = [boardPosition1,boardPosition2, boardPosition3];
            return winningPosition;
        }
    });
    if (winningPosition.length > 0){
        return true;
    }else{
        return false;
    }
}

function doTurn(squareSelection) {
    updateState(squareSelection);
    window.turn += 1;

    if (checkWinner()){
        saveUpdateGame();
        clearBoard();
    }else if(window.turn === 9){
        saveUpdateGame();
        setMessage("Tie game.");
        clearBoard();
    }
}

function attachListeners() {
    setSquare();
    clearButton();
    previousGames();
    saveGame();
}

function endGame() {
    if(checkWinner() || window.turn === 9){
        return true
    }else{
        return false;
    }
}

function setSquare() {
    let squares = document.querySelectorAll('td');

    for (let i = 0; i < squares.length; i++) {
        squares[i].addEventListener('click', function (e) {
            if(!this.innerHTML && !endGame()){
                doTurn(this);
            }
        })
    }
}

function clearBoard() {
    $( "#selected" ).removeAttr("id");
    let squares = document.querySelectorAll('td');
     window.turn = 0;

    for (let i = 0; i < squares.length; i++) {
        squares[i].innerHTML = "";
    }
}

function clearButton() {
    $('#clear').click(function (e) {
        clearBoard();
    })
}

function saveGame() {
    $('#save').click(function(event) {
        saveUpdateGame()
    });
}

function previousGames() {
    $("#previous").click(function() {
        $.get("/games", function(data) {
            var games = data["data"];

            var gameList = "";
            games.forEach(function(game) {
                gameList += '<button onclick = "getGame(this)" class="js-game" data-id="' + game["id"] + '">' + game["id"] + '</button>';
            });
            $("#games").html(gameList);
        })
    });
}

function saveUpdateGame() {
    let squares = document.querySelectorAll('td');
    let sqArray = [];
    for (let i = 0; i < squares.length; i++) {
        sqArray.push(squares[i].innerHTML);
    }
    var values = {state: sqArray};
    var posting = "";
    var currentGame = $('#selected');

    if(currentGame.length){
        var url  = "/games/" + currentGame.data().id;
        $.ajax({
            url: url,
            type: 'PATCH',
            data: values
        });
    }else{
        posting = $.post('/games', values);
    }
    posting.done(function(data) {
        let game = data["data"];
        let hiddenBtn = '<button style="display: none;" id = "selected" class="js-game" data-id="' + game["id"] + '">' + game["id"] + '</button>';
        $('body').append(hiddenBtn);
    });
}

function getGame(game) {
    $( "#selected" ).removeAttr("id");
    $(game).attr("id", "selected");
    $.get("/games/" + game.dataset.id, function(data) {
        var game = data["data"];
        var state = game.attributes.state;

        let squares = document.querySelectorAll('td');

        for (let i = 0; i < squares.length; i++) {
            squares[i].innerHTML = state[i];
            state[i] ? window.turn += 1 : false;
        }
    });
}

