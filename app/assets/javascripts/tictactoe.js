var turn = 0;

var currentGame = 0;

WIN_COMBINATIONS = [
    [0,1,2], // Top row
    [3,4,5], // Middle row
    [6,7,8], // Bottom row
    [0,4,8], // Left diagonal
    [0,3,6], // Left vertical
    [1,4,7], // Middle vertical
    [2,5,8], // right vertical
    [2,4,6]  // right diagonal
  ]

  function resetGame(){
    currentGame = 0;
    turn = 0;
    $("td").empty();
  }

  function player() {
    if(turn % 2 != 0) {
      return 'O'
    } else {
      return 'X'
    };
  };

  function updateState(position){
    return $(position).text() !== "" ? false : $(position).text(player());
  };

  function setMessage(string){
    $("#message").text(string);
  };

  function getBoard() {
    return $("td").toArray().map(element => element.innerHTML);
  };

  function checkWinner() {
    let board = {}
    let winner = false
    
    $('td').text(function (index, space) {
      board[index] = space
    });
  
    WIN_COMBINATIONS.forEach(function (combo) {
      if(board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== "") {
        setMessage(`Player ${board[combo[0]]} Won!`)
        $("#save").click()
        return winner = true
      };
    });
    return winner
  };

  function doTurn(input){
    if (updateState(input)){
      turn ++ ;
      if(checkWinner()) {
        saveGame();
        resetGame();
      } else if(turn === 9){
        setMessage("Tie game.");
        saveGame();
        resetGame();
      };
    };
  };

  function getGame(id) {
    currentGame = id;
    turn = 0;
    $.get(`/games/${id}`, function(data) {
      let tds = $('td').toArray();
      data['data']['attributes']['state'].forEach(function(position, i) {
        position !== "" ? turn += 1 : turn = turn;
        $(tds[i]).text(position);
      });
    });
  };

  function saveGame() {
    let board = {state: getBoard()};
    if (currentGame === 0) {
      $.post('/games', board).done(function(data) {
        currentGame = data['data']['id'];
      })

    } else {
      $.ajax({
        method: "PATCH",
        url: `/games/${currentGame}`,
        data: board
      });
    };
  };

  function attachListeners() {
    $("td").on('click', function() {
      if (!$.text(this) && !checkWinner()) {
        doTurn(this);
      };
    });

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
    
  $(document).ready(function() {
    attachListeners();
});
