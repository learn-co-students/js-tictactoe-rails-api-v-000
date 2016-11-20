var turn = 0;
var currentGame = 0;
var winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

function attachListeners() {
  $('td').click(function(move) {
    doTurn(move);
  });

  $('#save').click(saveGameState);

  // NOTE: Game # Link(s)
  // (1) Clicking on an individual (Game#) link makes an ajax call via getJSON().
  // (2) With the data-id attribute, getJSON makes a 'GET' request for the specified game resource.
  // (3) The request gets processed by the #show action in games controller and returned in the response.
  // (4) TODO: Take the response variable and populate the board with those values and resume game.
  //
  $('#games').on('click', 'a', function(event) {
    event.preventDefault();
    var id = $(this).attr("data-id");

    $.getJSON(`/games/${id}.json`, function(response){
      // TODO: edit response below
      var gameState = response.game.state;
    });//end
  });//end of on()

  // NOTE: "Show Previous" button
  // Game History (clicking the "Show Previous Games")
  // (1) Clicking on the "Show Previous" button makes an ajax call via getJSON().
  // (2) getJSON makes a 'GET' request for all available game resources.
  // (3) The request gets processed by the #index action in games controller and returned in the response.
  $("#previous").on('click', function() {
    $.getJSON("/games", function(response) {

      // var html = "<h2>Game History</h2>";
      var html = "";
      $.each(response.games, function(i, game){
        var id = game.id;
        html += `<li><a href="#" class"js-game" data-id="${id}">Game #${id}</a></li>`;
      }); //end of each()
      $("#games").html(html);

    });//end of get()
  });//end of on()
}

function board() {
  allTd = $('td').map(function(index, square) {
    return square.innerHTML;
  });
  return $.makeArray(allTd);
}

function loadBoard(save) {

}

function clearBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function doTurn(move) {
  updateState(move.target);
  turn++;
  checkWinner();
}

function player() {
  return (turn % 2 === 0) ? "X" : "O";
}

function updateState(move) {
  $(move).text(player());
}

function checkWinner() {
  if (board()[0] === board()[1] && board()[1] === board()[2] && board()[2] !== "") {
    return message("Player " + board()[0] + " Won!");
  } else if (board()[3] === board()[4] && board()[4] === board()[5] && board()[5] !== "") {
    return message("Player " + board()[3] + " Won!");
  } else if (board()[6] === board()[7] && board()[7] === board()[8] && board()[8] !== "") {
    return message("Player " + board()[6] + " Won!");
  } else if (board()[0] === board()[4] && board()[4] === board()[8] && board()[8] !== "") {
    return message("Player " + board()[0] + " Won!");
  } else if (board()[2] === board()[4] && board()[4] === board()[6] && board()[6] !== "") {
    return message("Player " + board()[2] + " Won!");
  } else if (board()[0] === board()[3] && board()[3] === board()[6] && board()[6] !== "") {
    return message("Player " + board()[0] + " Won!");
  } else if (board()[1] === board()[4] && board()[4] === board()[7] && board()[7] !== "") {
    return message("Player " + board()[1] + " Won!");
  } else if (board()[2] === board()[5] && board()[5] === board()[8] && board()[8] !== "") {
    return message("Player " + board()[2] + " Won!");
  } else if ($.inArray("", board()) === -1) {
    return message("Tie game");
  } else {
    return false;
  }
}

function message(string) {
  $('#message').html(string);
  saveGameState();
  clearBoard();
}

// NOTE: Saves or updates game resource to the db
function saveGameState() {
  var gameState = board();

  // TODO: Set "ajaxMethod" and "ajaxUrl" variables
  // (1) "ajaxType" should be set to "POST" if game is new or set to "PATCH" if game is in progress.
  // (2) Set "ajaxUrl" to "games/id_value" if updating an existing resource.
  $.ajax({
    type: (currentGame === 0) ? 'POST' : 'PATCH',
    url: (currentGame === 0) ? '/games' : '/games/' + currentGame,
    dataType: 'json',
    data: { game: {id: currentGame, state: gameState} },
    success: function(data) {
      currentGame = data.game.id;
    }
  });
}


$(function() {
  attachListeners();
});
