// Code your JavaScript / jQuery solution here
var turn = 0;

function player() {
    // var squares = window.document.querySelectorAll('td');
    // let count = 0;
    // squares.forEach ( function (square) {
    //      if (square.innerHTML != "")  ++count;
    // });
    // console.log("player count",count);
    // return count & 1 ? 'O' : 'X';
    return turn & 1 ? 'O' : 'X';
} 

function doTurn (square) {
 
    let x = parseInt(square.dataset.x) + 1;
    let y = parseInt(square.dataset.y) + 1;
    console.log("doTurn",x,y,player());
  $(`tr:nth-of-type(${y}) td:nth-of-type(${x})`).text(player());
    ++turn;
}

$(function () {
    $("td").click(function(e){    
        doTurn( this);
        return false;
    });
});