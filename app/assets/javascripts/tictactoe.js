$(function(){
  // initialize a global variable to hold a collection of
  // all of the board squares
  $td = $("td");
  // init global variable to hold the current game's ID
  ID = undefined;
  // init global the turn variable
  turn = 0;

  attachListeners();
});

// hold winning combinations in a constant
const WINCOMBO = [[0,1,2], [3,4,5], [6,7,8],
                  [0,3,6], [1,4,7], [2,5,8],
                  [0,4,8], [2,4,6]];

// return current player
function player() {
  return turn % 2 == 0 ? 'X' : 'O';
}

function updateState(el) {
  // update board element
  let token = player();
  el.innerHTML = token;
}

function setMessage(message) {
  $("#message")[0].innerHTML = message;
}

function checkWinner() {
  let winner = false;
  // iterate over winning combos
  for(let i=0; i<WINCOMBO.length; i++){

    // clean up following if conditional
    let c = WINCOMBO[i];
    function v(index) {
      return $td[index].innerHTML;
    };
    // check if values are equal and not empty string
    if(v(c[0]) === v(c[1]) && v(c[1]) === v(c[2]) && v(c[0]) !== ""){
      winner = true;
      setMessage(`Player ${$td[c[0]].innerHTML} Won!`);
      break;
    };
  };
  return winner;
}

function doTurn(el){
  updateState(el);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  };
  if (checkGameOver()) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  };
}

function attachListeners(){
  // add click listeners to all squares
  $td.on("click", function(){
    if (this.innerHTML === "" && !checkWinner()) {
      doTurn(this);
    };
  });

  $("button#save").on("click", function(e){
    e.stopPropagation();
    saveGame();
  });

  $("button#previous").on("click", function(e){
    e.stopPropagation();
    // get game data
    $.get(`/games`, function(data){
      let button;
      let buttonCount = $("#games button").length;
      let gameCount = data["data"].length;
      // append only new saved games to div
      for(let i=buttonCount; i<gameCount; i++){
        let gameId = data["data"][i]["id"];
        button = `<button data-id="${gameId}">${gameId}</button><br>`;
        $("#games").append(button);
      };
    }).done(function(){$("div#games button").on("click", function(e){
      e.stopPropagation();
      // update ID to id of selected game
      ID = this.dataset["id"];
      // get gamestate from db and pass to resetBoard
      console.log("id", ID);
      $.get(`/games/${ID}`, function(data){
        resetBoard(data["data"]["attributes"]["state"]);
      });
    })});
  });

  $("button#clear").on("click", function(e){
    e.stopPropagation();
    // clear any messages
    $("div#message").text("");
    resetBoard();
  });
}

//-------------------------Helper Methods-------------------------//

function saveGame(){
  // grab state of board
  let stateArr = [];
  for(let i=0; i<$td.length; i++){
    stateArr.push($td[i].innerHTML);
  };
  // check if the board already exists
  if (typeof(ID) === "undefined") {
    $.post('/games', {"state": stateArr}, function(response){
      // set ID variable to new saved game id
      ID = response["data"]["id"];
    })
  } else {
    // update board in db with current state
    $.ajax({
      type: "PATCH",
      url: `/games/${ID}`,
      data: {"state": stateArr}
    });
  };
}

function resetBoard(state){
  // default to empty state
  if (typeof(state) === "undefined"){
    state = Array(9).fill("");
    turn = 0;
    ID = undefined;
  } else {
    // if a state is passed in, decrement turn for every
    // empty square on the board
    turn = 9
    state.forEach(function(square){
      if (square === "") {
        turn--;
      };
    });
  };
  // fill the board with the state passed in
  for(let i=0; i<$td.length; i++){
    $td[i].innerHTML = state[i];
  };
}

function checkGameOver(){
  for(let i=0; i<$td.length; i++){
    if ($td[i].innerHTML === "") {
      return false;
    };
  };
  return true;
}

// 3.. When previous is pressed
//    - check current games div
//    - when empty, {get /games}, append to div
//    - when populated, count li, count resp to {get /games}, add diff
