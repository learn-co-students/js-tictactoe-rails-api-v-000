$(document).ready(function () {
	attachListeners();
});

var turn = 0

function attachListeners() {
	$("td").click(function(event) {
		doTurn(this);
	});
	$('button#save').click(function(event) {
	  //prevent form from submitting the default way
	  event.preventDefault();

	  var values = [];
	  $('td').each(function( index ) {
		  values.push($(this).text() );
		});
		var params = { state: values }
		var currentGameId = $('.game_id').text();
		if (currentGameId !== "") {
			$.ajax({
      	type: "PATCH",
      	url: '/games/' + currentGameId,
      	data: params 
    	})
		}else{
		  var posting = $.post('/games', params);
		  posting.done(function(data) {
		  	$('table').append(`<div class="game_id">${data["data"]["id"]}</div>`);
		  });
		};
	});
	$('button#clear').click(function(event) {
		 turn = 0;
		 $('td').each(function( index ) {
		 		$(this).html("");
		 })
		 $('.game_id').remove();
		 $('#message').html("");
	});	
	$('button#previous').click(function(event) {
		 var getGames = $.get('/games');
		 getGames.done(function(data) {
		 	$('#games').html("");
		 	data["data"].forEach(function(element) {
		 		url = '/games/' + element["id"]
		 		id = element["id"]
		 		$('#games').append(`<button data-url="${url}" id="game-${id}">${id}</button>`)
		 		$("#game-" + id).click(function(event) {
		 			var getGame = $.get($(this).attr("data-url"));
		 			getGame.done(function(data) {
		 				turn = 0
						 $('td').each(function( index ) {
						 		$(this).html(data["data"]["attributes"]["state"][index]);
						 		if (data["data"]["attributes"]["state"][index] === "X" || data["data"]["attributes"]["state"][index] === "O" ){
						 			turn += 1;
						 		};
						 })
						 $('.game_id').remove();
						 $('table').append(`<div class="game_id">${data["data"]["id"]}</div>`);
						 $('#message').html("");
		 			});
		 		});
		 	});
		 });
	});	
};

function doTurn(element) {
	if ($(element).text() !== ""){
		alert('This spot is taken!')
	} else {
		if ($('#message').text() === "") {
			updateState(element);
			var isWinner = checkWinner();
			if ( turn === 8 && isWinner === false ) {
				setMessage('Tie game.');
			};
			if (turn === 8 || isWinner === true ){
				$('button#save').click();
				$('button#clear').click();
				return turn;
			}else{
				turn += 1;
				return turn;
			};
		} else {
			$('button#clear').click();
		};
	};
};

function player() {
	if ((turn % 2) === 1){
		return "O";
	}else{
		return "X";
	};
};

function checkWinner() {
  var winningXCombinations = [
  ["X", "X", "X", "", "", "", "", "", ""],
  ["", "", "", "X", "X", "X", "", "", ""],
  ["", "", "", "", "", "", "X", "X", "X"],
  ["X", "", "", "X", "", "", "X", "", ""],
  ["", "X", "", "", "X", "", "", "X", ""],
  ["", "", "X", "", "", "X", "", "", "X"],
  ["X", "", "", "", "X", "", "", "", "X"],
  ["", "", "X", "", "X", "", "X", "", ""]
  ]

  var winningOCombinations = [
  ["O", "O", "O", "", "", "", "", "", ""],
  ["", "", "", "O", "O", "O", "", "", ""],
  ["", "", "", "", "", "", "O", "O", "O"],
  ["O", "", "", "O", "", "", "O", "", ""],
  ["", "O", "", "", "O", "", "", "O", ""],
  ["", "", "O", "", "", "O", "", "", "O"],
  ["O", "", "", "", "O", "", "", "", "O"],
  ["", "", "O", "", "O", "", "O", "", ""]
  ]

  checkForXWin = []
  $('td').each(function( index ) {
		 if(($(this).text()) === "X"){
		 	checkForXWin.push($(this).text());
		 }else{
		 	checkForXWin.push("");
		 }
	});

  checkForOWin = []
  $('td').each(function( index ) {
		 if(($(this).text()) === "O"){
		 	checkForOWin.push($(this).text());
		 }else{
		 	checkForOWin.push("");
		 }
	});

	var xWon = false;
	var oWon = false;

	winningXCombinations.forEach(function(element) {
  	var i = 0 
  	element.forEach(function(e, index, array) {
  		if (e === checkForXWin[index] && e === "X"){
  			i += 1;
  		};
  	})
  	if (i === 3) {
  		xWon = true;
  	};
  });

  winningOCombinations.forEach(function(element) {
  	var j = 0 
  	element.forEach(function(e, index, array) {
  		if (e === checkForOWin[index] && e === "O"){
  			j += 1;
  		};
  	})
  	if (j === 3) {
  		oWon = true;
  	};
  });

  if (xWon === true){
  	setMessage('Player X Won!');
  	return true;
  }else if (oWon === true) {
  	setMessage('Player O Won!');
  	return true;
  }else {
  	return false;
  };
};

function updateState(element) {
	$(element).html(player());
};

function setMessage(message) {
	$('#message').html(message);
};



