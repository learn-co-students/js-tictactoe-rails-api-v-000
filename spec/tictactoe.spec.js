'use strict';

describe('Tic Tac Toe Functionality', function() {
  beforeEach(function(){
    turn = 0;
  });

  describe( "#attachListeners", function() {
    it("should attach event listeners which call your turn function when someone clicks on a square", function() {
      setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table></body>');
      attachListeners();
      var selector = '[data-x="0"][data-y="0"]';
      spyOn(window, "doTurn");
      $(selector).click();
      expect(window.doTurn).toHaveBeenCalled();
    });
  });


  describe( "#doTurn", function() {
    var myEvent;
    beforeEach(function(){
      myEvent = $('[data-x="0"][data-y="0"]').click();
    });

    it("should increment turn and call on `checkWinner()`, `updateState()`", function() {
      setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="message"></div><button id="lastGame">Show Me Last Games Results!</button><div id="lastGameBox"></div></body>');
      attachListeners();
      spyOn(window, "checkWinner");
      spyOn(window, "updateState");
      doTurn(myEvent);
      expect(turn).toEqual(1);
      expect(window.updateState).toHaveBeenCalled;
      expect(window.checkWinner).toHaveBeenCalled;
    });
  });

  describe( "#player", function() {
    it("should return the mark of the current player when player is X", function() {
      expect(player()).toEqual("X");
    });
    it("should return the mark of the current player when player is O", function() {
      turn = 1;
      expect(player()).toEqual("O");
    });
  });


    describe( "#updateState", function() {
      it("adds the return value of `player()` to the clicked `td` on the board", function() {
        setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table></body>');
        attachListeners();
        var selector = '[data-x="0"][data-y="0"]';
        $(selector).click();
        expect($(selector).html()).toEqual("X");
      });



          it("calls on `player()`", function() {
            setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table></body>');
            attachListeners();
            spyOn(window, "player");
            var selector = '[data-x="1"][data-y="0"]';
            $(selector).click();
            expect(window.player).toHaveBeenCalled();
          });
        });


          describe( "#message", function() {
            it("adds the string it's passed to the div with an id of message", function() {
              setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="message"></div></body>');
              attachListeners();
              var string = "Player X Won!";
              message(string);
              expect($("#message").html()).toEqual(string);
            });
          });

          describe( "#checkWinner", function() {
              it("returns false if there is no winning combo on the board", function() {
                setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table></body>');
                attachListeners()
                spyOn(window, "updateState");
                var selector = '[data-x="0"][data-y="0"]'
                $(selector).click()
                var selector = '[data-x="0"][data-y="1"]'
                $(selector).click()
                expect(checkWinner()).toEqual(false)
              });

              it("calls on 'message' and passes it the string 'Player X Won!' when player X wins vertically", function() {
                    setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table></body>');
                    attachListeners();
                    spyOn(window, "message");
                    $('[data-x="0"][data-y="0"]').click();
                    $('[data-x="1"][data-y="0"]').click();
                    $('[data-x="0"][data-y="1"]').click();
                    $('[data-x="2"][data-y="0"]').click();
                    $('[data-x="0"][data-y="2"]').click();
                    // _X_|_O_|_O_
                    // _X_|___|___
                    //  X |   |
                    //expect(window.checkWinner).toHaveBeenCalled();

                    expect(window.message).toHaveBeenCalledWith("Player X Won!");
                  });







});

});
