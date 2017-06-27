var turn = 0;
var currentGame = 0;

var win_combos = [
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[2,0],[1,1],[0,2]]
  ];

$(function(){
  attachListeners();
});

function attachListeners() {
  $("td").click(function(e) {
    doTurn(e);
 	});

 	$("#save").click(function() {
 		saveBoard(false);
 	});

  $("#previous").click(function() {
    getGames();
  });
};

function doTurn(e) {
 	updateState(e);
 	turn++;
 	checkWinner();
};

function updateState(e) {
  $(e.target).html(player());
}

function player() {
 return (turn % 2 === 0 ? 'X' : 'O');
};

function reset() {
	$('td').empty();
	turn = 0;
	currentGame = 0;
};

function message(string) {
  $('div#message').text(string);
};

function checkWinner() {
 if (turn > 5) {
   win_combos.forEach(function(combo){
     var $td1 = $('td[data-x="' + combo[0][0] + '"][data-y="' + combo[0][1] + '"]').text()
     var $td2 = $('td[data-x="' + combo[1][0] + '"][data-y="' + combo[1][1] + '"]').text()
     var $td3 = $('td[data-x="' + combo[2][0] + '"][data-y="' + combo[2][1] + '"]').text()
     var row = $td1 + $td2 + $td3 ;

     if (row === 'XXX' || row === 'OOO') {
       message(`Player ${$td1} Won!`);
       saveBoard(true);
       reset();
       return;
     }
   });

 checkTie()
 return false;
};

function checkTie() {
  if (turn > 8) {
    message('Tie game');
    saveBoard(true);
    reset();
    }
  }
}

function clearBoard() {
  $("games").empty();
};

function currentBoardCells() {
	var board = [];
	$('td').each(function() {
		board.push($(this).text());
	})
	return board;
};

function saveBoard(gameOver){
	method = 'patch';
	url = '/games/' + currentGame;

	$.ajax({
		method: method,
		url: url,
		data: { game: { state: currentBoardCells() } }
	}).done(function(response){
	   if (gameOver) {
			  currentGame = 0;
		 } else {
		    currentGame = response["id"];
		 }
  })
};

function getGames() {
	$.get('/games', function(response) {
		var savedGames = response;
		clearBoard();
		if (savedGames.length > 0){
      $("#games").append('<ul></ul>')
			var list = $("#games ul");
			savedGames.forEach(function(game){
				list.append('<li id="' + game["id"] + '">' + game["id"] + "</li>")
			})
		}
	})
};
