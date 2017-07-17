// Code your JavaScript / jQuery solution here
var turn = 0;
const winCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var id;

function newBoard() {
  $('td').html('');
  turn = -1;
 }

function player(){
  if (turn % 2 === 0) {
    return 'X';
  }
  else {
    return 'O';
  }
}

function updateState(position) {
  var x = $(position).data('x');
  var y = $(position).data('y');
  $(`[data-x=${x}][data-y=${y}]`).html(player());
}

function message(response) {
  $('#message').html(response)
}

function checkWinner() {
  var winner = false;
  var board = $('td').map(function() {
   return this.innerHTML;
 }).toArray();

 winCombos.forEach((position) => {
   var a = board[position[0]];
   var b = board[position[1]];
   var c = board[position[2]];

   if (a !== '' && a === b && a === c) {
        winner = true;
        if (winner === true) {
          message(`Player ${a} Won!`);
          saveGame();
          newBoard();
        }
      }
    else if (turn == 8){
          message("Tie game.");
          saveGame();
          newBoard();
        }
  });
    return winner;
}

function doTurn(position) {
  var x = $(position).data('x');
  var y = $(position).data('y');
  if ($(`[data-x=${x}][data-y=${y}]`).html() === '') {
    updateState(position);
    checkWinner();
    turn += 1;
  };
 }

function updateState(position) {
  var x = $(position).data('x');
  var y = $(position).data('y');
  $(`[data-x=${x}][data-y=${y}]`).html(player());
}


$(document).ready(function() {
  attachListeners();
})

function attachListeners() {
  $('td').click(function() {
    doTurn(this);
  });

  $('#save').click(function() {
    saveGame();
  });

  $('#previous').click(function() {
    showGames();
  });

  $('#clear').click(function() {
    newBoard();
    turn = 0;
    id = null;
  });
}

function showGames() {
  $.get("/games", function(server_response){
    // var gamesHtml = '';
    server_response.data.forEach(function(g) {
      // gamesHtml += "<button>Game " + g.id + "</button><br>"
      if ($('#games').html().indexOf(`gameid-${g.id}`) === -1) {
        $('#games').append(`<button id="gameid-${g.id}">${g.id}</button><br>`);
        $("#gameid-" + g.id).on('click',function(){
          reloadGame(g.id);
        });
      }
    });
    // $("#games").html(gamesHtml);
  });
}

function saveGame() {
  var state_array = [];
  var boardInfo;

  $('td').text((index, number) => {
    state_array.push(number);
  });

  boardInfo = {state: state_array};

  if (id) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${id}`,
      data: boardInfo
    });
  }

  else {
    $.post('/games', boardInfo, function(g) {
      id = g.data.id;
      $('#games').append(`<button id="gameid-${g.data.id}">${g.data.id}</button><br>`);
      $("#gameid-" + g.data.id).on('click',function(){
        reloadGame(g.data.id);
      });
    });
  }
}

function reloadGame(gameID){
  $.get(`/games/${gameID}`, function(data){
    var new_state_tree = data.data.attributes.state;
    var box_num = 0;
    boardInfo = {state: new_state_tree};
    new_state_tree.forEach(function(letter_X_or_O){
      $(`#box${box_num}`).html(letter_X_or_O);
      box_num ++;
    })
  });
  id = gameID;
}
