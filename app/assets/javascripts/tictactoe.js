// Code your JavaScript / jQuery solution here
$(document).ready(function() {
    attachListeners();
  })

const WINNING_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

var turn = 0;
var game_id = 0;


function player () {
  if (turn % 2 === 0 ){
    return `X`;
  } else {
    return `O`;
  }
}

function updateState(square) {
  var currentPlayer = player();
  $(square).text(currentPlayer);

}

function setMessage(message) {
  $(`#message`).text(message);
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);
  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  });

  return winner;
}

function doTurn(square) {
  updateState(square);
  turn++
  if (checkWinner()){
    saveGame();
    $(`td`).empty();
    turn = 0;
  } else if (turn === 9){
    setMessage(`Tie game.`);
    $(`td`).empty();
    saveGame();
    turn = 0;
    }
  }

  function attachListeners() {
    $(`td`).on(`click`, function() {
      if ((this.innerHTML === `` || ` ` === this.innerHTML) && checkWinner() === false && turn !== 9) {
          doTurn(this);
      };
    });
    $('#save').on('click', saveGame);
    $('#clear').on('click', clearGame);
    $('#previous').on('click', previousGame)
  }


  function saveGame() {
//    event.preventDefault();
    let board = [];
    $('td').text((index, square) => board[index] = square);
    let current_board = {state: board};

     if (game_id) {

         $.ajax({
           type: 'PATCH',
           url: `/games/${game_id}`,
           data: current_board,
           //dataType: `JSON`
         });
      } else {
         $.post('/games', current_board, function(rep){
           game_id = rep.data.id;
        }
      );
    }
  }

  function clearGame() {
    $('td').empty();
    turn = 0;
    game_id = 0;
  }

  function previousGame() {
    $('#games').empty();
//  let id = this.id - 1;
    $.get(`/games`).done (function(games){
      games.data.forEach(function(game){
        $('#games').append(`<button id= "game_id-${game.id}">${game.id}</button>`)
        $('#game_id-' + game.id).on('click',function(game){
          id = game.target.innerHTML;
        $.get(`/games/${id}`).done (function(state){


          $('td').each(function(i, element){
            element.innerHTML = state.data.attributes.state[i]
         })
        })
      })
     })
   })
  }
