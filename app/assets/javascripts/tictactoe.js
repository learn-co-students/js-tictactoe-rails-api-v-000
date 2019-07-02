var turn = 0;
var WinCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]]
var currentGame = 0

  function resetBoard(){
    $('td').empty()
    turn = 0
  }

  function player(){
      if (turn % 2 ){
        return 'O'  
      }else {
        return 'X'
      }   
    }
    
    function updateState(square){
        var token = player()
        square.innerHTML = token
    }

    function setMessage(message){
        var el = document.querySelector("#message")
        el.innerHTML = message
    }

    function checkWinner(){
      var tds = document.querySelectorAll("td")
      var winner = false
      var board = []
        tds.forEach(function(td){
          board.push(td.innerHTML)
        })
          WinCombos.forEach(function(winCombo){
          if (board[winCombo[0]] !== "" && board[winCombo[0]] === board[winCombo[1]] && board[winCombo[1]] === board[winCombo[2]]){
              setMessage(`Player ${board[winCombo[0]]} Won!`)
              return winner = true
            }})          
       return winner
    }

    function doTurn(square){
      updateState(square);
      turn++;
      if (checkWinner()){
           // save the game at this point
        resetBoard()
      } else if (turn === 9){
        setMessage('Tie game.')
        resetBoard()
      }  
    }

    function attachListeners(){

    }

    

