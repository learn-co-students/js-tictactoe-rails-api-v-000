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

  function attachListeners(){
    var arr = [].slice.call(cell) 
    
       arr.forEach((squares)=>{
         
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
         if (checkWinner() === true){
         setMessage("Winner")
          }
         

        // setMessage("Tie game.")
        turn++
      }
      function player (){
        // d
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
        
       square.innerText = player()
        let number = square.id
        
        origBoard[number] = square.innerText
        
      }

      function previousGame(squares){
        for(i =0; i < squares.length; i++){
          cell[i].innerText = squares[i]
        }         
      }

      function setMessage(message){
        $('#message').append(message)
      }

      function checkWinner(){
          winCombos.forEach(win =>{
            winIndex1 = win[0]
            winIndex2 = win[1]
            winIndex3 = win[2]

          position1 = cell[winIndex1].innerText
          position2 = cell[winIndex2].innerText
          position3 = cell[winIndex3].innerText
          })
          if (position1 === "X" && position2 === "X" && position3 === "X"){
            return true
          }
          else if (position1 === "O" && position2 === "O" && position3 === "O"){
            return true
          }
          
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
          url: '/games',
        }).done((json) => {
          if (json.data.length > 0){
          let games = json.data
            
            var gamesDiv = document.getElementById('games')
            
            let renderGames = `${games.map((game)=> {
              return `<li><input type="button" id="${game.id}" value="Game ${game.id}"></li>`
              
            }).join('')
          }`
            document.getElementById('games').innerHTML = renderGames
          }
          else {
            setMessage(`no Previous Games `)
          }
        })
        
        
      })
    })
    $(function(){
      $('#button').on('click', function(e){
        
        let gameId = e.target.id
        
        $.ajax({
          url:'games/' + gameId,
          dataType: 'json'
      }).done(json => {
        
        let gameData = json.data.attributes.state
                
            previousGame(gameData)
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
