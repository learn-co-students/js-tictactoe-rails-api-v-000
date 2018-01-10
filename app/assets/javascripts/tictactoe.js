// Code your JavaScript / jQuery solution her


var WIN_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];


var turn = 0;
var gameId = 0;
var previousGame = 0;
  
  $(document).ready(function() {
      attachListeners();
  });

  function attachListeners(){
    $("td").click(function(){
        if (this.innerHTML === "" && checkWinner() === false ) {
            doTurn(this)
        }
    })

    $("#previous").click(function() {
        $.getJSON('/games', function(resp) {
            $("#games").empty()

            })
        })
    })
  }


  function player(){
    console.log(turn)
    console.log(turn % 2)
      if (turn % 2 === 0) {
          return "X";
      } else {
          return "O";
      }
  }

  function doTurn(box){
      updateState(box);
      if (checkWinner() === true) {
        saveGame();
        resetGame();
        //return
      } else if (catsGame() === true) {
        setMessage("Tie game.")
        saveGame();
        resetGame(); 
      } else {
        turn++;
      }

  }

  function currentBoard(){
      return $("td").toArray().map((box) => {return box.innerHTML})
  }

  function resetGame() {
      $("td").toArray().forEach((box) => {box.innerHTML = ""})
      turn = 0
  }
  
  function updateState(box){
      let token = player();
      //console.log(turn)
      let move = $(box);
      move.text(token);
  }

  function setMessage(string) {
      $("#message").text(string)
  }

  function checkWinner() {
      let board = currentBoard()

      for(let combo of WIN_COMBINATIONS) {
          if(board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[2]] === board[combo[1]]){
              setMessage(`Player ${board[combo[0]]} Won!`)
              return true
          }
      }
      return false
  }

  function catsGame(){
      var board = currentBoard()
      return board.every((box) => {
          return box !== ""
      })

  }

  function saveGame(){
      let game = {"state": currentBoard()}

      if (gameId) {
        $.ajax({
            url: `/games/${gameId}`,
            method: "PATCH",
            data: game
        })
      } else {
        $.post("/games", game, function(resp) {
            //debugger;
            gameID = parseInt(resp.data.id)
        })
      }
  }

  