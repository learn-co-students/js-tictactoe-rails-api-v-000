var turn = 0;
var currentGame = 0;

var player = function(){
  if(turn === 0 || turn%2 == 0) {
    return "X"
  } else if (turn%2 === 1) {
    return "O"
  }
};

var boardData = function() {
   var boardCellData = `["${cellValue([0,0])}","${cellValue([1,0])}","${cellValue([2,0])}","${cellValue([0,1])}","${cellValue([1,1])}","${cellValue([2,1])}","${cellValue([0,2])}","${cellValue([1,2])}","${cellValue([2,2])}"]`
   return '{"game": {"state":' + boardCellData + '}}'
}

var doTurn = function(cell){
  var x = $(cell).data("x");
  var y = $(cell).data("y");
  console.log(`current game is ${currentGame}`)
  updateState(cell);
  turn += 1;
  checkWinner();
  checkTie();
  resetBoard();
};

var updateState = function(cell){
  if ($(cell).text() === "") {
    $(cell).text(player())
  } else {
    console.log("You've selected a cell that's already been chosen");
    turn -= 1;
  }
};

const WINCOMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

const BOARDCOORDINATES = [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]]

var cell = function([xCord, yCord]) {
  return $(`[data-x='${xCord}'][data-y='${yCord}']`)
};

var cellValue = function(xCord, yCord) {
  return cell(xCord, yCord).text()
};

var board = function() {
  var boardCells = BOARDCOORDINATES.map(c => cellValue(c));
  return boardCells;
};

var checkWinner = function(){
  var winner = false;
  WINCOMBINATIONS.forEach(combo => { // combo is something like [0,1,2]
    var boardWin = combo.map(n => board()[n]);
    if (boardWin[0] != "" && boardWin[0] === boardWin[1] && boardWin[1] == boardWin[2]) {
      winner = boardWin[0];
      message(`Player ${boardWin[0]} Won!`)
    }
  })
  return winner;
};

var checkTie = function() {
  var tie = false;
  if (!checkWinner() && !board().includes("")) {
    tie = true;
    message("Tie game");
  };
  return tie;
};

var resetBoard = function() {
  if (checkWinner() || checkTie()) {
    saveBoard();
    $("td").each((index, element) => $(element).text(""));
    turn = 0;
    currentGame = 0;
  }
};

var saveBoard = function() {
  if (currentGame === 0) {
    $.post('/games', JSON.parse(boardData()))
  } else {
    $.ajax({
      url: '/games/'+currentGame,
      data: JSON.parse(boardData()),
      type: 'PATCH',
      dataType: 'json'
    });
  }
};


var attachListeners = function(){
  $(document).on("click", "td", function(){
    doTurn(this)
  });
  $("#previous").on("click", function(){
    getAllGames();
  });
  $("#save").on("click", function(){
    saveBoardButton();
  });
  $(document).on("click", "p.get-game", function(){
    getGame(this);
  });
};

var message = function(message){
  $("#message").html(message)
};

var saveBoardButton = function() {
  if (currentGame === 0) {
    var posting = $.post('/games', JSON.parse(boardData()))
    posting.done(function(data){
      currentGame = data["game"]["id"]
    });
  } else {
    $.ajax({
      url: '/games/'+currentGame,
      data: JSON.parse(boardData()),
      type: 'PATCH',
      dataType: 'json',
      success: function() {
        // callback goes here
      }
    });
  }
}

var getAllGames = function(){
  $.get('/games', function(response){
    response["games"].forEach(game => {
      $("#games").append(`<p class="get-game" data-id="${game.id}">${game.id}.</p>`)
    });
  })
};

var getGame = function(element){
  var id = $(element).attr("data-id")
  $.get('/games/'+ id, function(response){
    console.log(response)
    currentGame = response["game"]["id"]
    for(i = 0; i < 9; i++) {
      cell(BOARDCOORDINATES[i]).text(response["game"]["state"][i])
    };
    // ideally here I'd also do a turn count.
  });
};

$(function(){
  attachListeners();
});
