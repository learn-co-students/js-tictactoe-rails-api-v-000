// Code your JavaScript / jQuery solution here
  $(document).ready(attachListeners);
  window.upAndRunning = false;
  window.activeGameId = undefined;
// Determine Player
  function player() {
      window.turn = this.turn || 0
      if ((window.turn % 2) == 0) {
          return "X"
      } else {
          return "O"
      }
  };

// insert token onto gameboard
  function updateState(teedee) {
    var ex = $(teedee).data('x');
    var why = $(teedee).data('y');
    var square = $('td[data-x="' + ex + '"][data-y="' + why +'"]');
    var token = player();
      $('[data-x="' + ex + '"][data-y="' + why +'"]').html(token)
  };

// send passed in message if win, lose, or tie
  function setMessage(result) {
      $('#message').html(result)
   };

// check for one of 8 winning combos
  function checkWinner() {
    var squares = $('td');
    let zero = squares[0].innerHTML;
    let one = squares[1].innerHTML;
    let two = squares[2].innerHTML;
    let three = squares[3].innerHTML;
    let four = squares[4].innerHTML;
    let five = squares[5].innerHTML;
    let six = squares[6].innerHTML;
    let seven = squares[7].innerHTML;
    let eight = squares[8].innerHTML;
    if ((zero != "" && zero == one && one == two) || (zero != "" && zero == three && three == six) || (zero != "" && zero == four && four == eight)) {
            setMessage("Player " + zero + " Won!");
            return true;
    } else if (one != "" && one == four && four == seven) {
            setMessage("Player " + one + " Won!");
            return true;
    } else if ((two != "" && two == four && four == six) || (two != "" && two == five && five == eight)) {
            setMessage("Player " + two + " Won!");
            return true;
    } else if (three != "" && three == four && four == five) {
            setMessage("Player " + three + " Won!");
            return true;
    } else if (six != "" && six == seven && seven == eight) {
            setMessage("Player " + six + " Won!");
            return true;
    } else {
            return false;
    }
  };

// check for tie by checking number of squares filled
  function checkTie() {
      if (statify().length == 9) {
          return true;
      } else {
          return false;
      };
  };

//reset squares, turn, message, hidey
  function clear() {
    var squares = $('td');
    $(squares).text("");
    window.activeGameId = undefined;
    window.upAndRunning = true;
    window.turn = 0;
  };
//
//check to see if game has been saved before
  function checkSave() {
      if (activeGameId == undefined) {
          return false;
      } else {
          return true;
      };
  };

  function updateGame() {
      var currentGame = statify();

      $.ajax({
          url: "/games/" + activeGameId,
          data: {
              state: currentGame
          },
          type: "PATCH",
          dataType: "json"
    });
  };

//if space is empty update the state, check for winner, check for tie, move on
  function doTurn(clicked) {
      if (checkTie() == true || checkWinner() == true) {
          window.upAndRunning = false;
      };

      if (clicked.innerHTML == "") {
          this.updateState(clicked);
          if (checkWinner()) {
              // if game not saved yet save now
              if (activeGameId == undefined) {
                  saveGame();
              } else {
                  // if game already saved update as a winner
                  updateGame();
              };
              clear();
          } else {
              window.turn += 1;
              if (window.turn == 9) {
                  setMessage("Tie game.");
                  // if game not saved yet save now
                  if (activeGameId == undefined) {
                      saveGame();
                  } else {
                      // if game already saved update as a tie
                      updateGame();
                  };
                  clear();
              };
          };
      };
  };

// turn the current layout of the board into an array
  function statify() {
      var pieces = $("td");
      var gamestate = [];
      for (var i = 0; i < pieces.length; i++) {
          gamestate.push(pieces[i].innerHTML);
      };
      return gamestate;
  };

function saveGame() {
    var currentGame = statify();
    $.post("/games", {state: currentGame}).done(function(resp) {
        var kickback = resp;
        var test = kickback['data']['id'];
        window.activeGameId = test;
      });
    window.upAndRunning = true;
  };

// take a state array and populate it with pieces
  function populateBrd(arr) {
      $("td").text(function(el) {
          return arr[el];
      });
  };

// set the turn for a loaded game
  function setTurn(arr) {
      var counter = 0;
      for (var i = 0; i <= arr.length; i++) {
          if (arr[i] == "X" || arr[i] == "O") {
              counter ++;
          };
      };
      window.turn = counter;
  };


  function attachListeners() {
    $('td').click(function(event) {
        if (window.upAndRunning == true) {
        this.addEventListener('click', doTurn(this), false)
        };
    });

    $('#save').click (function(event) {
        if (activeGameId == undefined) {
              saveGame();
        } else {
            if (window.upAndRunning == true) {
            updateGame();
            };
        };
    });


    $('#previous').click (function(event) {
          let allofem = $.get("/games");
          allofem.done(function(data) {
              var echGm = data['data']
              var replace = ""
              echGm.forEach(function(el) {
                  replace += "<button>" + el.id + "</button><br>";
              });
              $("#games").html(replace);
          });
    });

    $("#games").on('click', 'button', (function() {
          var gameid = $(this).text();
          $.get('/games/' + gameid).done(function(resp) {
               var kickback = resp;
               var test = kickback['data']['id'];
               activeGameId = test;
               var pieces = kickback['data']['attributes']['state'];
               setTurn(pieces);
               populateBrd(pieces);
              if (checkWinner() == false && checkTie() == false) {
                  window.upAndRunning = true;
              };
          });
      }));

    $('#clear').click (function(event) {
        clear();
    });
  };

