var turn = 0;
var winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var dictionary = {0:[0,0], 1:[0,1], 2:[0,2], 3:[1,0], 4:[1,1], 5:[1,2], 6:[2,0], 7:[2,1], 8:[2,2]}
var game = { state: ["", "", "", "", "", "", "", "", ""], id: 0 }

$( document ).ready(function() {
    attachListeners();
});

function attachListeners() {
  $('[data-x]').click(function(event){
    var current = $(event.target)
    if (current.text() === "") {
      doTurn(event);
    }
  });
};

function resetBoard() {
  game = { state: ["", "", "", "", "", "", "", "", ""], id: 0 };
  $('td').text("");
  turn = 0;
};

function doTurn(event) {
  updateState(event);
  turn++;
  checkWinner();
};

function player() {
  if (turn === 0 || turn % 2 === 0){
    return "X";
  } else {
    return "O";
  }
};

function updateState(event) {
  var playerToken = player();
  var x = event.target.attributes["0"].value;
  var y = event.target.attributes["1"].value;
  var myVal = [parseInt(x), parseInt(y)];
  var space = getSpot(myVal);
  game.state[space] = playerToken;
  $(event.target).text(playerToken);

  if (turn === 0 ){
    $.ajax({
        method: "post",
        url: "/games.json",
        data: {game}
      }).success(function(response){
        game.state["id"] = response.game["id"];
      });

    } else {
      $.ajax({
        method: "patch",
        url: "/games/" + game.state["id"] + ".json",
        data: {game}
      });
    }
  };

function checkWinner() {
  for (var combination in winningCombos) {
    if ((game.state[winningCombos[combination][0]] === game.state[winningCombos[combination][1]]) && (game.state[winningCombos[combination][0]] === game.state[winningCombos[combination][2]]) && (game.state[winningCombos[combination][0]] !== "")) {
      var string = 'Player ' + String(game.state[winningCombos[combination][0]]) + ' Won!'
      message(string);
      resetBoard();
    } else if (turn == 9) {
      message("Tie game");
      resetBoard();
    }
  }
  return false;
};

function message(string) {
  $("div#message").text(string);
};

function getSpot(value) {
  for (var key in dictionary) {
    if ((dictionary[key][0] == value[0]) && (dictionary[key][1] == value[1])) return key;
  }
  return false;
};
