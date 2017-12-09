// // Code your JavaScript / jQuery solution here
// var origBoard = []
// const playerone = 'O'
// const playertwo = 'X'
const winCombos = [
  [0,1,2]
  [3,4,5]
  [6,7,8]
  [0,3,6]
  [1,4,7]
  [2,5,8]
  [0,4,8]
  [2,4,6]
]
var board = []

// // const turn = []

 var turn = 0
 function getBoard(){
  board = 
}

function doTurn(){
  //  var turn = 0
  // updateState()
  // checkWinner()
  // turn++
}

//needs to ruturn x when turn count is even
function player (){
  
  if(turn % 2 == 0)
  {
    return 'X';
  }
  else
  {
    return 'O';
  }
}

function updateState(space){
  $(space).html(player())
}

function setMessage(message){
  $('#message').append(message)
}//done

function checkWinner(){

}

$(document).ready(function() {
  function attachListeners(){
   
     $('tbody').on('click', function(){

       alert('clicked')       
     //   // var clicked = $(this).attr({num1: 'data-x',num2: 'data-y'}) 

     //   // doTurn(clicked) //attached clicked on element to doTurn
     })
   
   
     // save button
    //  $('#save').on('click', function (){
    //    alert('clicked')
    //  })
    //  // show previous game
    //  $('#previous').on('click', function (){
    //    alert('clicked')
    //     })
    //  //clear current
    //  $('#clear').on('click', function (){
    //    alert('clicked')
    //   })
     }
  
})

  



// $(function(){
  
//   $('td').on('click', function(){
//     var window = $(this).attr({num1: 'data-x',num2: 'data-y'})
//     // $('#'+window).append('clicked here')
//      debugger
//     alert("you clicked (this.")
//   })
// })

// // startGame()
// // const cells = document.querySelectorAll('table')
// // startGame()

// // function startGame(){
// //   cells.addEventListener('click', turnClick, false)
// // }


// // function turnClick(click){
// //   console.log(click.target.id)
// // 