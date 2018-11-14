// Code your JavaScript / jQuery solution here
function player() {
  if (window.turn % 2 === 1) {
    return 'O';
  } else {
    return 'X';
  }
  return window.turn
}

function updateState() {
  let token = player();
  $("td").click(function(){
    return this;
  });
}