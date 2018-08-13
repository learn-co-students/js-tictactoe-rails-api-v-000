// Code your JavaScript / jQuery solution here

var turn = 0;
var saved = 0;

function player() {
    return (turn % 2 === 0 ? 'X' : 'O');
}

function updateState(square) {
    $(square).html(player);
}

function setMessage(string) {
    $('#message').html(string);
}

function checkWinner() {
    switch (true) {
        case $("td[data-x$='0'][data-y$='0']").html() === $("td[data-x$='1'][data-y$='0']").html() && $("td[data-x$='0'][data-y$='0']").html() === $("td[data-x$='2'][data-y$='0']").html() && $("td[data-x$='0'][data-y$='0']").html() !== "":
            setMessage("Player " + $("td[data-x$='0'][data-y$='0']").html() + " Won!");
                return true;
        case $("td[data-x$='0'][data-y$='1']").html() === $("td[data-x$='1'][data-y$='1']").html() && $("td[data-x$='0'][data-y$='1']").html() === $("td[data-x$='2'][data-y$='1']").html() && $("td[data-x$='0'][data-y$='1']").html() !== "":
            setMessage("Player " + $("td[data-x$='0'][data-y$='1']").html() + " Won!");
                return true;
        case $("td[data-x$='0'][data-y$='2']").html() === $("td[data-x$='1'][data-y$='2']").html() && $("td[data-x$='0'][data-y$='2']").html() === $("td[data-x$='2'][data-y$='2']").html() && $("td[data-x$='0'][data-y$='2']").html() !== "":
            setMessage("Player " + $("td[data-x$='0'][data-y$='2']").html() + " Won!");
                return true;
        case $("td[data-x$='0'][data-y$='0']").html() === $("td[data-x$='0'][data-y$='1']").html() && $("td[data-x$='0'][data-y$='0']").html() === $("td[data-x$='0'][data-y$='2']").html() && $("td[data-x$='0'][data-y$='0']").html() !== "":
            setMessage("Player " + $("td[data-x$='0'][data-y$='0']").html() + " Won!");
                return true;
        case $("td[data-x$='1'][data-y$='0']").html() === $("td[data-x$='1'][data-y$='1']").html() && $("td[data-x$='1'][data-y$='0']").html() === $("td[data-x$='1'][data-y$='2']").html() && $("td[data-x$='1'][data-y$='0']").html() !== "":
            setMessage("Player " + $("td[data-x$='1'][data-y$='0']").html() + " Won!");
                return true;
        case $("td[data-x$='2'][data-y$='0']").html() === $("td[data-x$='2'][data-y$='1']").html() && $("td[data-x$='2'][data-y$='0']").html() === $("td[data-x$='2'][data-y$='2']").html() && $("td[data-x$='2'][data-y$='0']").html() !== "":
            setMessage("Player " + $("td[data-x$='2'][data-y$='0']").html() + " Won!");
                return true;
        case $("td[data-x$='0'][data-y$='0']").html() === $("td[data-x$='1'][data-y$='1']").html() && $("td[data-x$='0'][data-y$='0']").html() === $("td[data-x$='2'][data-y$='2']").html() && $("td[data-x$='0'][data-y$='0']").html() !== "":
            setMessage("Player " + $("td[data-x$='0'][data-y$='0']").html() + " Won!");
                return true;
        case $("td[data-x$='2'][data-y$='0']").html() === $("td[data-x$='1'][data-y$='1']").html() && $("td[data-x$='2'][data-y$='0']").html() === $("td[data-x$='0'][data-y$='2']").html() && $("td[data-x$='2'][data-y$='0']").html() !== "":
            setMessage("Player " + $("td[data-x$='2'][data-y$='0']").html() + " Won!");
                return true;
        default:
            $('#message').empty();
            return false;
    }
}

function checkTieGame() {
    if ($("td:not(:contains('O'), :contains('X'))").length === 0) {
        setMessage("Tie game.");
        return true;
    } else {
        return false;
    }
}

function doTurn(square) {
    if ($(square).html().length === 0) {
        updateState(square);
        turn += 1;
    }
    
    checkWinner;
    checkTieGame;

    if (checkWinner() || checkTieGame()) {
        $("#save").click();
        ($("td").empty());
        $("table").removeAttr('id');
        turn = 0;
    }
}

function attachListeners() {
    $(this).on("click", function() {
        if (!(checkWinner() || checkTieGame())) {
            doTurn(this);
            //alert("I was clicked!")
        }
    });
}

function currentStateArray() {
    var board = [];
    $.each($("table td"), function() {
        board.push($(this).html());
    });
    return board;
}


$(document).ready(function() {
    
    $('td').each(attachListeners);

    $("#previous").on('click', function() {
        $.get("/games", function(data) {
            if (data.data.length > 0) {
                for(let i = 0; i < data.data.length; i++) {
                    if ($("#games:contains('Game ID: " + data.data[i].id + "')").length === 0) {
                        $("#games").append("<button type='button' id=button" + data.data[i].id + ">Game ID: " + data.data[i].id + "</button>");
                        $("#button" + data.data[i].id).on('click', function() {
                            $.get("/games/" + data.data[i].id, function(data) {
                                var arr = data.data.attributes.state;
                                $.each($("td"), function(i) {
                                    ($(this).html(arr[i]));
                                });
                                turn = $("td:contains('X'), td:contains('O')").length;
                            });
                            $("table").attr('id', data.data[i].id);
                        });
                    }
                }
            }
        });
    });

    $("#save").on("click", function(event) {
        event.preventDefault();

        var id = $("table").attr("id");
        if (!id) {
            var posting = $.post('/games', {state: currentStateArray()});
            posting.done(function(data) {
                $("table").attr('id', data.data.id);
                //alert("Game ID: "+ data.data.id + " has been saved.");
            });
        } else {
            $.ajax({
                method: "PATCH",
                url: "/games/" + id,
                data: {state: currentStateArray()}
            })
                .done(function(data) {
                    //alert("Game ID: "+ data.data.id + " has been saved.");
                });
        }       
    });
    
    $("#clear").on("click", function(event) {
        event.preventDefault();
        ($("td").empty());
        $("table").removeAttr('id');
        turn = 0;
    })
    
});
