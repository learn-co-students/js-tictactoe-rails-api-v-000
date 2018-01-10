// Code your JavaScript / jQuery solution her


var WIN_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];


var turn = 0;
var gameId = 0;
  
  $(document).ready(function() {
      attachListeners();
  });

  function attachListeners(){
    $("td").click(function(){
        if (this.innerHTML === "" && checkWinner() === false ) {
            doTurn(this)
        }
    })

    $('#save').on('click', function() {
        saveGame();
    })

    

    $('#clear').on('click',function(){
        resetGame();
    })

    $("#previous").click(function() {
        $.getJSON('/games', function(response) {
            $("#games").empty()
            response.data.forEach(function(game) {
                $("#games").append(`<button data-id="${game.id}" onclick = "loadGame(${game.id})">${game.id}</button>`)
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
    $('td').empty();
    turn = 0
    gameId = 0
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

  function saveGame() {
    var board = currentBoard()
    
    if (gameId) {
      $.ajax({
        type: 'PATCH',
        url: `/games/${gameId}`,
        data: { state: board }
      });
    } else {
      $.post('/games', { state: board }, function(game) {
        gameId = game.data.id;
      });
    }
  }
  


  

  function loadGame(id) {
    gameId = id
    var total = 0
    $.getJSON(`/games/${gameId}`, function(response) {
        response.data.attributes.state.forEach(function(element) {
            if (element !== "") {
                total += 1

            }
            return total
        })
        turn = total
        //debugger;

        $("td").toArray().forEach((token, index) => { token.innerHTML = response.data.attributes.state[index]})
    })
  }

  