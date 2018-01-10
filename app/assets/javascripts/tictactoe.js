// // Code your JavaScript / jQuery solution here
var origBoard = ['','','','','','','','','']
const playerone = 'O'
const playertwo = 'X' 
var turn = 1
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
           setMessage('')
           if (square.innerText === ''){
           doTurn(square)
           }
           else {
             setMessage("not a valid move")
           }
         })
             
   })
        

    
  } 
  function startGame(){
    setMessage('')
    for(var i = 0; i< cell.length; i++){
      cell[i].innerText = ''
      cell[i].id = i
      turn = 1
      
    }
  }
    
  
      function doTurn(square){
        
        updateState(square)
        //  if (checkWinner() === true){
        //  debugger 
         
        //   }
         

        setMessage("Tie game.")
        turn++
      }
      function player (){
        // debugger
        if(turn % 2 == 0 )
        {
          return 'X';
        }
        else 
        {
          return 'O'
        }
        
      }

      function updateState(square){
        // debugger
       square.innerText = player()
        var number = square.id
        // debugger
        origBoard[number] = square.innerText
        
      }

      function setMessage(message){
        $('#message').append(message)
      }

      function checkWinner(){
            debugger
            var player = player()
            debugger
          let plays = origBoard.reduce((a, e, i) =>
            (e === player)  ? a.concat(i) : a,  [])
          let gameWon = null;
          for (let [index, win] of winCombos.entries()){
            if(win.every(elm => plays.indexOf(elm) > -1 )){
              debugger
            // gameWon = {index: index, player: player};
            break;
          }
        
        }
        return gameWon
     }
  $(function(){
    $('#save').on('click', function(e){
      e.preventDefault()
      var board = []
      $('td').each(function(){
        board.push(this.innerText)
        
      })      
        $.post({
          url: "/games",
          data: {
               state: board
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
            
            let renderGames = `${games.map(function(game){
              return `<li><input type="button" value="Game ${game.id}"></li>`
              
            }).join('')
          }`
            debugger
            document.getElementById('games').innerHTML = renderGames
            // gamesDiv.append(renderGames)
            
          
        })
      })
    })
    
    $(function(){
    $('#clear').on('click', function (e){
      e.preventDefault()
      
      $('td').each(function(){
        this.innerHTML = ''
        turn = 1
        startGame()
      })
     })
    })
  })
