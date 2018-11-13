// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

//X , Y
// const LABELS = {[0,0]: 1, [1,0]: 2, [2, 0]: 3, [0,1]: 4, [1,1]: 5, [2,1]: 6,
//                 [0,2]: 7, [1,2]: 8, [2,2]: 9};
var turn = 0;
var currentGame = 0;

function player(){
  if (turn % 2 == 0){
    return 'X';
  }else{
    return 'O';
  };
};


function updateState(){
  var move = player();
}
