// Code your JavaScript / jQuery solution here
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

  var turn = 0 
  var currentGame = 0

  function player(){
    // returns X when turn count is even, O when it is odd
    if(turn % 2 === 0){
      return "X"
    } else return "O"
  }
  
  function updateState(element) {
    // invokes player() function, adds current players token to passed in td element
    if ($(element).html() === ""){
      $(element).html(player())
      turn++
    }
    
  }
  
  function setMessage(message) {
    //sets a provided string as the innerHTML of the div#message element:
    $("#message").html(message)
  }
  
  function checkWinner() {
    // returns true when a player wins horizontally, vertically, diagonally
    var board = {}
    var winner = false
  
    $('td').text((index, square) => board[index] = square);
  
    winCombos.forEach(function(combo) {
      if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        setMessage(`Player ${board[combo[0]]} Won!`)
        return winner = true
      }
    })
  
    return winner
  }
  
  function doTurn(element) {
    // increments the value of the "turn" variable, invokes the checkWinner() function, invokes the updateState() function, invokes the setMessage() function with the argument "Tie game." when the game is tied, resets the board and the "turn" counter when a game is won:

    if ($("#message").html() === ""){
      updateState(element)
    }
    
    if (checkWinner()){
      saveGame()
      clearGame()
    } else if (turn === 9) {
      saveGame()
      setMessage("Tie game.")
      clearGame()
    }
    
  }
  
  function attachListeners() {
    // attaches event listeners that invoke doTurn() when a square is clicked on
    $("td").on("click", function(){
      doTurn(this)
    })

    $("#save").click(() => saveGame())
    $("#previous").click(() => previousGames())
    $("#clear").click(() => clearGame())
       
  }

  function clearGame() {
    $("td").empty();
    turn = 0;
    currentGame = 0;
  }


  function saveGame(){
    var state = $("td").toArray().map(x => x.innerText);

    if (currentGame) {
      $.ajax({
        type: 'PATCH',
        url: `/games/${currentGame}`,
        data: {state: state}
      });
    } else {
      $.post('/games', {state: state}).done(function(resp) {
        currentGame = resp.data.id
      })
    }
  }

  function previousGames(){
    if ($("#games").html() === ""){
      $.get('/games', function(resp) {
        console.log(resp)
        // debugger
        var idArray= resp.data.map(x => x.id)
  
        idArray.forEach(x => 
          $("#games").append(`<button class="saved-games" id="${x}"> Game Number: ${x}</button><br><br>`))
  
        $("button.saved-games").on("click", function(e){
          e.preventDefault()
          loadGame(this.id) 
        });
      });
    }
   
  }

  function loadGame(gameId){

    $("#message").empty()
    $.get(`/games/${gameId}`, function(resp){

      var state = resp.data.attributes.state

      // for (var i = 0; i < state.length; i++) { 
      //   $("td")[i].append(state[i])
      // }
      $("td").text((i, text) => state[i]);

      currentGame = gameId;
      turn = state.join("").length
      checkWinner();
    })
  }


  ///////////////////////////AFTER PAGE LOAD //////////

  
$(document).ready(function() {
  
  attachListeners();
  
})

