
var turn = 0
var currentGame = {}

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
        clearBoard()                
      }
      else if (getCell(wC[i][0][0], wC[i][0][1]) === "O" && getCell(wC[i][1][0], wC[i][1][1]) === "O" && getCell(wC[i][2][0], wC[i][2][1]) === "O") {
       msg = "Player O Won!"
       turn = 0
       message(msg)
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









