// Code your JavaScript / jQuery solution here

var turn =  0
var currentGame = 0

function player(){
   return turn % 2 === 0 ? "X" :"O" 
//    modulo operator (%)
//  X or O is called token in here
}

$(document).ready(function(){
    attachListeners()
})

 function attachListeners(){
    $("td").on("click",function() {

      if (!$.text(this) && !checkWinner()){
         // this refer to the td
         doTurn(this)
      }
    });

    $('#previous').click(function(event) {
        previousGames(event)     
     });

     $('#save').click(function(event) {
         saveGame(event)
     });

     $('#clear').click(function(event) {
          clearGame() 
     })

   };


function updateState(square){
   var token = player()
$(square).append(token);

}

function doTurn(square){
  updateState(square)
  turn++

if (valid(square)){
   // var updateState = updateState(square);
   //  updateState.save
   //  debugger
   turn = turn + 1
   
 }  

 

    if (checkWinner()){
   //  board === ""
   reset()
   }else if (turn ===  9){
     setMessage("Tie game.")
    reset()
    }

// if else statment( checking if the one or not).. No ternnary
 
}



function valid(input){
 if (input.innerHTML === ""){
   return true

 }else{
    return false
   }
}


function saveGame(){
   var state = []
 
}


function checkWinner(){

   WIN_COMBINATIONS= [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [6,4,2],

 ]
//   Creat empty Object.
   board = [] 
     document.querySelectorAll("td").forEach(function(square){
     board.push(square.textContent)
 })

//  Iterate through win combination. [.each] with each make you i specefically return a token (E.G return X is it wins or O if O wins),
var winner = false

WIN_COMBINATIONS.forEach(function(win_combination) {
   win_index_1 = win_combination[0] 
   win_index_2 = win_combination[1]
   win_index_3 = win_combination[2]

   position_1 = board[win_index_1]
   position_2 = board[win_index_2]
   position_3 = board[win_index_3]
   

   if (position_1 === position_2 && position_2 === position_3 && position_1 !== ""){
      setMessage(`Player ${ position_1 } Won!`)
      return winner = true
    }
   }
)

return winner
// Check each against what token are on the board...
// Logic of tic-tac toe of CLI> 
}

function setMessage(string){
   document.getElementById("message").innerHTML = string
}


function reset(){
   $("td").empty()
   turn = 0
}

function play(){
    if (checkWinner() === winner){
       reset
    }
}

 function previousListern(){
  $("#previous").on('click',function(){
   var id = $(this)

   $.get("/games", function(data, status){
//   take me to index
        
     });
     
})}

// coding for the buttons
 function previousGames (event){
   event.preventDefault();
   $("#games").empty() // empty out

  $.ajax({
      method: "GET",
      url: "/games"
   }).done(function(response){
     if (response.data.length){
      response.data.forEach(function(games) {

         $("#games").append(`<button id= "gameid-${games.id}">${games.id}</button>`)
      
       });
      }
   })
 }
  
 function saveGame(event){
   // event.preventDefault();
   console.log(this)
   // alert("we r hack3rz");
   $.ajax({
      method: "POST",
      url: "/games"
   }).done(function(response){
      console.log (response)
      $("#games").append(`<button id= "gameid-${response.data.id}">${response.data.id}</button>`)
   
     })

 }

   
function clearGame(){
   $("#games").empty() 
   turn = 0

}



