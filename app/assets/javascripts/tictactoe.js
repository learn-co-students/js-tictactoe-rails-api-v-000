// Code your JavaScript / jQuery solution here

var WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ]

  var turn = 0;
  var currentGame = 0;

  $(document).ready(function() {
  attachListeners();
  });

  function attachListeners() {
      $("td").on("click", function() {
        if (!$.text(this) && !checkWinner()) {
            doTurn(this);
        }
    });


   var player = () => turn % 2 ? 'O' : 'X';

   var updateState = function(td) {
        $(td).append(player());
    }

    // var message = function(string) {
    //     $('#message').append(string);
    // }
    var message = (string) => $('#message').append(string);

    var board = () => {
        var array = []
        document.querySelectorAll('td').forEach((td) => { array.push(td.innerHTML)});
        return array;
    };

    var checkWinner = function() {
        // we have WIN_COMBINATIONS that lead to our winning row, they are nested arrays
        //
        for (var i = 0; i < WIN_COMBINATIONS.length; i++) {
            var combo = WIN_COMBINATIONS[i] // nested array [0,1,2], board()[combo[0]] it'll be board()[0]
            if(board()[combo[0]] == board()[combo[1]] &&
            board()[combo[1]] == board()[combo[2]] &&
            board()[combo[0]] != ""){
                message(`Player ${board()[combo[0]]} Won!`);
                return true; // return exits the function and returns the value
            }
        }
        return false;
    }

    function resetGame() {
        $('td').empty();
        turn = 0;
        currentGame = 0;
    }

    var doTurn = function(td) {
        updateState(td);
        turn++;
        if (!checkWinner()) {
            message("Tie game.");
        } else {
            resetGame();
        }
    }

  // <script type="text/javascript" charset="utf-8">
  // $('#save').on("click", function(e) {
  //   e.preventDefault();
  // }
  // </script>

  // <script type="text/javascript" charset="utf-8">
  // $('#clear').on("click", function(e) {
  //   e.preventDefault();
  // }
  // </script>
