// Code your JavaScript / jQuery solution here
let turn = 0;

function player() {
  if (turn%2 === 0) {
    return "X"
  }
  else {
    return "O"
  }
};

function updateState(elem) {
  $(elem).text(player());
};

function setMessage(message) {
  $("#message").html(message);
};

function checkWinner() {
  let winner = "";
  if (turn > 5){
    if (state[0] === state[1] === state[2]) {
      winner = state[0];
    }
    else if (state[3] === state[4] === state[5]){
      winner = state[3];
    }
    else if (state[6] === state[7] === state[8]){
      winner = state[6];
    }
    else if (state[0] === state[3] === state[6]){
      winner = state[0];
    }
    else if (state[1] === state[4] === state[7]){
      winner = state[1];
    }
    else if (state[2] === state[5] === state[8]){
      winner = state[2];
    }
    else if (state[0] === state[4] === state[8]){
      winner = state[0];
    }
    else if (state[2] === state[4] === state[6]){
      winner = state[2];
    }
  }
    if (winner != ""){
      return true;
      let message = "Player " + winner + " Won!";
      setMessage(message);
    }
    else {
      return false;
    }
};

function doTurn(elem) {
  turn += 1;
  checkWinner();
  updateState(elem);
};

function attachListeners(){

};
