var positionSelected = 0;
var gameId = 0;
var turn = 0;
var array =["","","","","","","","",""];
var winCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]

]

$(document).ready(function() {
   attachListeners();

});


function player() {
  if (turn%2 === 0)
  {return "X"}
  else {return "O"}
}

// Returns the token of the player whose turn it is, 'X' when the turn variable is even and 'O' when it is odd.
function updateState(input) {
  input.innerHTML = player();

}
// Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.
function setMessage(string) {
  $("div#message")[0].innerHTML = string
}
// Accepts a string and adds it to the div#message element in the DOM.
function checkWinner() {
  let result = false;
  array = currentState()
  winCombinations.forEach(function(element) {
                  const win_index1=element[0];
                  const win_index2=element[1];
                  const win_index3=element[2];
                  if ((array[win_index1] === "X") && (array[win_index2] === "X") && (array[win_index3] === "X"))
                    {setMessage("Player X Won!");
                    result = true;}
                  else if ((array[win_index1] === "O") && (array[win_index2] === "O") && (array[win_index3] === "O"))
                  {setMessage("Player O Won!");
                  result = true;}
                });
    return result;
}
// Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
// If there is a winning combination on the board, checkWinner() should invoke setMessage(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'
function doTurn(input) {
  if (gameOver() === false)
          if (validMove(input))
          {
            updateState(input);
            if (checkWinner())
              {turn = 0;
                $.post('/games', {state: currentState()}).done(function(data){
          			alert('ok');
          		});
                for (let i = 0; i < 9; i++) {
                  let squares = document.querySelectorAll('td');
                  squares[i].innerHTML = "";}
                  gameId = 0;

                }
            else {
            if (fullBoard(currentState()))
              {$.post('/games', {state: currentState()}).done(function(data){
              alert('ok');
            });
                setMessage("Tie game.");
                for (let i = 0; i < 9; i++) {
                  let squares = document.querySelectorAll('td');
                  squares[i].innerHTML = "";}
                  gameId =0;
              }
            else { turn +=1;}

          }}
          else {
            setMessage("Invalid Move");
          }
    else
    {
      setMessage("Game Is Already Over")
    currentBoard.forEach(function(element) {
      if (element === 'X' || element ==='O')
      {turn +=1;}
    })
      }
}
// Increments the turn variable by 1.
// Invokes the updateState() function, passing it the element that was clicked.
// Invokes checkWinner() to determine whether the move results in a winning play.


function attachListeners() {
  // var squares = document.querySelectorAll('td');
  // squares.forEach(function(element) {
  // $(element).on("click",doTurn(element))
  // })
  $('td').on("click",function(){
    doTurn(this)
  })

  $('button#previous').on("click",() => showPreviousGames());
  $('button#clear').on("click",() => clearGame());
  $('button#save').on("click",()=>saveGame());


}


//returns the current state
function currentState() {
  array = [];
for (var i=0;i<9;i++) {array.push(document.querySelectorAll("td")[i].innerHTML);}
  return array;
}

function gameOver() {
  if (checkWinner() || fullBoard(currentState()))
  {return true}
  else {
    return false
  }
}

function validMove(input) {
  return input.innerHTML === "";
}

function fullBoard(array)
{
  if (array.includes("")) {return false;}
  else {return true;}
}

function showPreviousGames() {

    $.get('/games').done(function(data) {
      // let gamesLinks = $("#games")[0].innerHTML;
      let games = data["data"];
      if (games.length > 0)
      {$("#games")[0].innerHTML = "";
      games.forEach(function(element) {$("#games")[0].innerHTML += `<button id="game-${element["id"]}">Game ${element["id"]}</button></br>`})};
      $('button[id^="game"]').on("click", function() {showGame(this)});
      // for (let i=0;i++;i<data["data"].length)
      // {gamesLinks += "<p>" + games[i]["id"] + "</p>"};
      // $("#games")[0].innerHTML = gamesLinks;
      // console.log(gamesLinks)
  });
}

function getGameNumber() {
  var num = 0;
  $.get('/games').done(function(data) {
    let games = data["data"];
    num = games.length + 1;
    $("#currentGameNumber")[0].innerHTML += num
  })
}

function clearGame() {
  for (var i=0;i<9;i++) {document.querySelectorAll("td")[i].innerHTML = ""}
  turn = 0;
  gameId = 0;
}

function saveGame() {
  if (gameId === 0)
  $.post('/games', {state: currentState()}).done(function(data){
    gameId = data["data"]["id"];
  alert(`ok - the game is saved as game number ${gameId}`);});
  else {
    $.ajax({
               url: `/games/${gameId}`,
               type: 'PATCH',
               data: {state: currentState(), _method: "PATCH"},
               success: function(res) {
                 alert('ok - the game has been updated');
               }
       });

  }
}

function showGame(input) {
  gameNumber = parseInt(input.innerHTML.slice(5,7))
  gameId = gameNumber;
  $.get(`/games/${parseInt(gameNumber)}`).done(function(data) {
    gameState =data["data"]["attributes"]["state"]
    for (var i=0;i<9;i++) {document.querySelectorAll("td")[i].innerHTML = gameState[i]}
    turn = 0;
    gameState.forEach(function(element) {
      if (element === 'X' || element ==='O')
      {turn +=1;}
    })
    });

}
