// Code your JavaScript / jQuery solution here
/*
- `player()`
  + Returns the token of the player whose turn it is, `'X'` when the `turn` variable is even and `'O'` when it is odd.
- `updateState()`
  + Invokes `player()` and adds the returned string (`'X'` or `'O'`) to the clicked square on the game board.
- `setMessage()`
  + Accepts a string and adds it to the `div#message` element in the DOM.
- `checkWinner()`
  + Returns `true` if the current board contains any winning combinations (three `X` or `O` tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns `false`.
  + If there is a winning combination on the board, `checkWinner()` should invoke `setMessage()`, passing in the appropriate string based on who won: `'Player X Won!'` or `'Player O Won!'`
- `doTurn()`
  + Increments the `turn` variable by `1`.
  + Invokes the `updateState()` function, passing it the element that was clicked.
  + Invokes `checkWinner()` to determine whether the move results in a winning play.
- `attachListeners()`
  + Attaches the appropriate event listeners to the squares of the game board as well as for the `button#save`, `button#previous`, and `button#clear` elements.
  + When a user clicks on a square on the game board, the event listener should invoke `doTurn()` and pass it the element that was clicked.
*/

$(attachListeners)

let game_id

function attachListeners(){
  $("td").on("click", function(event){
    if(!checkWinner())
      doTurn(event.target)
  })

  $("button#previous").on("click", function(event){
    previousGames()
  })

  $("button#save").on("click", function(event){
    saveGame()
  })

  $("button#clear").on("click", function(event){
    resetGame()
  })
}

function previousGames(){
  $("#games").empty()
  $.get("/games").done(function(data){
    if(data["data"].length !== 0){
      data["data"].forEach(function(game){
        $("#games").append("<button id='gameid-" + game.id + "'>" + game.id + "</button><br>")
        $(`#gameid-${game.id}`).on('click', function(){
          $.get("/games/" + this.innerHTML).done(function(data){
            game_id = data["data"]["id"]
            loadGame(data["data"]["attributes"]["state"])
          })
        })
      })
    }
  })
}
function saveGame(){
  if(game_id === undefined){
    $.post("/games", {state: getState()}).done(function(data){
      game_id = data["data"]["id"]
    })
  }
  else{
    $.ajax({
      url: "/games/" + game_id,
      method: "PATCH",
      datatype: 'json',
      data: {
        game: {
          state: getState()
        }
      }
    })
  }
}
function player(){
  if(window.turn === undefined)
     window.turn = 0

  if(!(window.turn % 2))
    return 'X'
  return 'O'
}

function loadGame(state){
  let squares = $("td")
  window.turn = 0
  for(let i = 0; i < 9; i++){
    squares[i].innerHTML = state[i]
    if(state[i] != "")
      window.turn++
  }
}

function updateState(squareElement){
  let token = player()
  $(squareElement).text(token)
}

function setMessage(msg){
  $("div#message").text(msg)
}

function getState(){
  let board = []
  let squares = $("td")
  for(let i = 0; i < 9; i++){
    board[i] = squares[i].innerHTML
  }
  return board
}

function getBoard(){
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ]
  let squares = $("td")
  for(let i = 0; i < 9; i++){
    board[$("td")[i].dataset["x"]][$("td")[i].dataset["y"]] = squares[i].innerHTML
  }

  return board
}

function resetGame(){
  let squares = $("td")
  for(let i = 0; i < 9; i++){
    squares[i].innerHTML = ""
  }
  game_id = undefined
  window.turn = 0
}

function checkWinner(){
  const WIN_COMBINATIONS = [
      [[0,0], [1,0], [2,0]],
      [[0,1], [1,1], [2,1]],
      [[0,2], [1,2], [2,2]],
      [[0,0], [0,1], [0,2]],
      [[1,0], [1,1], [1,2]],
      [[2,0], [2,1], [2,2]],
      [[0,0], [1,1], [2,2]],
      [[2,0], [1,1], [0,2]]
  ];

  let board = getBoard()

  let token = ""
  let won = false

  for(let j = 0; j < WIN_COMBINATIONS.length; j++){
    let combo = WIN_COMBINATIONS[j]
    token = board[combo[0][0]][combo[0][1]]
    if(token !== ""){
      if(board[combo[0][0]][combo[0][1]] === token && board[combo[1][0]][combo[1][1]] === token && board[combo[2][0]][combo[2][1]] === token){
          won = true
          break;
      }
    }
  }

  if(won)
    setMessage(`Player ${token} Won!`)

  return won
}

function doTurn(squareElement){
  /*
  - `doTurn()`
    + Increments the `turn` variable by `1`.
    + Invokes the `updateState()` function, passing it the element that was clicked.
    + Invokes `checkWinner()` to determine whether the move results in a winning play.
    */
    if(window.turn === undefined)
      window.turn = 0

    let cell = $(squareElement).html()
    if(cell === ""){
      updateState($(squareElement))
      window.turn++
      if(checkWinner()){
        saveGame()
        resetGame()
      }
      else if(window.turn === 9){
        saveGame()
        setMessage("Tie game.")
        resetGame()
      }
  }
}
