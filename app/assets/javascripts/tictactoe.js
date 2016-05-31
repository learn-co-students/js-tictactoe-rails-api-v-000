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

var saved = false;
var currentGameId = undefined;
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
    $("#games").click(function(event) {
        loadGame(event);
    });
    $('#reset').click(function(){
       resetBoard();
    });
}

//GAMEPLAY -------------------------------
function doTurn(event){
    updateState(event);
    turn++;
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
    $(event.target).text(player());
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
        var won = false;
        getBoard();
        if (board[win_combos[i][0]] == 'X' && board[win_combos[i][1]] == 'X' && board[win_combos[i][2]] == 'X'){
            message('Player X Won!');
            won = true;
            forceNewSave();
            resetBoard();
        } else if (board[win_combos[i][0]] == 'O' && board[win_combos[i][1]] == 'O' && board[win_combos[i][2]] == 'O'){
            message('Player O Won!');
            won = true;
            forceNewSave();
            resetBoard();
        } else if (turn == 9){
          message('Tie game');
          resetBoard();
        }
    }
    return won;
}

function message(text){
    $('#message').text(text);
}

function resetBoard(){
    board=[];
    turn = 0;
    saved = false;
    setSaved();
    $('td').text("");
}

//PERSISTENCE ------------------------------

function setSaved(){
    $('#saved').text('Saved: ' + saved)
}

function forceNewSave(){
  $.post('/games', {game: {state: board}}, function(success){
      //need to get/set currentGameId
      currentGameId = success.game.id;
      $('#data').text("Current game: " + currentGameId);
      saved = true;
      setSaved();
  });
}

function save(){
    //if saved === false, post request
    //set saved to true
    //set currentGameId
    //else if saved === true, patch request
    //set saved to true

    getBoard();

    if (saved == false){ //if game has never been saved
        alert('saving...');
        alert(board);
        $.post('/games', {game: {state: board}}, function(success){
            //need to get/set currentGameId
            currentGameId = success.game.id;
            $('#data').text("Current game: " + currentGameId);
            saved = true;
            setSaved();
        });
    } else { //if game has been previously saved
      $.ajax({
        url: '/games/' + currentGame,
        type: 'PATCH',
        dataType: 'json',
        data: {game: {state: board}}
      }).done(function(response){
      });
    }
}

function showGames(){
    $.get('/games', function(data){
        if (data.games.length > 0){
            var html = '';
            $.each(data.games, function(i, game){
                html += "<p data-gameid='" + game.id + "'>Game " + game.id + "</p>";
            });
            $("#games").html(html);
        } else{
            $("#games").html("No previous games")
        }
    });
}

function loadGame(event){
    //load from gameid data attribute
    //set saved = true
    //set board
    var url = '/games/' + $(event.target).data('gameid');
    alert(url);
    $.get(url, function(success){
      board = success.game.state;
      alert(board); //BOARD IS AN OBJECT, CANT ACCESS DATA
       $('td').each(function(index, cell){
         $(cell).text("x");
       });
    });
}


$(document).ready(function(){
    attachListeners();
});
