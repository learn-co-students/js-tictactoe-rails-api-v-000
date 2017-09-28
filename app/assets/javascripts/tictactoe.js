// Code your JavaScript / jQuery solution here

var winCombination = [
 [0,1,2],
 [3,4,5],
 [6,7,8],
 [0,3,6],
 [1,4,7],
 [2,5,8],
 [0,4,8],
 [2,4,6]
]

var turn = 0
var current_game_id = 0

function player() {
  if (turn % 2 === 0) {
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(td) {
  $(td).text(player())
}

function setMessage(string) {
  $("div#message").html(string)
}

function checkWinner() {
  var board = window.document.querySelectorAll('td')
  for (var i = 0; i < winCombination.length; i++) {
    var combo = winCombination[i] // [0,1,2]
    var boardCombo1 = board[combo[0]].innerHTML
    var boardCombo2 = board[combo[1]].innerHTML
    var boardCombo3 = board[combo[2]].innerHTML
      if ((boardCombo1 === "X" && boardCombo2 === "X" && boardCombo3 === "X") ||
        (boardCombo1 === "O" && boardCombo2 === "O" && boardCombo3 === "O")) {
        setMessage(`Player ${boardCombo1} Won!`)
        return true
      }
    }
      return false
}

function doTurn(td) {
  updateState(td)
  turn ++
  if (checkWinner()) {
    saveGame()
    resetBoard()
  }
  else if (turn === 9) {
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  }
}

function resetBoard() {
  $('td').empty()
  turn = 0
  current_game_id = 0
}

$(document).ready(function() {
  attachListeners()
})

function attachListeners() {
  $('td').on('click', function() {
   if (($(this).html() === "") && (!checkWinner())) {
     doTurn(this)
   }
  })
   $("#save").on("click", function() { saveGame() })
   $("#previous").on("click", function() { previousGames() })
   $("#clear").on("click", function() { resetBoard() })
 }

 function saveGame() {
   var board = []
   var json_game_info = {}

   $("td").text((index, square) => {board.push(square)})
   json_game_info = { state: board }
    if(current_game_id) {
     $.ajax({
       type: 'PATCH',
       url: `/games/${current_game_id}`,
       data: json_game_info
     })
     .done(function(data) {
       id = data["data"]["id"]
       $("#games").html(`Game id# ${id}`)
     })
    }
    else {
     $.post("/games", json_game_info, function(response) {
       new_game_id = response["data"]["id"]
       current_game_id = new_game_id
       $("#games").html(`Game id #${new_game_id}`)
        $("#gameid-" + response.data.id).on('click', () => loadGame());
     })

   }
 }

 function previousGames() {
    $("div#games").empty()
    $.get("/games", function(response) {
     response["data"].forEach(function(eachData){
      $("div#games").prepend(`<button id='${eachData["id"]}'>Game # ${eachData["id"]}</button><br>`)
      $(`#${eachData["id"]}`).on('click', loadGame)
     })
    })
 }

 function loadGame() {
    $("div#games").empty()
   $.get(`/games/${this.id}`, function(response){
     current_game_id = parseInt(response["data"]["id"])
      state = response["data"]["attributes"]["state"]
      for(let i=0; i < state.length; i++){

        if (i < 3) {
        $('[data-x="' + i + '"][data-y="' + 0 + '"]')[0].innerHTML = state[i]
        }
        else if(i > 2 && i < 6 ) {
          var j = i-3
          $('[data-x="' + j + '"][data-y="' + 1 + '"]')[0].innerHTML = state[i]
        }
        else {
          var k = i-6
          $('[data-x="' + k + '"][data-y="' + 2 + '"]')[0].innerHTML = state[i]
        }

         turn = state.join('').length;

      }


    // this is how the board looks when it's going through the loop
    // | x=0,y=0,i=0 | x=1,y=0,i=1 | x=2,y=0,i=2
    // ------------------------------------------
    // | x=0,y=1,i=3 | x=1,y=1,i=4 | x=2,y=1,i=5
    // ------------------------------------------
    // | x=0,y=2,i=6 | x=1,y=2,i=7 | x=2,y=2,i=8
   })

 }
