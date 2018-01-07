// // Code your JavaScript / jQuery solution here
var origBoard = ["", "", "", "","", "", "", "",""]
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
// var cell = document.getElementsByTagName('td')

// function Game(squares){
//   this.squares = ["", "", "", "","", "", "", "",""]
// }
function Game (state){
  this.state = state
}

var game = new Game

const cell = document.getElementsByTagName('td')

$(function(){
attachListeners()
startGame()
})

  // function newGame(){
  //   console.log('test')
    
  // }
  function attachListeners(){
    var arr = [].slice.call(cell) 
    
       arr.forEach(function(squares){
         
         squares.addEventListener('click', function(){
           square = this
           setMessage("")
           if (square.innerText === ""){
           doTurn(square)
           }
           else {
             setMessage("not a valid move")
           }
         })
             
   })
        

    
  } 
  function startGame(){
    origBoard = Array.from(Array(9).keys())
    setMessage("")
    for(var i = 0; i< cell.length; i++){
      cell[i].innerText = ''
      cell[i].id = i
    }
  }
    
  
      function doTurn(square){
        
        updateState(square)
        checkWinner() 

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
       square.innerText = player()
        var number = square.id
        origBoard[number] = square
      //  game.push(square)
      }

      function setMessage(message){
        $('#message').append(message)
      }//done

      function checkWinner(origBoard){
        // for(var i = 0; i < winCombos.length; i++)
        
        // if (origBoard === winCombos[i])
        // {return true}
        // else 
        // {return false}
     }
  $(function(){
    $('#save').on('click', function(e){
      e.preventDefault()
      
        $.ajax({url: "http://localhost:3000/games",
          data: {data: JSON.stringify(origBoard)}, 
          method: "POST",
          dataType: "json",
        }).done(function(json){
          debugger
      })
    })
    $(function(){
      $('#previous').on('click', function(e){
        e.preventDefault()
        $.ajax({
          dataType: 'json',
          url: 'http://localhost:3000/games',
        }).done(function(json){
          
          json.data.forEach(function(game){
            
            var gameLi = game.renderLi()
          })
        })
      })
    })
  })
      
    




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