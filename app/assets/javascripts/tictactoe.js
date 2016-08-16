
var turn = 0
var currentGame = 0

var wC = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]], [[0,0],[1,1],[2,2]], [[2,0],[1,1],[0,2]]]

$(document).ready(function() {

  attachListeners();



})


function attachListeners() {
  $('td').click(function(){
    
    var positionX = $(this).attr('data-x')
    var positionY = $(this).attr('data-y')
 
    doTurn(positionX, positionY)
  })

  $('#save').on('click', function(event){
    clickSave(event);
  })
  $('#previous').on('click', function(event){
    previousGames(event);
  })

}


function doTurn(x,y) {

  var xx = '[data-x='+x+']'
  var yy = '[data-y='+y+']'

  updateState(xx,yy)
  turn += 1
  checkWinner()
}

function player() {
  if (turn%2 > 0) {
    return "O"
  }
  else {
    return "X"
  }

}

function getCell(x,y) {
  var xx = '[data-x='+x+']'
  var yy = '[data-y='+y+']'
  return $(xx+yy).text()
}

function getBoard() {
  var table = $('table tr')
  var state = []
  for (i = 0; i < table.length; i ++) {
    for (c = 0; c < 3; c ++) {
      state.push(getCell(c,i))
    }
  }
  return state
}

function fillBoard(array) {
  var count = 0
  for (i = 0; i < 3; i ++) {
    for (c = 0; c < 3; c ++) {
     
      $('[data-x='+c+'][data-y='+i+']').html(array[count])
      count += 1
    

}
}
}

function clearBoard() {
 
  for (i = 0; i < wC.length; i ++) {  
    for (c = 0; c < wC[i].length; c ++) {
     
      $('[data-x='+wC[i][c][0]+']'+'[data-y=' + wC[i][c][1]+ ']').text("")
    }
}
return []
}

function updateState(x,y) {

  if ($(x+y).text() === ""){
      $(x+y).html(player())  
  } 

}

function message(message) {
  $('#message').text(message)
}




function checkWinner() {
  var msg = false
  for (i = 0; i < wC.length; i ++) {   
      if (getCell(wC[i][0][0], wC[i][0][1]) === "X" && getCell(wC[i][1][0], wC[i][1][1]) === "X" && getCell(wC[i][2][0], wC[i][2][1]) === "X") {
        msg = "Player X Won!"
        turn = 0
        message(msg)
        saveGame()
        clearBoard()                
      }
      else if (getCell(wC[i][0][0], wC[i][0][1]) === "O" && getCell(wC[i][1][0], wC[i][1][1]) === "O" && getCell(wC[i][2][0], wC[i][2][1]) === "O") {
       msg = "Player O Won!"
       turn = 0
       message(msg)
       saveGame()
       clearBoard()
      
      }       
  }
  if (msg === false && turn === 9) {
    message("Tie game")
   
    clearBoard()
    turn = 0
  }
  return msg
}

///// Controller scripts

function saveGame() {


  var board = {}

  board["state"] = getBoard()
  
  var posting = $.post('/games', board)

  posting.done(function(data) {

   var game = data["game"]
  currentGame = 0

 })

}

function clickSave(event) {

  
    event.preventDefault();
  if (currentGame === 0) {
  var board = {}
  board["state"] = getBoard()
  
  var posting = $.post('/games', board)

  posting.done(function(data) {

   var game = data["game"]
 
   fillBoard(game.state)
  
    currentGame = game.id  
  })
  
   
  } 
  else {
    var board = {}
    board["state"] = getBoard()
    var patching = $.ajax('/games/'+ currentGame, {method: 'PATCH', data: board})
    patching.done(function(data){
      message('Updated')
    })
  }   
  
}

function previousGames(event) {

  

    event.preventDefault();
    var check = $('#games').html()
    if (check === "") {
    
    $.get('/games', function(data){
      
      var games = data["games"]
      for (i = 0; i < games.length; i ++) {
        $('#games').append('<li data-gameid="'+games[i]["id"]+'">'+ games[i]["id"]+ '</li>')
      }
    })
  }
    else {
      
      $.get('/games', function(data) {
        var games = data["games"]
        
        var li = $('#games').children().length
        if (games.length > li) {
          
          var ids = games.length
          var diff = ids - li
          
          for (c = 0; c < diff; c ++) {
            var missing = li + c + 1
        
            
             
              $('#games').append('<li data-gameid="'+ missing + '">'+missing +  '</li>')
            
          }

        }
      })
    }
    $('#games').on('click', '[data-gameid]', function(event) {
      switchGame(event);
    })

  
}


function switchGame(event) {

    event.preventDefault();
  
    var id = event.target.innerHTML
    
    if (this.jasmine) {
      fillBoard(["","X","O","","O","","","",""])
    }
    else {
    $.get('/games', function(data){

      var games = data["games"]
      
      for ( i = 0; i < games.length; i ++) {
        
        if (games[i]["id"] === parseInt(id)) {
          
          var game = games[i]
       
        fillBoard(game.state)
        turn = $('td').text().length
        currentGame = game.id
        break
      }
  }
    })
  }
  
}









