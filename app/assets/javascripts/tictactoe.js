// // Code your JavaScript / jQuery solution here
var origBoard = []
const playerone = 'O'
const playertwo = 'X' 
var turn = 0
var square

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
attachListeners()

  function attachListeners(){
    var cell = document.getElementsByTagName('td')
      for(var i = 0; i < cell.length; i++)
       {
     cell[i].addEventListener('click', function(){
       square = this
        doTurn(square)
     })
    }
  }
  
  
      function doTurn(square){
        debugger
        updateState(square)
        // if (checkWinner() === true){
        //   var origBoard = Array.from(Array(9).keys())
        //   // var turn = 0
        // }
        setMessage("Tie game.")
        turn++
      }
      function player (){
        if(turn % 2 === 0 )
        {
          return 'X';
        }
        else 
        {
          return 'O'
        }
        
      }

      function updateState(square){
        // console.log(square)
        // var token = player()
        
        square.innerText = player()
      }

      function setMessage(message){
        $('#message').append(message)
      }//done

      function checkWinner(){
      
      }
  

    




      // $(document).ready(function attachlisteners(){
      //   // function attachListeners(){
//   $('td').eq(function(){
//     debugger
//     // var window = $(this).attr({num1: 'data-x',num2: 'data-y'})
//     // $('#'+window).append('clicked here')
//      console.log(this)
//     // alert("you clicked (this.")
//       })
//   // save button
//        $('#save').on('click', function (){
//         //  alert('clicked')
//        })
//       //  show previous game
//     $('#previous').on('click', function (){
//     //  alert('clicked previous')
//         })
//         //  clear current
//     $('#clear').on('click', function (){
//       //  alert('clicked')
//       })

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
// const route = 
// $.ajax({
//   url: 'http://local/games'

// }).done(function(){
//   $(this).append()