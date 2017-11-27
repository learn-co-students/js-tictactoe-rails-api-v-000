var turn = 0;

var player = () => { return turn % 2 === 0 ? "X" : "O";}

var updateState = (square) => {
    var character = player();
    console.log("hit it")
    $(square).innerHTML(character);
};

$(function(){



});
