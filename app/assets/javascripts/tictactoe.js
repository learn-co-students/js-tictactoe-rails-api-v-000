var turn = 0;
var currentGame;
var winCombos = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[2,0], [1,1], [0,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]]
];

function attachListeners() {
  $("tbody").on("click", function(event) {
    doTurn(event);
  });

  $("#previous").on("click", function(data) {
    $.ajax({
      method: "GET",
      url: "/games",
      data: data.games
    })
    .done(function(data) {
      $("#games").html(data);
    });
  });

  $("#save").on("click", function(data) {
    var state = getBoardState();
    $.ajax({
      method: "POST",
      url: "/games",
      dataType: "json",
      data: {
        game: {
          state: state
        }
      }
    });
  });


}

function getBoardState() {
  var boardState = [];
  $("td").each(function() {
    boardState.push($(this).html());
  });
}

function doTurn(event) {
  updateState(event);
  checkWinner();
  turn++;
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(event) {
  var playerToken = player();
  var cell = event.target;
  $(cell).html(playerToken);
}

function message(str) {
  $("#message").html(str);
}

function won(arr) {
    for (var j = 0; j < arr.length; j++) {
      var winIndexOne = arr[j][0];
      var winIndexTwo = arr[j][1];
      var winCell = $('[data-x="' + winIndexOne + '"][data-y="' + winIndexTwo + '"]');
      if(winCell.html() != player()) {
        return false;
      }
    }
      return true;
}

function checkWinner() {
  for(var i = 0; i < winCombos.length; i++) {
      if(won(winCombos[i])) {
        message("Player " + player() + " Won!");
      }
  }
}

$(document).ready(function () {
  attachListeners();
});


