// Code your JavaScript / jQuery solution here(292)
$(document).ready(function(){
  attachListeners();//at this point turn is 0
});


var turn = 0;
var winner = false;
//var boardA = Array.from($("td"));
var gameId = 0;
var  board = Array.from($("td")).map(el => el.innerHTML);


  function attachListeners()
        {

          $("td").on('click',function(){
            if (this.innerHTML === ''  && checkWinner()=== false){
              doTurn(this);}
        })

      // attaching buttons on index page with click events
      $("button#save").on('click',function(){saveGame()});
      $("button#previous").on('click',function(){previousGame()});
      $("button#clear").on('click',function(){resetGame()});

        }

  function currentBoard()
  {
     board = Array.from($("td")).map(el => el.innerHTML);
     return board;
  }


        function resetGame()
        {
          turn = 0;
          board =Array.from($("td")).map(el => el.innerHTML = '');
          gameId = 0;

        }


        function previousGame()
        {  $('#games').empty();
          $.get('/games', function(games){
            games.data.forEach(function(game){
            $("#games").append(`<button id="${game.id}" onclick= "loadGame(${game.id})">Game ${game.id}</button>`);
            })
            })

        }

        function loadGame(id)
        {
          gameId = id;
          $.get(`/games/${gameId}`, function(resp){
            //board = resp.data.state;
            array = resp.data.attributes.state;
            let count = 0;
            array.forEach((el) => { if (el !== "") {count += 1} });
            turn = count;
            $("td").toArray().forEach((el, i) => { el.innerHTML = resp.data.attributes.state[i]})
            // $("#games").append(resp.data.id);
          });

        }

        function saveGame()
        {
             let saveboard = Array.from(document.querySelectorAll("td")).map(el => el.innerHTML);
             if(gameId === 0)
         {
           $.post('/games', {state: saveboard}).done(function(response){
             gameId= response.data['id'];
           });
         }
         else {
               $.ajax({
               url: `/games/${gameId}`,
               method: 'PATCH',
               contentType: 'application/json; charset=utf-8',
               data: {state:saveboard}
           //success: function(data){ alert(data.success)})
         }).done(function(response){
           setMessage("Game Saved")
         })

        }
      }

function player()
    {
      return turn %2 === 0 ? "X" : "O";
    }

function updateState(cell)
    {

       cell.append(player())
       currentBoard(); //update board

    }

function setMessage(msg)
    {
    $('#message').append(msg);
    }

function checkWinner()  {

    board = currentBoard();
   const WINNERS_COMBO = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
   for (let el of  WINNERS_COMBO) {
     if(board[el[0]] === "X" && board[el[1]] === "X" && board[el[2]] === "X") {
       setMessage("Player X Won!")
       return true
     } else if (board[el[0]] === "O" && board[el[1]] === "O" && board[el[2]] === "O") {
       setMessage("Player O Won!")
       return true
     }
  }
   return false
        }

function doTurn(val)
  {
       updateState(val)
        turn += 1;
        let winner_status = checkWinner();
         if(turn >8)
        {
          setMessage("Tie game.");
           saveGame();
           resetGame();
           console.log(board);
        }
          else if(winner_status === true)
          {
            saveGame();
            resetGame();
                  } //call method to make board an empty one and will reset turn to 0

    }
