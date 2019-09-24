var turn = 0
var id = false

function player() {
  if(turn == 0){
    return "X"
  }else if(turn % 2 == 0) {
    return "X"
  }else{
    return "O"
  }
}

function validMove(location) {
  if(location.innerHTML === ""){
    return true
  }else{
    return false
  }
}

function updateState(location) {
    location.innerHTML += player()
}

function setMessage(string) {
  $("#message").text(string)
}

function getBoard() {
  var board = []
  var squares = $("td")
  for(var i = 0; i < squares.length; i++) {
    board.push(squares[i].innerHTML)
  }
  return board
}

function checkWinner() {
  var winCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
  var board = getBoard()
    for(var i = 0; i < winCombos.length; i++) {
      var winCombo = winCombos[i]
      if(board[winCombo[0]] == "X" && board[winCombo[1]] == "X" && board[winCombo[2]] == "X") {
        setMessage("Player X Won!")
        return true
      }else if (board[winCombo[0]] == "O" && board[winCombo[1]] == "O" && board[winCombo[2]] == "O"){
        setMessage("Player O Won!")
        return true
      }
    }return false
}

function full() {
  var board = getBoard()
  var found = board.find(el => el === "")
  if(found == "") {
      return false
    }else{
      return true
    }
}

function updateOrCreateGame() {
  var values = {}
  values["state"] = getBoard()
  if(id) {
    updateGame(values, id)
  }else{
    newGame(values)
  }
}

function doTurn(square) {
  if(validMove(square)) {
    updateState(square)
    if(checkWinner()) {
      updateOrCreateGame()
      turn = 0
      $("td").empty()
     }else if(full()){
       setMessage("Tie game.")
       updateOrCreateGame()
       turn = 0
       $("td").empty()
     }else{
       turn++
     }
  }
}

function updateGame(values, id) {
  $.ajax({
    type: "PATCH",
    url: "/games/" + id,
    data: values,
    dataType: "json"
  })
}

function newGame(values) {
  $.post("/games", values, function(data) {
    id = data.data.id
  })
}

function resetGame() {
  $("td").empty()
  $("#message").empty()
  turn = 0
}

function attachListeners() {
  $("td").on('click', function(){
    checkWinner() || full() ? null : doTurn(this)
  })

  $("#clear").on('click', function(event) {
    if(id){
      resetGame()
      id = false
      var values = {}
      values["state"] = getBoard()
      newGame(values)
    }else{
      resetGame()
    }
   })

   $("#save").on('click', function() {
     var values = {}
     values["state"] = getBoard()
     if(id){
      updateGame(values, id)
    }else {
       newGame(values)
     }
})

   $("#previous").on('click', function(){
     $.get("/games", function(data){
       var games = data.data
       var gameList = ""
       games.forEach(game => {
         gameList += "<button data-game='"+game.id+"'>"+game.id+"</button>"
       })
       $("#games").html(gameList)
      attachButtonListeners()
     })
   })
}

function attachButtonListeners() {
  $("button[data-game]").on('click', function() {
    id = this.dataset.game
    $.get("/games/"+id, function(data){
      var board = data.data.attributes.state
      var squares = $("td")
      for(var i =0; i < squares.length; i++) {
        for(var i = 0; i < board.length; i++) {
          squares[i].innerHTML = board[i]
        }
      }
      setTurn(board)
    })
  })
}

function setTurn(board) {
  if(board) {
    turn = board.filter(el => ((el == "X") || (el == "O"))).length
  }else {
    turn = 0
  }
}

$(function(){
  attachListeners()
})