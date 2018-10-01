

var winningCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

var gameId = 0;
var turn = 0;

$(document).ready(function() {
  attachListeners()
});

function attachListeners() {
  $("td").on('click', function(e) {
    if (checkWinner() === false) {
      doTurn(this);
    }
  });

  $("#previous").on("click", function() {
    $.get("/games", function(data) {
      var games = data["data"];
      var gamesList = "";
      games.forEach(function(game) {
        gamesList += '<button class="js-game" data-id="' + game["id"] + '">' + game["id"] + '</button>';
      });
      $("#games").html(gamesList);
      attachPreviousGames();
    });
  });

//(this can go inside here, or outside this function too? )
//use class= js-game and datasets data_id
  function attachPreviousGames() {
    $(".js-game").on("click", function() {
      gameId = parseInt($(this).attr("data-id"));
      debugger
      $.get("/games/" + gameId, function(response) {
        moves = document.querySelectorAll("td");
        tableElements = response.data.attributes.state
        let square = 0;
        turn = 0;

        moves.forEach(function(element) {
          element.innerHTML = tableElements[square]
          if (element.innerHTML != "") {
            turn +=1;
          }
          square += 1;
        });
        setMessage(" ");
      });
    });
  }


  $("#clear").on("click", function() {
    clearBoard();
  });

  $('#save').click(function() {
    saveGame();
  })
}


function player () {
  if(turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function doTurn(move) {
    updateState(move);
    if (checkWinner()) {
      saveGame();
      clearBoard();
    } else if (turn === 8) {
      setMessage("Tie game.")
      saveGame();
      clearBoard();
    } else {
      if (turn === 0) {
        setMessage(" ");
      }
      turn+=1;
    }
}


function checkWinner() {
  var values = document.querySelectorAll('td')
  var state = Array.prototype.map.call(values, function (x) {return x.innerHTML;})
  var winning = false;
  var winningCombination = []
  winningCombinations.forEach(function(combination) {
    if (winning === false && (combination.every(function(y) {return state[y] === "X"}) || combination.every(function(y) {return state[y] === "O"}))) {
      setMessage(`Player ${state[combination[1]]} Won!`)
      winning = true;
    }
  })
  return winning;
}


function updateState(move) {
  if (move.innerHTML === "") {
    move.innerHTML = player()
  } else {
    turn -= 1;
  }
}

function setMessage(message) {
  document.querySelector("#message").innerHTML = message;
}


function saveGame() {
  var values = document.querySelectorAll('td');
  state = Array.prototype.map.call(values, function (x) {return x.innerHTML;})
  if (!gameId) {
    var posting = $.post('/games', {"state": state});
    posting.done(function(response) {
      gameId = response.data.id;
    })
  } else {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      dataType: 'json',
      data: {"state": state}
    });
  }
}

function clearBoard() {
    turn = 0;
    moves = document.querySelectorAll("td");
    moves.forEach(function(element) {
      element.innerHTML = ""
    });
    gameId = 0;
}

// go through again, stay close to tests and make sure I'm using the 
//right function names etc that the tests want. 
//Also, decide jquery or javascript. 

// function resetBoard() { ADD iteration 
//   // saveGame(true);
//   $('td').html("");
//   turn = 0; 
// }

// var winningCombos = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];
// // var gameId = 0;

// var turn = 0;

// var gameId = 0; //check this 

// $(document).ready(function() {
//   attachListeners();
// })

// function attachListeners() {
  
//   $('td').on('click', function(e) {
//     e.preventDefault();
//     if (checkWinner() === false) {
//     doTurn(this);
//     }
//   });
  
//   $('#previous').on('click', function(){
//      console.log("td")
//      $.get('/games', function(data){
//       var games = data["data"];
//       var gamesList = "";
//       games.forEach(function(game){
//         //create class = "js-game" 
//         gamesList =+ < `<button class="js-game" 
//         data-id="` + game["id"] + '">'  
//       });
//       $("games").html(gamesList);
//       insertPreviousGames();
//      }); 
//   });

//   $('#save').on('click', function(e) {
//     getSavedGames(e); 
//   });

//   $('#clear').on('click', function() {
   
//   });
// }

// function attachPreviousGames() {
//   $(".js-game").on("click", function() {
//       gameId = parseInt($(this).attr("data-id"))
//    $.get("/games/" + gameId, function(response) {
//      moves = document.querySelectorAll("td")
//      tableElements = response.data.attributes.state
//       let square = 0
//         turn = 0
//       moves.forEach(function(element) {
//           element.innerHTML = tableElements[square]
//            if (element.innerHTML != "") {
//             turn +=1
//           }
//           square += 1
//            });
//         setMessage(" ")
//       });
//     });
// }


// function player() {
//   if (turn % 2 ) {
//     return 'O';
//   } else {
//     return 'X';
//   }
// }

// function updateState(square) {
//   var currentPlayer = player();
//  if ($(square).value = "")
//   { $(square).html(currentPlayer);
//   }
// }

// function setMessage(message) {
//   $("#message").html(message)
// }

// function checkWinner() {
//   var winner = false;
// //looks at board---evaluates what's in the squares -- does it match up to the winning combos. How do we see what's on the board? 
//   var board = {} //board as empty object
//   $('td').text((index, square) => board[index] = square);

//   winningCombos.forEach(function(combo) {
//     if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== ""){
//       setMessage(`Player ${board[combo[0]]} Won!`)
//       return winner = true;
//     }
//   })
//   return winner
// }
//   // });
//   //   if (winner === true ){    
//   //       setMessage(`Player ${board[combo[0]]} Won!`)
//   //       //resetBoard();
//   //      } else if (turn === 8) {
//   //       setMessage("Tie game");
//   //       resetBoard();
//   //      } else {
//   //       return false
//   //      } 
//   //   return winner
  


// function resetBoard() {
//   // saveGame(true);
//   $('td').html("");
//   turn = 0; 
// }

// // function checkBoard() {
// //   return $('td').map(function() {
// //     return this.innerHTML;
// //   }).toArray()
// // }
  

// function doTurn(square) {
//   updateState(square);//put x or o in square, then increment
//   turn++;

//   if (checkWinner()) {
//     turn = 0;
//   } else if (turn === 9){
//     setMessage("Tie game.")
//   }
// }
// // attachListeners section 
// // <div id="games"></div>

// // <div id="message"></div>

// // <button id="save">Save Game</button>
// // <button id="previous">Show Previous Games</button>
// // <button id="clear">Clear Current Game</button>



// // //     // } (`li ,)
// // //       // $.get("/games", function(data){
// // //       //   var games = data["data"];
// // //       //   var gamesList = '';
// // //       //   games.forEach(function())
// // //       // })
 

// // function insertPreviousGames() {
// //     // get data from index /games 
// //      $("#games").empty();
// //       $.get("/games", function(games) {
// //         .done((data) =>  {
// //           games.forEach(function(e) {
// //             games = games.add(`<button  class="game" id="${e.id}" data-game ="${e.id}">${e.id}</button>`);
// //           })
// //            $("#games").html(games)
// //         })
// //       //add a click to play? 
 

// function saveGame(){
//   state = []
//   $('td').text((index, square) => {
//   state.push(square);
//   });
  
//   data = {state: state} (Figure out what this really does, state is so abstract)
 
//     $.ajax({
//       method: 'PATCH',
//       url: `/games/${game}`,
//       data: data
//    });
// }


// // function save() {


// // //   // whatever's in the dom -- save the current state 
// // //   //if the game is already in db, it will update it 
// // //   //this, first time, this state is saved, if second click, update 
// //   // $.post('/games', gameParams, function() {

// //   // })
// // }

// // // function previous() {
// // //   //grab all the persisted games from the db and create a button for each. when clicked, returns that game to the board
// // // //   //add all the buttons to #games
// // //  
// // // $('#games').empty();
// // // $.get('/games', (data){
// // //   data.forEach.. 
// // //   //to add dataset/
// // //   $('#games').append(`<button id="gameID-${game.id}">$(game.id}</button><br>`);
// // //     )
// // //   }

// // // })

// // //   $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
// // // }

// //  function clear() {
// // //   //clears the game board (games) = ""
// //   $('td').empty();
// //   turn = 0;
// //   currentGame = 0;
// //  }




// // ****

//  // $(`[data-x=${x}][data-y=${y}]`).html(player())
//   // or try: var td = e.target;
//   // $('td').text(token)

//   // add returned string to game board square  


// // // // These id's from home/index.html
// // // // <div id="games"></div>

// // // // <div id="message"></div>

// // // // <button id="save">Save Game</button>
// // // // <button id="previous">Show Previous Games</button>
// // // // <button id="clear">Clear Current Game</button>
// // // // square:  td
// // // // wins: const wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
// // //    //                     [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
// // // //array: [ '', '', '', '', '', '', '', '', '' ]

// // // players => tokens => 
// // // ajax calls to pages 

// // 'use strict'

// // var gameId = 0;
// // var turn = 0;

// // // var possibleWins = [ [0,3,6], [1,4,7], [2,5,8],[0,1,2], [3,4,5], [6,7,8], [0,4,8], [2,4,6] ];



// // // window.onload = () => {
// // //   // attachListeners();
// // // };


 

// // function player() {
// //   if (turn % 2  === 0 ){
// //     return "X";
// //   } else {
// //     return "O";
// //   } 
// // }

// // function updateState(e) {
// //   token = player()
// //   var td = e.target;
// //   $('td').text(token)

// //   // add returned string to game board square  
// // }

// // function setMessage(value) {
// //   $("#message").text(value)
// //   //alert()

// // }

// // function checkWinner(){
// //   var win
// //   var gameWon = false

// //   possibleWins.forEach(function(combo){
// //      if (boardState()[combo[0]] === boardState()[combo[1]] && boardState()[combo[0]] === boardState()[combo[2]] && boardState()[combo[0]] != "" ) {
// //         win = "Player " + player() + " Won!";

// //       }
// //     });
// //     if (win) {
// //       save();
// //       clear(); //reset the board 
// //       return gameWon === true

// //     } else if (!win && turn === 8) { 
// //       save();
// //       clear();
// //       setMessage("Tie game");
// //     } else {
// //       return gameWon === false
// //     }
// // }

// // function boardState() {
// //   return $('td').map(function() {
// //     return $(this).text();
// //   }).get();
// // }
// // // function doTurn() {
// // //   // var turn
// // //   // turn.forEach (turn += 1)
// // //   // updateState(pass in clicked element)
// // //   // checkWinner() 
// // //increment turn +1 
// // // }
