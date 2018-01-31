// // Code your JavaScript / jQuery solution here
var origBoard = ['','','','','','','','','']

var turn = 0
var square
var gameId

var winCombos = [
  [0,1,2],
  [3,4,5],  
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]
var cell = document.getElementsByTagName('td')


$(function(){
attachListeners()
startGame()
})

  function attachListeners(){
    var arr = [].slice.call(cell) 
    
       arr.forEach(function(squares){
         
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
         if (checkWinner()){
            saveGame()
            startGame()
          }
          else if (turn === 9){
            setMessage("Tie game.")
            saveGame()
            startGame()
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
        var number = square.id
        origBoard[number] = square.innerHTML
        
      }

      function setGame(data){
        
        var squares = data.attributes.state
        
  
          for(i =0; i < squares.length; i++){
            // debugger
            cell[i].innerHTML = squares[i]
        }         
        gameId = data.id
      }

      function setMessage(message){
        $('#message').append(message)
      }
      function checkWinner(){
        var won = false
          winCombos.forEach(function(win){
            
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
    
      var board = []
      $('td').each(function(){
        board.push(this.innerText)
        
      })
      // debugger
      if (gameId){
        $.ajax({
        type: 'PATCH',
        dataType: JSON,
        url: `/games/${gameId}`,
        data: {state: board}
      })
    

    } else  {
      $.post({
        url: "/games",
        data: {
             state: board
        }
      }).done(function(json){
          // debugger
        gameId = json.data.id
        
        })
      }
  }
  function previousGame(){
    
    if ($('#games').children().length === 0){
        $.ajax({
          dataType: 'json',
          url: '/games',
        }).done(function(json){
          if (json.data.length > 0){
          var games = json.data
            var gamesDiv = document.getElementById('games')
            var renderGames = `${games.map(function(game){
              return `<button id="${game.id}">Game ${game.id} </button>`
              
            }).join('')
          }`
          $('#games').append(renderGames)
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
        }).done(function(json){
          
          var data = json.data
          startGame()
               setGame(data)

           })
          }
