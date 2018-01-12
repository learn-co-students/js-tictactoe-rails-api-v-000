// Code your JavaScript / jQuery solution here
  var turn = 0;

  var gameId = 0;

  var winCombos = [
     [0,1,2],
     [3,4,5],
     [6,7,8],
     [0,3,6],
     [1,4,7],
     [2,5,8],
     [0,4,8],
     [2,4,6]
  ]

  function resetGame(){
    gameId = 0;
    turn = 0;
    $("td").text("");
  }

  function player(){
    return turn % 2 == 0 ? 'X' : 'O';
  }

  function updateState(space){
    return $(space).text() !== "" ? false : $(space).text(player());
  }

  function setMessage(string){
    $("#message").text(string);
  }

  function getBoard() {
    return $("td").toArray().map(element => element.innerHTML);
  }

  function checkWinner(){
    let board = getBoard();
    let winner = false;
    for(let combo of winCombos) {
      if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        winner = true;
        setMessage(`Player ${board[combo[0]]} Won!`);
      }
    }
    return winner;
  }

  function doTurn(space){
    if (updateState(space)){
      turn += 1;
      if(checkWinner()) {
        saveGame();
        resetGame();
      } else if(turn === 9){
        setMessage("Tie game.");
        saveGame();
        resetGame();
      }
    }
  }

  function getGame(id) {
    gameId = id;
    turn = 0;
    $.get(`/games/${id}`, function(data) {
      let tds = $('td').toArray();
      data['data']['attributes']['state'].forEach(function(space, idx) {
        space !== "" ? turn += 1 : turn = turn;
        $(tds[idx]).text(space);
      });
    });
  }

  function saveGame() {
    let board = {state: getBoard()};
    if (gameId === 0) {
      $.post('/games', board).done(function(data) {
        gameId = data['data']['id'];
      });
      
    } else {
      $.ajax({
        type: "PATCH",
        url: `/games/${gameId}`,
        data: board
      })
    }
  }

  function attachListeners(){
    $("td").click(function() {
      checkWinner() ? false : doTurn(this);
    })

    $("#save").click(saveGame);

    $("#previous").on("click", function () {
      $.get("/games", function(data) {
        $("#games").text("");
        data['data'].forEach(function(game) { 
          let id = game['id'];
          $("#games").append(`<button data-id='${id}' onclick='getGame(${id})'>${id}</button><br>`);
        });
      });
    });

    $("#clear").click(resetGame);
  }

  $(function() {
    attachListeners();
  })

