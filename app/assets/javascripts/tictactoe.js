// import { uptime } from "os";

var turn = 0

function player(){

    if (turn % 2 === 0 ){
        return "X"
    } else {
        return "O"
    }    
}

function updateState(){
  
    const squareChosen = document.querySelector("td").attr("data-x", "data-y");

    squareChosen.addEventListener('click', function(){
        
        player();
        turn++;
    })
}

