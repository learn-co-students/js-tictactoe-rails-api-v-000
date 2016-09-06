var turn = 0;

function attachListeners() {

}




function player() {
  if ((turn % 2) == 0) {
    return "X"
  } else {
    return "O"
  }
};


function updateState(cell) {
  cell.text(player());
};
