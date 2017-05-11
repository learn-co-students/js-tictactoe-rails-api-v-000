var turn = 0;
var flag = false;
var currentGame = 0;

var winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2] 
  ];

function doTurn(xPosition, yPosition){
  var board = loadBoard();
  // console.log( board );
  // if (board[((yPosition * 3) + xPosition)] === ""){
    updateState(xPosition,yPosition);
    turn++;
    checkWinner();
  // } else {
  //   message("Invalid Move");
  //   $('#message').delay(1000).fadeOut('slow');
  // }
}

function checkWinner(){
  var board = loadBoard();
  for (var i = 0; i < winCombos.length; i++){ 
    combo = winCombos[i];
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] != ""){      
      var winnersToken = board[combo[0]];
      message("Player " + winnersToken + " Won!");
      saveGame(flag);
      flag = false;
      resetBoard();
      return true;
    } else if (turn === 9) {
      message("Tie game");
      saveGame(flag);
      resetBoard();
    }
  }
  return false;
}

function player(){
  if (turn % 2 === 0){
    return "X";
  } else {
    return "O";
  }
}

function message(string){
  $('#message').text(string);
  // resetBoard();
}

function resetBoard(){
  turn = 0;
  $('td').each(function(){
    $(this).text("");
  })
}

function updateState(xPosition, yPosition){
  var token = player();
  $('td[data-x="' + xPosition + '"][data-y="' + yPosition + '"]').text(token);
}

function loadBoard(){
  var board = [];
  $('td').each(function(index,element){
    board.push(element.innerHTML);
  });
  return board;
}

function loadSavedGame(){
  $('[data-gameid]').on('click', function(){
    resetBoard();
    var id = $(this).attr('id');
    $.get('/games/' + id, function(data){
      var count = 0;
      var stringArray = data["state"].split('');
      console.log(data);
      currentGame = data["id"];
      for (var i = 0; i < 3; i++){
        for (var j = 0; j < 3; j++){
          $('td[data-x="' + i + '"][data-y="' + j + '"]').text(stringArray[count]);
          if (stringArray[count] != ''){
            turn++;
          }
          count ++;
        };
      };
    })
  });
}

function returnGames(){
  $('#games').text('');
  $.get("/games", function(data){
    data["games"].forEach(function(element){
      $('#games').append("<li class='game' id='" + element["id"] + "' data-gameid='"+ element["id"] +"'>Game " + element["id"] + "</li>")
    })
    loadSavedGame();
  });
}


function saveGame(gameSaved){
  var board = loadBoard();
  board.forEach(function(element,index){
    if (element === '') {
      board[index] = ' ';
    }
  });
  board = board.join('');
  var serialized = {"game":{"state": board}};
  if (gameSaved) {
    console.log("PATCHING to /games/" + currentGame)
    $.ajax({
      url: ("/games/" + currentGame),
      method: "patch",
      data: serialized
    }).done(function() {
      message("Game Saved!");
    });
  } else {
    console.log("Saving...");
    $.post('/games',serialized).done(function(data){
      if (serialized["game"]["state"] === data["state"]) {
        console.log(data["id"]);
        currentGame = data["id"];
        $('#message').text("Game Saved!");
        flag = true;
      } else {
        $('#message').text("Error with saving...");
        console.log("Wut");
      }
    });
  }
}

function attachListeners(){
  $('td').on("click", function(){
    var x = $(this).data("x");
    var y = $(this).data("y");
    doTurn(x, y);
  });

  $('#save').on('click', function(){
    saveGame(flag);
  });

  $('#previous').on('click', function(){
    returnGames();
  });
}

$(function() {
  attachListeners();
});
