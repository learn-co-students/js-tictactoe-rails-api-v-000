// Code your JavaScript / jQuery solution here

var turn = 0;
var WinCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]]

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
      var board = []
      var winner = false
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

    function doTurn(){

    }

    function attachListeners(){

    }

    

