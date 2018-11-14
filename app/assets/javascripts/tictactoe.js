// Code your JavaScript / jQuery solution here
function player() {
  if ($("td:empty").length % 2 === 1) {
    return 'X';
  } else {
    return 'O';
  }
}

function updateState() {
  let token = player()
  $("td").click(function(){
    this.innerHTML = token;
  });
}