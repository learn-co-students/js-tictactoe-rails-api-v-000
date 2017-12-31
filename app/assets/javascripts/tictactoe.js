// // Code your JavaScript / jQuery solution here
var origBoard = []
const playerone = 'O'
const playertwo = 'X'
const winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]
var turn = 0
$(function(){
  var cell = document.getElementsByTagName('td')
startGame()

// // const turn = []

//  var turn = 0
//  function getBoard(){
//   board = []
// }
function startGame(){
  
  for(var i = 0; i < cell.length; i++)
   {
  cell[i].addEventListener('click',doTurn, false)
  }
}
// function turnClick(square){
//   console.log(square.target)
// }
})


function doTurn(square){
  turn++
  updateState(square)
  if (checkWinner() === true){
    board = []
  }
  setMessage("Tie game.")
  
}


//needs to ruturn x when turn count is even
function player (){
  // debugger
  if(turn % 2 == 0)
  {
    return 'X';
  }
  else
  {
    return 'O';
  }
  
}

function updateState(square){
  // console.log(square)
  var token = player()
  // debugger
  square.target.innerText = token
}

function setMessage(message){
  $('#message').append(message)
}//done

function checkWinner(){

}


  
  


function attachListeners(){
  var click = document.getElementsByTagName('td')
  // debugger
  }
  
  
  


$(document).ready(function attachlisteners(){
  // function attachListeners(){
  $('td').eq(function(){
    debugger
    // var window = $(this).attr({num1: 'data-x',num2: 'data-y'})
    // $('#'+window).append('clicked here')
     console.log(this)
    // alert("you clicked (this.")
      })
  // save button
       $('#save').on('click', function (){
        //  alert('clicked')
       })
      //  show previous game
    $('#previous').on('click', function (){
    //  alert('clicked previous')
        })
        //  clear current
    $('#clear').on('click', function (){
      //  alert('clicked')
      })

  })
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
// const route = 
// $.ajax({
//   url: 'http://local/games'

// }).done(function(){
//   $(this).append()
// })