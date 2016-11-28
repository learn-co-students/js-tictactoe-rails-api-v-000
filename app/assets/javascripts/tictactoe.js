// var turn = 0;
// var gameIsTied;
//
// var winCombos =  [
//                     [0,1,2],
//                     [3,4,5],
//                     [6,7,8],
//                     [0,3,6],
//                     [1,4,7],
//                     [2,5,8],
//                     [0,4,8],
//                     [6,4,2]
//               ];
// var board = [];
//
// function checkWinner(){
//   var response;
//   for(var j = 0; j < winCombos.length; j++){
//     var winCombo = winCombos[j];
//
//     var win_index_1 = winCombo[0];
//     var win_index_2 = winCombo[1];
//     var win_index_3 = winCombo[2];
//
//     var pos_1 = board[win_index_1];
//     var pos_2 = board[win_index_2];
//     var pos_3 = board[win_index_3];
//
//     if (pos_1 === "X" && pos_2 === "X" && pos_3 === "X"){
//       message("Player " + player() + " Won!");
//     }
//     else if(pos_1 === "O" && pos_2 === "O" && pos_3 === "O"){
//       message("Player " + player() + " Won!");
//     }
//   }
//   if (response == undefined){
//     return false;
//   }
//   // else{
//   //   message(response);
//   //   return true;
//   // }
// }
//
// //================================ MAIN FUNCTIONS ==================================
// function attachListeners(){
//   $("td").on('click', function(event) {
//     doTurn(event);
//   });
// }
//
// function boardPositions(event){
//   var element = event.target;
//   var indexVal = $("td").index(event.target);
//   if(element !== undefined){
//     board[indexVal] = element.innerText;
//   }
// }
//
// function doTurn(event){
//   updateState(event);
//   boardPositions(event);
//   checkWinner();
//   checkTieGame();
//
//   if(gameIsTied){
//     message('Tie game');
//   }
//   if(checkWinner() || gameIsTied){
//     resetGame();
//   }else{
//     turn +=1;
//   }
//   console.log(board + turn)
// }
//
// function player(){
//   if (turn % 2 === 0){
//     return "X";
//   }else {
//     return "O";
//   }
// }
//
// function updateState(event){
//   $(event.target).html(player());
// }
//
// function countPositionsTaken(){
//   var newBoard =[];
//   for(let i=0; i < board.length; i++){
//     if(board[i] !=="" && board[i] !== undefined){
//       newBoard.push(board[i]);
//     }
//   }
//   return newBoard.length;
// };
//
// function checkTieGame(){
//   if (countPositionsTaken() == 9 && checkWinner() == false){
//     gameIsTied = true;
//   }
// }
//
// function resetGame(){
//   $("td").html("");
//     turn = 0;
//     board.length = 0;
// }
//
// function message(response){
//   $('#message').html(response);
// }
//
// $(function () {
//     attachListeners();
// });
var turn = 0;
var winningCombos = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[2,0],[2,1],[2,2]], [[1,0],[1,1],[1,2]], [[2,0],[1,1],[0,2]]]
var currentGame;
var checkCells = function(ary) {
  for(var i = 0; i < ary.length; i++) {
    var winningCombo = ary[i];
    var x = winningCombo[0];
    var y = winningCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if( noCellMatch(selector)) {
      return false;
    }
  }
  return true;
}

var checkWinner = function() {
  for(var i = 0; i < winningCombos.length; i++) {
    if(checkCells(winningCombos[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

var player = function() {
  if(turn % 2 == 0) {
    return "X";
  }
  else {
    return "O";
  }
}

var tie = function() {
  var thereIsATie = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      thereIsATie = false;
    }
  });
  if (thereIsATie) message("Tie game");
  return thereIsATie;
}

var noCellMatch = function(element) {
  return (element.html() != player())
}

var doTurn = function(event){
  updateState(event);
  if(checkWinner() || tie() ) {
    save(true);
    resetGame();
  } else {
    turn += 1;
  }
}

var resetGame = function() {
  $("td").html("");
  turn = 0;
  currentGame = 0
}

var message = function(message) {
  $("#message").html(message);
}

var updateState = function(event) {
  $(event.target).html(player());
}

var attachListeners = function() {
  $("tbody").click(function(event) {
    doTurn(event)
  });
  $("#games").click(function(event) {
    var state = parseState(event)
    swapGame(state, getGameId(event))
  })
  $("#save").click(function() {
    save();
  })
  $("#previous").click(function() {
    getAllGames();
  })
}
var parseState = function(event) {
  return $(event.target).data("state").split(",")
}
var getGameId = function(event) {
  return $(event.target).data("gameid")
}

var getAllGames = function() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games)
  })
}

var showGames = function(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  })
  $("#games").html(dom);
}

var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

var swapGame = function(state, id) {
  placeMarks(state);
  currentGame = id;
  turn = findTurn(state);
}

var findTurn = function(state) {
  var turn = 0;
  state.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
  return turn;
}

var placeMarks = function(marks) {
  $("td").each(function(i) {
    $(this).text(marks[i]);
  })
}
var getMarks = function() {
  var marks = []
  $("td").each(function(i) {
    marks.push($(this).text())
  })
  return marks;
}

var save = function(resetCurrentGame) {
  var url, method;
  if(currentGame) {
    url = "/games/" + currentGame
    method = "PATCH"
  } else {
    url = "/games"
    method = "POST"
  }

  $.ajax({
      url: url,
      method: method,
      dataType: "json",
      data: {
        game: {
          state: getMarks()
        }
      }
    }).done(function(data){
      console.log(data);

      if(resetCurrentGame) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }).fail(function(jqXHR, textStatus, errorThrown){
      alert(textStatus, errorThrown);
    });
}

$(function() {
  attachListeners()
})
