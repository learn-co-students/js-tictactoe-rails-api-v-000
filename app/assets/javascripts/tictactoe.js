  $(document).ready(function() {
    attachListeners();
  })

var turn =0;
var currentGame = undefined;

var winningCombos = [
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]]
  ];


function attachListeners() {

    $( "tbody" ).on("click", function(event) {
      doTurn(event);
    });
    $("#save").on("click", function(event) {

      save(currentGame);
      console.log("game id within the save button method " + currentGame);

    });
    $("#previous").on("click", function(event) {
      previousGames();

    });
    $(document).on("click", "li",  function(event) {
      getGame($(this).data("id"));

    })
}

function doTurn(event) {

  updateState(event); // updates the square with the token
  // console.log("what is the value of checkWinner? " + checkWinner());
  if(checkWinner() == true) { //check to see if there is a winner

    save(currentGame); // save the board state using json
    console.log(currentGame + " inside doTurn, checkWinner");
    resetBoard(); // resets the board
    currentGame = undefined;

  } else if (tieGame()) { // check to see if the game is tied.
      save(currentGame);
      console.log(currentGame + "inside doTurn, tieGame");
      message("Tie game");
      resetBoard();
      currentGame = undefined;

  } else {

    turn +=1;

  }
}
function player() {
  if((turn % 2) == 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(event) {
  $(event.target).html(player());
}

function checkWinner() {
  var gameOver = false
  winningCombos.forEach(function(combination) {

    var cell1 = cell(combination[0]);
    var cell2 = cell(combination[1]);
    var cell3 = cell(combination[2]);

    if(cell1 === player() && cell2 === player() && cell3 === player()) {
      message("Player " + player() + " Won!");

      gameOver = true;
    }

    return gameOver;
  });
  return gameOver;
}
function cell(item1) {
  return $('[data-x="' + item1[0] + '"][data-y="' + item1[1] + '"]').html();
}


function ajaxResponse(method, url) {
  var id = "";
  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: { game: { state: createBoard() }}
  }).success(function(response){
    // console.log("this is the response" + response.game.id);
    id = response.game.id

  }).error(function(error){
    console.log(error);
  });
  console.log("this is the currentGame" + id);
  return id;
}
function save(currentGame) {

  console.log("inside the save function gameID: " + currentGame + "!" );
  //find out whether the game has already been saved by getting the value of the data-id

  if(currentGame) {
    var url = "/games/" + currentGame;
    console.log("url = " + url);
    // console.log(ajaxResponse('PATCH', url));
    ajaxResponse('PATCH', url)
  } else {
    currentGame = ajaxResponse('POST', '/games');

  }
}



function createBoard(){
  board = []
  $("tbody td").each(function(){
    board.push(this.innerHTML)
  })
  return board
}

function message(theMessage) {
    $("#message").text(theMessage)
}

function resetBoard() {
  $("tbody td").text("");
  turn = 0;

}

function tieGame() {
  if(!checkWinner() && turn === 8) {
    turn = 0;
    return true;
  } else {
    return false;
  }
}
function getGame(id) {


  $.get("/games/" + id, function(data) {
    loadGame(data["game"]["state"]);
    currentGame = data["game"]["id"];
  });

}
function loadGame(state) {
    var i = 0;
  $("tbody td").each(function() {
      $(this).text(state[i]);
      // turn = $(this).text(state).length;
      i++;
    });
}

function previousGames() {
  $("#games").html("");

  $.ajax({
    method: "GET",
    url: "/games",
    dataType: "json",
  }).success(function(data) {
    var games = data["games"];
    if(games.length >0) {
      $("#games").append("<ul></ul>");
      for(var key in games) {
        $("#games ul").append("<li data-id=" + games[key]["id"] + ">" + games[key]["id"] + "</li>");
      }
    }

  });
}
