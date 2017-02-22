$(function() {
    attachListeners();
});

var currentGame;
var turn = 0;
var winning = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function attachListeners() {
    $('td').click(function(event) {
        doTurn(event);
    });

    $('#previous').click(function(event) {
        listGames();
    });

    $('#save').click(function(event) {
      debugger
        saveGame(false);
    });

    $('#games').click(function(event) {
        getGame(event);
    });
}

function doTurn(event) {

    updateState(event);
    checkWinner();
    turn++;
}

function player() {
    return (turn % 2 === 0) ? "X" : "O";
}

function updateState(event) {
    $(event.target).html(player());
}

function checkWinner() {
    var board = selections();

    if (checkTie()) {
        saveGame(true)
        resetGame();
        message("Tie game");
        return false;
    }

    for (var i = 0; i < winning.length; i++) {
        if ((board[winning[i][0]] === "X") && (board[winning[i][1]] === "X") && (board[winning[i][2]] === "X")) {
            console.log("Player 1 wins");
            message(`Player ${player()} Won!`);
            saveGame(true)
            resetGame();
            return true;
        } else if ((board[winning[i][0]] === "O") && (board[winning[i][1]] === "O") && (board[winning[i][2]] === "O")) {
            console.log("Player 2 wins");
            message(`Player ${player()} Won!`);
            saveGame(true)
            resetGame();
            return true;
        }
    }
    return false; //for end
} //checkwinner end

//get all the inputs
function selections() {
    var board = [];
    $('td').each(function() {
        board.push($(this).text());
    });
    return board;
}

function message(str) {
    $('#message').text(str);
}

function resetGame() {
    $('td').empty();
    turn = -1;

}

function checkTie() {
    return turn === 8 ? true : false;
}

function listGames() {
    var html = '';
    $.getJSON('/games', function(data) {
        data.games.forEach(function(game) {
            html += `<li class ="game" data-id="${game.id}" data-state="${game.state}">${game.id}</li>`;
        });
        $('#games').html(html);
    });
}

function getGame(event) {
    currentGame = event.target.dataset.id;
    var gameState = event.target.dataset.state.split(',');
    $('td').each(function(index, element) {
      //debugger
        $(this).context.innerText = gameState[index];
    });
}

function boardState() {
  state = [];
	$('td').each(function() {
		state.push($(this).context.innerText);
	});
	return state;
}
function saveGame(boolean) {
  //debugger
    var url;
    var method;
    if (currentGame) {
        url = `/games/${currentGame}`
        method = "PATCH"
    } else {
        url = "/games"
        method = "POST"
    }
    //debugger
    $.ajax({
        url: url,
        method: method,
        dataType: "json",
        data: {
            game: {
                state: boardState()
            }
        },
        success: function(data) {
            if (boolean) {
                currentGame = undefined;
            } else {
              //debugger
                currentGame = data.id;
            }
        }
    });
}
