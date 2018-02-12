//Code your JavaScript / jQuery solution here

  
$(document).ready(function(){
  attachListeners()
  $("#save").on("click", function(event) {
    event.preventDefault();
    alert("clicked")
  });
  
})

$(document).ready(function(){

  $("#previous").on("click", function(event) {
    event.preventDefault();
  
    $.ajax({
      
      mathod: "GET",
      
      url: '/games'
    }).done(function(json){
      console.log(json)
      debugger
    });
  
  });
  
})

var turn = 0;

var board = ["", "", "", "", "", "", "", "", "" ]

function player () {
  return turn % 2 === 0 ? "X" : "O"
}
  
function updateState(element) {

  var currentPlayerTocken = player()
  element.innerHTML = currentPlayerTocken;
} 

function setMessage(string) {
  $("div#message").append(string)
}

function full(array) {
  if($.inArray("", array) === -1) {
    return true
  }else{return false}
}

function getBoard () {
  var currentBoard = [].slice.call($('td')).map(x => x.innerHTML);
  return currentBoard
}

function checkWinner() {
  
  const winCombinations = [
    [0, 1, 2], //top row win
    [3, 4, 5], //Middle row win
    [6, 7, 8], //Bottom row win
    [0, 3, 6], //left column win
    [1, 4, 7], //middle column win
    [2, 5, 8], //right column win
    [0, 4, 8], //left diagonal win
    [2, 4, 6]  //right diagonal win
  ]
  
  var arrayLength = winCombinations.length;
  var result = false
  var board = getBoard()
  for (var i = 0; i < arrayLength; i++) {
    //check if board contain any winCombinations
    
    if ((board[winCombinations[i][0]] === "X" && board[winCombinations[i][1]] === "X" && board[winCombinations[i][2]] === "X") || (board[winCombinations[i][0]] === "O" && board[winCombinations[i][1]] === "O" && board[winCombinations[i][2]] === "O"))  {
      // board = $.Array
      var winningTocken = board[winCombinations[i][0]]
      setMessage(`Player ${winningTocken} Won!`)
      result = true
    
    } 
}
  return result 
}

function doTurn (element) {
 
  updateState(element)
  if(full(getBoard())) {
    setMessage("Tie game.")
  }
  if (checkWinner() || full(getBoard())) {
  
    turn = 0
  
    return [].slice.call($('td')).map(x => x.innerHTML = "");
      debugger
  }
   turn += 1

}

function attachListeners() {
  $( document ).ready(function() {
   squares = $("td")
    
    for (var i = 0; i < squares.length; i++) {
      
      $(squares[i]).on("click", function(event) {
        console.log(getBoard())
        console.log(turn)
        event.preventDefault();
        
        if ( !checkWinner() && !full(getBoard()) && this.innerHTML === "") {
          var index = 0
          
          if(this.dataset["y"] === "1") {
            index = parseInt(this.dataset["x"]) + 3
          } else if(this.dataset["y"] === "2") {
            index = parseInt(this.dataset["x"]) + 6
          } else {
            index = parseInt(this.dataset["x"])
          }
    
          doTurn(this)  

        }
        
      })//onClick
    }//forloop
  });
}

