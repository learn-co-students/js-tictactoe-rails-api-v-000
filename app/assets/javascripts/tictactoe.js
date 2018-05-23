var turn = 0;
var currentGame = 0;
const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
  ];

// var player = () => turn % 2 === 0 ? 'X' : 'O'
function player() {
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
};

function updateState(td) {
  $(td).append(player())
};