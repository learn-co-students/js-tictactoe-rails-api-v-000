// Code your JavaScript / jQuery solution here
const WINNING_COBMOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
 let turn = 0

function player(){
  console.log("turn:",turn)
   if(turn % 2 == 0){
     return "X";
   }else{
     
     return "O";
   }
 }

 function updateState(e){
   $(e).html(player())
 }

function attachListeners(){

}

function checkWinner(){

}



function doTurn(){
  turn+=1

}



function setMessage(note){
  $('#message').html(note)
}

$( document ).ready(function() {
    console.log("doc is ready")

    $('tr td').on("click",function(){
      let empty_box = (this.innerHTML == "")
      if(empty_box){
        $(this).html(player())
        doTurn()
        setMessage(``)
      }else{
        setMessage(`This box is taken!`)
      }
    })

   $('#save').on('click', function(){

   })

   $('#previous').on('click', function(){
   })

   $('#clear').on('click', function(){
   })


 })
