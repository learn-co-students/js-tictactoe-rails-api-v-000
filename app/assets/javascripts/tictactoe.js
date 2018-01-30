// // Code your JavaScript / jQuery solution here
var origBoard = ['','','','','','','','','']
const playerone = 'O'
const playertwo = 'X' 
var turn = 0
var square
var gameId = 0

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

// var game = new Game

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
           if (square.innerText === '' && !checkWinner()){
           doTurn(square)
           }
           else {
             setMessage("not a valid move")
           }
         })
                   
   })
      $('#save').on('click', saveGame)
      $('#clear').on('click', clearGame)
      $('#previous').on('click', previousGame)  
      $('#games').on('click', getGame)  
  } 
  function startGame(){
    setMessage('')
    for(var i = 0; i< cell.length; i++){
      cell[i].innerText = ''
      cell[i].id = i
    }      
    turn = 0
    gameId = 0
  }
    
  
      function doTurn(square){
        updateState(square)
         turn++
       
         if (checkWinner() === true){
            saveGame()
            startGame()
          }
          else if (turn === 9){
            setMessage("Tie game.")
            saveGame()
          }
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
        let number = square.id
        origBoard[number] = square.innerText
        
      }

      function setGame(data){
        
        let squares = data.attributes.state
        for(i =0; i < squares.length; i++){
          cell[i].append(squares[i])
        }         
        gameId = data.id
      }

      function setMessage(message){
        $('#message').append(message)
      }
      function checkWinner(){
        let won = false
          winCombos.forEach(win =>{
            
            winIndex1 = win[0]
            winIndex2 = win[1]
            winIndex3 = win[2]
          position1 = cell[winIndex1].innerText
          position2 = cell[winIndex2].innerText
          position3 = cell[winIndex3].innerText
          
          
          if ((position1 === "X" && position2 === "X" && position3 === "X") ||
          (position1 === "O" && position2 === "O" && position3 === "O")){
            
            setMessage(`Player ${position1} Won!`)
            return won = true;
          }
          
        })
        return won
     }

  function saveGame(){
      let board = []
      $('td').each(function(){
        board.push(this.innerText)
        
      })
      
      if (gameId === 0){
        $.post({
          url: "/games",
          data: {
               state: board
          }, function(json){
          gameId = json.data.id
          }
        })
    } else if (gameId !== 0) {
      $.ajax({
        type: 'PATCH',
        url: `/games/${gameId}`,
        data: {state: board}
      })
    }
    }
  function previousGame(){
    if ($('#games').children().length === 0){
        $.ajax({
          dataType: 'json',
          url: '/games',
        }).done((json) => {
          if (json.data.length > 0){
          let games = json.data
            
            var gamesDiv = document.getElementById('games')
            
            let renderGames = `${games.map((game)=> {
              return `<button id="${game.id}">Game ${game.id} </button>`
              
            }).join('')
          }`
          $('#games').append(renderGames)
            // document.getElementById('games').innerHTML = renderGames
          }
          else {
            setMessage(`no Previous Games `)
          }
        })
      }
    }
    
  function clearGame(){
        startGame()
      }
//get game
        function getGame(e){
          
          var id = e.target.id
          $.ajax({
            url:'/games/' + id,
            dataType: 'json'
        }).done((json) => {
          
          let data = json.data
          startGame()
               setGame(data)

           })
        }
      
     
