// Code your JavaScript / jQuery solution here

var turn = 0;
var token;
WIN_COMBINATIONS = [
    [0,1,2], [3,4,5], [6,7,8], [0,4,8], [0,3,6], [1,4,7], [2,5,8], [2,4,6]
  ]
var currentGameState = new Array(9).fill("")
var currentGameId = 0

$(document).ready(function(){
    attachListeners()
});

function saveGame(){
    gameData = {state: currentGameState}
  
    if (currentGameId){
      $.ajax({
        method: "PATCH",
        url: "/games/" + currentGameId,
        data: gameData
      });
    } else {
      $.post('/games', gameData, function(data){
        currentGameId = data["data"]["id"]
      });
    }
  }

 function previousGames() {
    $("#games").empty();
    $.get('/games', (game) => {
      game.data.forEach(function(game) {
        $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
        $(`#gameid-${game.id}`).on('click', () => loadGame(game.id));
      });
    });
}

function loadGame(gameId) {
    $.get('/games/' + gameId, function(data) {
      // console.log(data.data.attributes.state);
      currentGame = data.data.id;
      const state = data.data.attributes.state;
      turn = state.join("").length;
      let index = 0;
      let td = $("td");
      $.each(td, function(key, value) {
        value.innerHTML = state[index];
        index++;
      });
    });
  }

function player() {
    if (this.turn % 2 === 0 ) {
        let token = 'X';
        return token;
    }
    else if (Math.abs(this.turn % 2 === 1)) {
        let token = 'O';
        return token;
    };
};

function updateState(state) {
    var token = player();
    if ($(state).text() === ""){
        $(state).text(token);
    };
};

function setMessage(theMessage) {
    document.getElementById("message").innerHTML = theMessage;
};

function checkWinner() {
    let board = {};
    let winner = false;
    
    $('td').text(function (index, space) {
      board[index] = space;
    });
  
    WIN_COMBINATIONS.forEach(function (combo) {
      if(board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== "") {
        setMessage(`Player ${board[combo[0]]} Won!`);
        $("#save").click();
        return winner = true;
      };
    });
    return winner;
  };

function doTurn(token) {
    turn++;

    if (checkWinner()) {
        saveGame();
        resetBoard();
        let turn = 0;
    } else if (checkWinner() === false && this.turn === 9 ) {
        setMessage("Tie game.");
        saveGame();
        resetBoard();
        let turn = 0;
    } else if (checkWinner() === false && this.turn < 9 ) {
        updateState(token);
    };
};

// function attachListeners() {
//     $("td").on("click", function() {
//       if (!checkWinner() && this.innerText === "") {
//         doTurn(this);
//       };
//     });
  
//     $("#clear").on("click", resetBoard);
//     $("#previous").on("click", previousGames);
//     $("#save").on("click", saveGame);
// };

function attachListeners() {
	$('td').click(function(e){
		doTurn(e);
	})

	$('#save').click(function(e){
		superSave();
	})

	$('#previous').click(function(e){
		$.get('/games', function(response){
			$('#games').html("")
			$.each(response["games"], function(index, value) {
				//CODE TO ACTUALLY GIVE YOU GOOD LINKS   HERE
				$('#games').append("<a href='#' class='link' data-id=" + value["id"] +">Game " + value["id"] + "</p>")
			})
			addLinkHandlers();
		})
	})
}

function resetBoard() {
    turn = 0
    let tds = document.querySelectorAll("td")
    tds.forEach(function(element) {
        if ( element.innerHTML === "X" || element.innerHTML === "O" ) {
            element.innerHTML = "";
        };
        console.log(element.innerHTML);
    });
};