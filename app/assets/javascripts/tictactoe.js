// Code your JavaScript / jQuery solution here

let turn = 0;

const player = () => {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  };
};
