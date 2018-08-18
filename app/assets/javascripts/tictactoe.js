// Code your JavaScript / jQuery solution here
var turn = 0;
var gameId = 0;
var players = ["X", "O"];
// var memo = {};

var winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function player(){
  return (turn % 2 === 0) ? "X" : "O";
};

function updateState(square){
  $(square).text(player());
};

function setMessage(msg){
  $("#message").html(msg);
};

function getBoard(){
  return $("td").map(function() { return $(this).text() });
}


function checkWinner(){
  var state = getBoard();
  var winner = false
  winCombos.some(function(comb){
    if (state[comb[0]] != "" && state[comb[0]] === state[comb[1]] && state[comb[1]] === state[comb[2]]) {
      setMessage(`Player ${state[comb[0]]} Won!`);
      winner = true;
    };
  });
  return winner;
};

function validMove(square) {
  return ($(square).text() === "" && !(checkWinner()));
}

function doTurn(square){
  updateState(square);
  won = checkWinner();
  turn += 1;
  if (won) {
    saveGame();
    resetGame();
    turn = 0;
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetGame();
  }
};

function resetGame(){
  $("td").text("");
  turn = 0;
  gameId = 0;
};

function showPreviousGames(){
  $.get('/games', function(response){
    var games = response["data"];
    $("#games").html("");
    games.forEach(function(game){
      makeGameButton(game)
      // date = new Date(game["attributes"]["updated-at"])
      // $("#games").append(`<button class="gameLink" data-id="${game.id}">` + game.id + `</button> - Updated at: ${date.toDateString()}<br>`);
      attachGameLinkListener(game.id);
    });
  });
}

function makeGameButton(game){
  date = new Date(game["attributes"]["updated-at"])
  $("#games").append(`<button class="gameLink" data-id="${game.id}">` + game.id + `</button> - Updated at: ${date.toDateString()}<br>`);
}

// without memo
function reloadGame(game){
  $.get('/games/' + game, function(resp){
    console.log(resp);
    gameId = resp.data.id;
    turn = 0;
    $('td').each(function(i){
      $(this).text(resp.data.attributes.state[i]);
      $(this).text() != "" ? turn++ : console.log("Empty");
    });
  });
};

//with memo (in progress - currently all .get requests made from in here are stuck on pending)
// function reloadGame(game){
//   var data = retrieve(game)
//   debugger
//   gameId = data.id;
//   turn = 0;
//   $('td').each(function(i){
//     $(this).text(data.attributes.state[i]);
//     $(this).text() != "" ? turn++ : console.log("Empty");
//   });
// };
//
// function retrieve(game){
//   var data;
//   if (game in memo) {
//     data = memo[game];
//   } else {
//     $.get('/games/' + game, function(resp){
//       console.log(resp);
//       debugger
//       data = resp["data"];
//       memo[game] = data;
//     });
//   };
//   debugger
//   return data;
// };
//
// function retrieve(game){
//   var memo = {};
//     return function(){
//       var id = game;
//       if (memo[id]){
//         console.log(id)
//         return memo[id];
//       }
//       else{
//         $.get('/games/' + game, function(resp){
//         }).done(function(resp){
//           console.log(resp);
//           data = resp["data"];
//           memo[game] = data;
//         })
//       }
//   }
// }



function saveGame(){
  state = $.makeArray(getBoard())
  if (gameId === 0){
    $.ajax({
      url: '/games',
      method: 'post',
      data: {state: state}
    }).done(function(resp){
      game = resp["data"];
      gameId = game.id;
      makeGameButton(game)
      attachGameLinkListener(game.id);
    });
  } else {
    $.ajax({
      url: '/games/' + gameId,
      method: "PATCH",
      data: {state: state}
    }).done(function(resp){
    });
  };
}

function attachListeners(){
  $('td').on('click', function() { (validMove(this)) ? doTurn(this) : setMessage("Invalid Move!")});
  $('#save').on('click', function() { saveGame()} );
  $('#previous').on('click', function() { showPreviousGames()} );
  $('#clear').on('click', function() { resetGame()} )
};

function attachGameLinkListener(game){
  $(`.gameLink[data-id=${game}]`).on('click', function(){
    reloadGame(this.dataset.id)
    });
}

$(document).ready(function(){
  attachListeners();
});
