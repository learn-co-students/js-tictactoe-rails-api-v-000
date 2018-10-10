// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

var player = () => ((turn % 2 === 0) ? "X" : "O")

var updateState = (tdElement) => {
  $(tdElement).text(player());
}

var setMessage = (msgString) => {
  $("#message").text(msgString);
  }

var checkWinner = () => {
  var wonGame = WINNING_COMBOS.filter(function(winCombo){
    var position_1 = $('td')[winCombo[0]].textContent;
    var position_2 = $('td')[winCombo[1]].textContent;
    var position_3 = $('td')[winCombo[2]].textContent;

    return (position_1 ==="X" && position_2 === "X" && position_3 === "X") || (position_1 === "O" && position_2 === "O" && position_3 === "O")
  })
  if (wonGame[0]){
    var token = $('td')[wonGame[0][0]].textContent;
    setMessage(`Player ${token} Won!`);
    return true;
  } else {
    return false;
  }
}

var resetGame = () => {
  for (let i=0; i<9; i++) {
    $('td')[i].innerHTML = "";
  }
  turn = 0;
}

var moveValid = (tdElement) => {
  // console.log("MoveValid Element", tdElement, "Text", tdElement.textContent);
  return (tdElement.textContent === "X" || tdElement.textContent === "O") ?  false :  true;
}

var turnPerState = (state) => {
  var tokens = state.filter(element => element != "");
  return tokens.length;
}

var gameOver = () => {
  //find blanksquares
  var blankSquare = $("td").filter( function(index, element) {
   return element.textContent == "";
 })
 //if there are blank squares the game is not over
  return !blankSquare[0];
}

var doTurn = (tdElement) => {
  if (moveValid(tdElement)) {
    updateState(tdElement);
    turn ++;
    var gameWon = checkWinner();

    if (gameWon) {
      resetGame();
    } else if (gameOver()) {
      setMessage("Tie game.");
      resetGame();
    }
  }
}

var renderGame = (game) => {
  return `<li><a href="#" onclick="showGame(${game["id"]})">${game["id"]}</a></li>`
}

var renderGamesList = (data) =>{
  var result = data["data"].map(game => renderGame(game)).join('');
  console.log("render Games List", result);
  if (result){
    return `<ul>${result}</ul>`
  }
}

var showGame = (gameID) => {
  $.get(`/games/${gameID}`, function(response){
    console.log("showing the game response", response["data"]["attributes"]["state"] )
    let returnedState = response["data"]["attributes"]["state"]
    for (let i=0; i<9; i++) {
      $('td')[i].innerHTML = returnedState[i];
    }
    turn = turnPerState(returnedState);
    currentGame = response["data"]["id"]
  })
}


var attachListeners = () => {
  //click on table square listeners
  $("td").on("click", function(){
    // alert(`${$(this).data("x")} and ${$(this).data("y")} `)
    doTurn(this)
  })

  //Save Button functionality
  $("#save").on("click", function(){
    var captureState = [];
    for (let i=0; i < 9; i++){
      captureState[i] =  $("td")[i].textContent;
    }
    console.log("state", captureState)
    $.post('/games', {state: captureState});
    })

  //Previous Games functionality
  $("#previous").on("click", function(){
    $.get('/games', data => {
      $("#games").html(renderGamesList(data));
    })
  })
}

$(function(){
  attachListeners();

})
