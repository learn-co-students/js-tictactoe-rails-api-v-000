window.onload = () => {
    attachListeners();
  };
  
  var turn = 0;
  var squares=[];
  
  function player() {
    return turn % 2 === 0 ? "X" : "O";
  }
  
  function updateState() {
    document.getElementById("").innerHTML = player();
  }
  
  function setMessage(string) {
    document.getElementById("message").innerHTML = string;
  }
  
  function checkWinner() {
      console.log("squares=", squares)
    if (
      squares[0] !== "" &&
      squares[0] === squares[1] &&
      squares[1] === squares[2]
    ) {
      return true;
    } else if (
      squares[3] !== "" &&
      squares[3] === squares[4] &&
      squares[4] === squares[5]
    ) {
      return true;
    } else if (
      squares[6] !== "" &&
      squares[6] === squares[7] &&
      squares[7] === squares[8]
    ) {
      return true;
    } else if (
      squares[1] !== "" &&
      squares[0] === squares[3] &&
      squares[3] === squares[6]
    ) {
      return true;
    } else if (
      squares[1] !== "" &&
      squares[1] === squares[4] &&
      squares[4] === squares[7]
    ) {
      return true;
    } else if (
      squares[2] !== "" &&
      squares[2] === squares[5] &&
      squares[5] === squares[8]
    ) {
      return true;
    } else if (
      squares[6] !== "" &&
      squares[6] === squares[7] &&
      squares[7] === squares[8]
    ) {
      return true;
    } else if (
      squares[0] !== "" &&
      squares[0] === squares[4] &&
      squares[4] === squares[8]
    ) {
      return true;
    } else if (
      squares[2] !== "" &&
      squares[2] === squares[4] &&
      squares[4] === squares[6]
    ) {
      return true;
    } else {
      return false;
    }
  }
  
  function doTurn() {
    turn++;
    updateState();
    checkWinner();
  }
  
  function attachListeners() {}
  
  function saveGame() {}
  
  function previousGame() {}
  