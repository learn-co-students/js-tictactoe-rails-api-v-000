'use strict'

function attachListeners() {
  $("td").on('click', function(data) {
    doTurn($(this).data("x"), $(this).data("y"));
  });
}

function doTurn(x,y) {
  console.log(x, y)
}
