var state = ["","","","","","","","",""]
var game = 0
var turn = 0
const winningCombo =
      [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ]

$(document).ready(function() { 
  attachListeners();
 });

var player = () => turn % 2 ? 'O' : 'X';


function updateState(element) {
  element.innerHTML = player();
}

function setMessage(message) {
  $( "#message" ).text(message)
}

function checkWinner() {
  const board = [];
  let winner = false;
  $("td").text(function(i, token){
    board[i] = token;
  });
  winningCombo.forEach(function(combo){
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== ""){
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  });
    return winner;
}



function doTurn(element) {

  if (element.innerHTML !== ""){
  return "try another element"
}
  updateState(element);
  turn ++;

  if (checkWinner()){
    $("td").empty()
    turn = 0
    saveGame()
  }
  else if (turn === 9) {
    setMessage("Tie game.")
      $("td").empty()
      turn = 0
      saveGame()
  }

}

function attachListeners() {
  $("td").on("click", function(){
    if (!checkWinner()) {
      doTurn(this)
    };
  });

  $("#save").on("click", () => saveGame())


  $("#previous").on("click", () => previousGames())


  $("#clear").on("click", () => resetGame())
}

function resetGame() {
    $("td").empty()
    turn = 0
    game = 0
};

  function previousGames() {
    $.get("/games", function(data){
      $("#games").html("")
      data.data.forEach(function(game){
          previousGameButton(game)
      });
    });
  };

  function previousGameButton(game) {
    $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
    $(`#gameid-${game.id}`).on("click", () => loadGame(game.id))
 };

 function loadGame(id) {

   $.ajax({
     type: 'GET',
     url: `/games/${id}`,
     dataType: 'json'
   }).done(function(data) {
     var board = data.data.attributes.state
     turn = board.join("").length
     game = id

     $("td").each(function(element){
       this.innerHTML = board[element]
     });

   })
 };


  function saveGame() {
    $("td").text(function(cell){
      state.push(cell.innerHTML)
    });
     if (game === 0){
      $.post('/games', {state: state}, function(json){
        game = parseInt(json.data['id'])
      });
   }else{
      $.ajax({
        type: 'PATCH',
        url: `/games/${game}`,
        data: { state: state},
        dataType: 'json'
      })
   }
    //  posting.done(function(data) {
    //
    //    var post = data;
    //    // $("#games").text(post[board]);
    //
    // });

 };
