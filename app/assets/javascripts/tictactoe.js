var turn = 0;

function attachListeners(){
    $("td").click(function(event){
        doTurn(event);
    });
    
    $("#save").click(function(){
        alert("clicked!");
    });
}

function doTurn(event){
    turn++;
    updateState(event);
}

function player(){
    if (turn % 2 === 0){
        return 'X';
    } else {
        return 'O';
    }
}

function updateState(event){
    $(event.target).text(player());
}


$(document).ready(function(){
    attachListeners();
});