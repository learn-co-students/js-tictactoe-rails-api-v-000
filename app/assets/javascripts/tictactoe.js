// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0
let gameID = 0
let apiUrl = "http://localhost:3000"
  $( document ).ready(function() {
      console.log("Js and doc is ready")
      attachListeners()
   })

  function player(){
     if(turn%2 == 0){
       return "X";
     }else{
       return "O";
     }
   }

 function doTurn(box){
   updateState(box)
   turn+=1
   if(checkWinner()){
     saveGame()
     clearBoard()
   }else if(turn === 9){
     setMessage("Tie game.")
     saveGame()
     clearBoard()
   }
 }

 function updateState(box){
     $(box).html(player())
   }

 function clearBoard(){
    $("td").empty()
    turn = 0
    gameID = 0
    $('tbody').attr("gameID","0")
  }

  function attachListeners(){
    $('td').on("click",function(){
      let empty_box = (this.innerHTML == "")
      if(empty_box && !checkWinner()){
        doTurn(this)
      }
    })
    showSavedBoard()
    $('#save').on('click', function(){
      saveGame()
    })

    $('#previous').on('click', function(){
        listGames()
      })

    $('#clear').on('click', function(){
      clearBoard()
    })
  }

  function boardArray(){
    var board =$("td").map(function() {
      return $(this).text();
    });
     return Array.from(board)
  }

  function checkWinner(){
    var winner = false;


    WINNING_COMBOS.forEach(function(el){
        if(boardArray()[el[0]] == boardArray()[el[1]] && boardArray()[el[1]] == boardArray()[el[2]] && boardArray()[el[0]] !== ""){
          setMessage(`Player ${boardArray()[el[0]]} Won!`)
          winner = true
        }
    })
    return winner
  }

  function setMessage(note){
    $('#message').html(note)
  }

  function listGames(){
    $('#games').empty();
    $.get("/games", function(games,status) {
      console.log(status)
      if(games.data.length > 0 ) {
        games.data.forEach(function(game){
          // DO not duplicat when pressed 2 times
          $(`#games`).append(`<button id="gameid-${game.id}">${game.id}</button><br>`)
        })
      }
    })
  }

  function saveGame(){

      gameID = parseInt($('tbody').attr("gameID"))
      if (gameID > 0){
        $.ajax({
          method: "PATCH",
          url: `${apiUrl}/games/${gameID}`,
          data: {
              'state': boardArray()
          }
      })
      }else{
        $.post(`${apiUrl}/games`,{state: boardArray()}).then(newGame=>{

          $('tbody').attr("gameID",newGame.data.id)
      })

      }
  }

  function showSavedBoard(){

    $("#games").on("click", function(e){
      clearBoard()
      gameID = parseInt(e.target.innerHTML)
        $('tbody').attr("gameID",`${gameID}`)

      $.get(`${apiUrl}/games/${gameID}`, function(game, status){
        let board = Array.from(game.data.attributes.state)
        board.forEach(function(play,index){
          if (play != ""){
          $(`td:eq(${index})`).html(play)
          }
        })
      })
    })

  }
