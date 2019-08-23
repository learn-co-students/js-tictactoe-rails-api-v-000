// this lab doesn't like let and const
var turn = 0;

function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
};

function updateState(squares){
  squares.innerHTML = player();
}
