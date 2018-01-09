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
    setMessage("")
    for(var i = 0; i< cell.length; i++){
      cell[i].innerText = ''
      // cell[i].id = i
      
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
      }

      function setMessage(message){
        $('#message').append(message)
      }

      function checkWinner(origBoard){
      
     }
  $(function(){
    $('#save').on('click', function(e){
      e.preventDefault()
      $('td').each(function(){
        origBoard.push(this.innerText)
        
      })      
        $.post({
          url: "/games",
          data: {
               state: origBoard
          }
        }).done(function(json){
          
      })
    })
    $(function(){
      $('#previous').on('click', function(e){
        e.preventDefault()
        $.ajax({
          dataType: 'json',
          url: 'http://localhost:3000/games',
        }).done(function(json){
          var games = json.data
            
            var gamesDiv = document.getElementById('games')
            debugger
            let renderGames = games.forEach(function(game){
              '<li>' + game.id + '</li>'
            })
            debugger
            gamesDiv.append(renderGames)
            
          
        })
      })
    })
    
    $(function(){
    $('#clear').on('click', function (e){
      e.preventDefault()
      
      $('td').each(function(){
        this.innerHTML = ""
        turn = 0
        startGame()
      })
     })
    })
  })
