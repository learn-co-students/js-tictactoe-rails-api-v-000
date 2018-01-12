// Code your JavaScript / jQuery solution here

  var turn = 0;

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
    turn = 0
    $("td").text("")
  }

  function player(){
    return turn % 2 == 0 ? 'X' : 'O';
  }

  function updateState(space){
    $(space).text(player())
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
    updateState(space);
    turn += 1;
    if(checkWinner()) {
      resetGame();
    } else if(turn === 9){
      setMessage("Tie game.");
      resetGame();
    }
  }

  function attachListeners(){
    
  }
