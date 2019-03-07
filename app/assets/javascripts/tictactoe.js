// Code your JavaScript / jQuery solution here
var turn =  0
$(document).ready(function(){
    attachListeners()
})

 function attachListeners(){
    $("td").click(function() {
    doTurn(this)
    });
 }


function doTurn(square){
 console.log(square)
//   call update states
// increasw the turn count by +1
// if else statment( checking if the one ot not).. No ternnary
//  Tyler work 11am -3pm.. EST 
}

function player(){
   return turn % 2 === 0 ? "X" :"O" 
//    modulo operator (%)
}

function updateState(square){
       var token = player()

 $(square ).click(function() {
    $( "span", this ).addClass( "bar" );
  });
}