// Code your JavaScript / jQuery solution here

var turn = 0;

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

    

