// Code your JavaScript / jQuery solution here
const WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ]

  var turn = 0;
  var currentGame = 0;

  $(document).ready(function() {
  attachListeners();
  });

  function attachListeners() {
       $("td").on("click", function() {
         if (!$.text(this) && !checkWinner()) {
             doTurn(this);
        }
    });

    $('#save').on('click', () => saveGame());
    $('#previous').on('click', () => showPreviousGames());
    $('#clear').on('click', () => resetGame());
 }


   var player = () => turn % 2 ? 'O' : 'X';

   var updateState = function(td) {
        $(td).append(player());
    }

    var message = (string) => $('#message').append(string);

    var board = () => {
        var array = []
        document.querySelectorAll('td').forEach((td) => { array.push(td.innerHTML)});
        return array;
    };

    var checkWinner = function() {
        // we have WIN_COMBINATIONS that lead to our winning row, they are nested arrays
        for (var i = 0; i < WIN_COMBINATIONS.length; i++) {
            var combo = WIN_COMBINATIONS[i] // nested array [0,1,2], board()[combo[0]] it'll be board()[0]
            if(board()[combo[0]] == board()[combo[1]] &&
            board()[combo[1]] == board()[combo[2]] &&
            board()[combo[0]] != ""){
                setMessage(`Player ${board()[combo[0]]} Won!`);
                return true; // return exits the function and returns the value
            }
        }
        return false;
    }

    function resetGame() {
        $('td').empty();
        turn = 0;
        currentGame = 0;
    }

    function setMessage(string) {
      $('#message').text(string);
    }

        function doTurn(square) {
      updateState(square);
      turn++;
      if (checkWinner()) {
        saveGame();
        resetGame();
      } else if (turn === 9) {
        setMessage("Tie game.");
        saveGame();
        resetGame();
      }
    }

    function saveGame() {
    var state = [];
    var gameData;

    $('td').text((index, td) => {
        state.push(td);
    });

    gameData = {state: state};

    if (currentGame !== 0) {
        $.ajax({
        url: `/games/${currentGame}`,
        data: {
            state: state,
            id: currentGame
        },
        type: 'PATCH'
        });
    } else {
        $.post('/games', { state: state }).done((data) => {
             currentGame = data["data"]["id"];
        });
    }
}


    function loadGame(event) {
    var id = $(event.target).data('id');
    $.get(`/games/${id}`, (game) => {
        currentGame = game["data"]["id"];
        var $td = $('td');
        game["data"]["attributes"]["state"].forEach((data, i) => {
            if (data) {
                $td[i].innerHTML = data;
                ++turn;
            } else {
                $td[i].innerHTML = '';
            }
        });
    });
}

function showPreviousGames() {
$.get('/games', (data) => {
    var games = data["data"];
    if (games.length > 0) {
        var gamesHtml = "";

        $(games).each((i, game) => {
            gamesHtml += '<button data-id="' + game["id"] + '" class="game-button">' + game.id + '</button><br>';
        });

        $('#games').html(gamesHtml);
        $('.game-button').on('click', (event) => {
            loadGame(event);
        });
    }
  });
}
