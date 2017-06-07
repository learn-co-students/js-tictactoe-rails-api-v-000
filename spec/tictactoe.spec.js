'use strict';

describe('Tic Tac Toe Functionality', function() {
    beforeEach(function() {
        turn = 0;
    });

    describe("#attachListeners", function() {
        it("should attach event listeners which call your turn function when someone clicks on a square", function() {
            setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table></body>');
            attachListeners();
            var selector = '[data-x="0"][data-y="0"]';
            spyOn(window, "doTurn");
            $(selector).click();
            expect(window.doTurn).toHaveBeenCalled();
        });
    });

    describe("#doTurn", function() {
        var myEvent;
        beforeEach(function() {
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

    describe("#player", function() {
        it("should return the mark of the current player when player is X", function() {
            expect(player()).toEqual("X");
        });
        it("should return the mark of the current player when player is O", function() {
            turn = 1;
            expect(player()).toEqual("O");
        });
    });

    describe("#updateState", function() {
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

    describe("#message", function() {
        it("adds the string it's passed to the div with an id of message", function() {
            setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="message"></div></body>');
            attachListeners();
            var string = "Player X Won!";
            message(string);
            expect($("#message").html()).toEqual(string);
        });
    });

    describe("#checkWinner", function() {
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
            expect(window.message).toHaveBeenCalledWith("Player X Won!");
        });

        it("calls on 'message' and passes it the string 'Player X Won!' when player X wins diagonally", function() {
            setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table></body>');
            attachListeners();
            spyOn(window, "message");
            $('[data-x="0"][data-y="0"]').click();
            $('[data-x="1"][data-y="0"]').click();
            $('[data-x="1"][data-y="1"]').click();
            $('[data-x="2"][data-y="0"]').click();
            $('[data-x="2"][data-y="2"]').click();
            // _X_|_O_|_O_
            // ___|_X_|___
            //    |   | X
            expect(window.message).toHaveBeenCalledWith("Player X Won!");
        });
    });

    describe("when there is a tie", function() {
        it("calls on 'message' and passes it the string 'Tie game' when there is a tie", function() {
            setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="message"></div><button id="lastGame">Show Me Last Games Results!</button><div id="lastGameBox"></div></body>');
            attachListeners();
            spyOn(window, "message");
            $('[data-x="0"][data-y="0"]').click();
            $('[data-x="1"][data-y="1"]').click();
            $('[data-x="1"][data-y="2"]').click();
            $('[data-x="0"][data-y="1"]').click();
            $('[data-x="2"][data-y="1"]').click();
            $('[data-x="2"][data-y="2"]').click();
            $('[data-x="0"][data-y="2"]').click();
            $('[data-x="1"][data-y="0"]').click();
            $('[data-x="2"][data-y="0"]').click();
            // _X_|_O_|_X_
            // _O_|_O_|_X_
            //  X | X | O
            expect(window.message).toHaveBeenCalledWith("Tie game");
        });
    });

    describe("resetting the board", function() {

        it("resets the board and sets turn to zero when there is a winner", function() {
            setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="message"></div><button id="lastGame">Show Me Last Games Results!</button><div id="lastGameBox"></div></body>');
            attachListeners();
            $('[data-x="1"][data-y="2"]').click();
            $('[data-x="0"][data-y="0"]').click();
            $('[data-x="1"][data-y="0"]').click();
            $('[data-x="1"][data-y="1"]').click();
            $('[data-x="2"][data-y="0"]').click();
            $('[data-x="2"][data-y="2"]').click();
            // _O_|_X_|_X_
            // ___|_O_|___
            //    | X | O
            expect($("#message").html()).toEqual("Player O Won!");
            // ___|___|___
            // ___|___|___
            //    |   |
            expect(turn).toEqual(0);
            $("td").each(function() {
                expect($(this).html()).toEqual("")
            });
        });

        it("resets the board and sets turn to zero when there is a tie", function() {
            setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="message"></div><button id="lastGame">Show Me Last Games Results!</button><div id="lastGameBox"></div></body>');
            attachListeners();
            $('[data-x="0"][data-y="0"]').click();
            $('[data-x="1"][data-y="1"]').click();
            $('[data-x="1"][data-y="2"]').click();
            $('[data-x="0"][data-y="1"]').click();
            $('[data-x="2"][data-y="1"]').click();
            $('[data-x="2"][data-y="2"]').click();
            $('[data-x="0"][data-y="2"]').click();
            $('[data-x="1"][data-y="0"]').click();
            $('[data-x="2"][data-y="0"]').click();
            // _X_|_O_|_X_
            // _O_|_O_|_X_
            //  X | X | O
            expect($("#message").html()).toEqual("Tie game");
            // ___|___|___
            // ___|___|___
            //    |   |
            expect(turn).toEqual(0);
            $("td").each(function() {
                expect($(this).html()).toEqual("")
            });
        });

        it("allows client to play multiple game", function() {
            setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="message"></div><button id="lastGame">Show Me Last Games Results!</button><div id="lastGameBox"></div></body>');
            attachListeners();
            $('[data-x="0"][data-y="0"]').click();
            $('[data-x="1"][data-y="1"]').click();
            $('[data-x="1"][data-y="2"]').click();
            $('[data-x="0"][data-y="1"]').click();
            $('[data-x="2"][data-y="1"]').click();
            $('[data-x="2"][data-y="2"]').click();
            $('[data-x="0"][data-y="2"]').click();
            $('[data-x="1"][data-y="0"]').click();
            $('[data-x="2"][data-y="0"]').click();
            // _X_|_O_|_X_
            // _O_|_O_|_X_
            //  X | X | O
            expect($("#message").html()).toEqual("Tie game");
            // ___|___|___
            // ___|___|___
            //    |   |
            expect(turn).toEqual(0);
            $("td").each(function() {
                expect($(this).html()).toEqual("")
            });
            $('[data-x="1"][data-y="2"]').click();
            $('[data-x="0"][data-y="0"]').click();
            $('[data-x="1"][data-y="0"]').click();
            $('[data-x="1"][data-y="1"]').click();
            $('[data-x="2"][data-y="0"]').click();
            $('[data-x="2"][data-y="2"]').click();
            // _O_|_X_|_X_
            // ___|_O_|___
            //    | X | O
            expect($("#message").html()).toEqual("Player O Won!");
            // ___|___|___
            // ___|___|___
            //    |   |
            expect(turn).toEqual(0);
            $("td").each(function() {
                expect($(this).html()).toEqual("")
            });
        });
    });
});


describe('#integration tests of persistence', function() {
    beforeEach(function() {
        turn = 0;
        currentGame = 0;
    });
    it("if i click the getAllGames button it should send a get request to /games", function() {
        setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="games"></div><div id="message"></div><button id="save">Save Game</button><button id="previous">Show Previous Games</button></body>');
        attachListeners()
        jasmine.Ajax.withMock(function() {
            $('#previous').click()
            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe('/games');
            expect(request.method).toBe('GET');
        });
    });

    it("if i click the save game button it should post to /games", function() {
        setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="games"></div><div id="message"></div><button id="save">Save Game</button><button id="previous">Show Previous Games</button></body>');
        attachListeners()
        jasmine.Ajax.withMock(function() {
            $('#save').click()
            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe('/games');
            expect(request.method).toBe('POST');
        });
    });

    it("if i click the save game button a second time it should send a PATCH to /games/:id", function() {
        setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="games"></div><div id="message"></div><button id="save">Save Game</button><button id="previous">Show Previous Games</button></body>');
        attachListeners()
        jasmine.Ajax.withMock(function() {
            var data = {
                game: {
                    id: 1,
                    state: ["X", "", "", "", "", "", "", "", ""]
                }
            }
            var response = {
                "status": 200,
                "contentType": 'application/json',
                "responseText": JSON.stringify(data)
            }
            $('#save').click()
            jasmine.Ajax.requests.mostRecent().respondWith(response);
            $('#save').click()
            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe('/games/1');
            expect(request.method).toBe('PATCH');
        });
    });

    it("if i click the previous game button and no games have been saved i should get no games in the DOM", function() {
        setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="games"></div><div id="message"></div><button id="save">Save Game</button><button id="previous">Show Previous Games</button></body>');
        attachListeners()
        expect($("#games").children().length).toBe(0);
        jasmine.Ajax.withMock(function() {
            var data = {
                games: []
            }
            var response = {
                "status": 200,
                "contentType": 'application/json',
                "responseText": JSON.stringify(data)
            }
            $('#previous').click()
            jasmine.Ajax.requests.mostRecent().respondWith(response);
            expect($("#games").children().length).toBe(0);
        });
    });

    it("if i click the previous game button and a game has already been saved it should add the previous game to the DOM", function() {
        setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="games"></div><div id="message"></div><button id="save">Save Game</button><button id="previous">Show Previous Games</button></body>');
        attachListeners()
        expect($("#games").children().length).toBe(0);
        jasmine.Ajax.withMock(function() {
            var data = {
                games: [{
                    id: 1,
                    state: ["X", "", "", "", "", "", "", "", ""]
                }]
            }
            var response = {
                "status": 200,
                "contentType": 'application/json',
                "responseText": JSON.stringify(data)
            }
            $('#previous').click()
            jasmine.Ajax.requests.mostRecent().respondWith(response);
            expect($("#games").children().length).toBe(1);
        });
    });

    it("if i click save it should persist the game so that when i asked for previous games i should get one more in the DOM", function() {
        setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="games"></div><div id="message"></div><button id="save">Save Game</button><button id="previous">Show Previous Games</button></body>');
        attachListeners()
        expect($("#games").children().length).toBe(0);
        jasmine.Ajax.withMock(function() {
            var data = {
                games: [{
                    id: 1,
                    state: ["X", "", "", "", "", "", "", "", ""]
                }]
            }
            var response = {
                "status": 200,
                "contentType": 'application/json',
                "responseText": JSON.stringify(data)
            }
            $('#previous').click()
            jasmine.Ajax.requests.mostRecent().respondWith(response);
            expect($("#games").children().length).toBe(1);
            $("#save").click()
            var data = {
                games: [{
                        id: 1,
                        state: ["X", "", "", "", "", "", "", "", ""]
                    },
                    {
                        id: 2,
                        state: ["", "", "", "", "", "", "", "", ""]
                    }
                ]
            }
            var response = {
                "status": 200,
                "contentType": 'application/json',
                "responseText": JSON.stringify(data)
            }
            $('#previous').click()
            jasmine.Ajax.requests.mostRecent().respondWith(response);

            expect($("#games").children().length).toBe(2);
        });
    });

    it("if i play a game it should autosave at the end of the game", function() {
        setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="games"></div><div id="message"></div><button id="save">Save Game</button><button id="previous">Show Previous Games</button></body>');
        attachListeners()
        expect($("#games").children().length).toBe(0);
        jasmine.Ajax.withMock(function() {

            $('[data-x="0"][data-y="0"]').click();
            $('[data-x="1"][data-y="0"]').click();
            $('[data-x="0"][data-y="1"]').click();
            $('[data-x="2"][data-y="0"]').click();
            $('[data-x="0"][data-y="2"]').click();
            //     // _X_|_O_|_O_
            //     // _X_|___|___
            //     //  X |   |
            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe('/games');
            expect(request.method).toBe('POST');
        });
    });

    it("if i play a game it should autosave and start a new game", function() {
        setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="games"></div><div id="message"></div><button id="save">Save Game</button><button id="previous">Show Previous Games</button></body>');
        attachListeners()
        expect($("#games").children().length).toBe(0);
        jasmine.Ajax.withMock(function() {

            $('[data-x="0"][data-y="0"]').click();
            $('[data-x="1"][data-y="0"]').click();
            $('[data-x="0"][data-y="1"]').click();
            $('[data-x="2"][data-y="0"]').click();
            $('[data-x="0"][data-y="2"]').click();
            //     // _X_|_O_|_O_
            //     // _X_|___|___
            //     //  X |   |
            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe('/games');
            expect(request.method).toBe('POST');
            var data = {
                game: {
                    id: 1,
                    state: ["X", "O", "O", "X", "", "", "X", "", ""]
                }
            }
            var response = {
                "status": 200,
                "contentType": 'application/json',
                "responseText": JSON.stringify(data)
            }
            jasmine.Ajax.requests.mostRecent().respondWith(response);
            $('[data-x="0"][data-y="0"]').click();
            $('[data-x="1"][data-y="0"]').click();
            $('[data-x="0"][data-y="1"]').click();
            $('[data-x="2"][data-y="0"]').click();
            //     // _X_|_O_|_O_
            //     // _X_|___|___
            //     //    |   |
            expect(jasmine.Ajax.requests.count()).toBe(1)
            $("#save").click()
            expect(jasmine.Ajax.requests.count()).toBe(2)
            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe('/games');
            expect(request.method).toBe('POST');
        });
    });

    it("if should be able to switch to an old game", function() {
        setFixtures('<body><table border="1" cellpadding="40"><tr><td data-x="0", data-y="0"></td><td data-x="1", data-y="0"></td><td data-x="2", data-y="0"></td></tr><tr><td data-x="0", data-y="1"></td><td data-x="1", data-y="1"></td><td data-x="2", data-y="1"></td></tr><tr><td data-x="0", data-y="2"></td><td data-x="1", data-y="2"></td><td data-x="2", data-y="2"></td></tr></table><div id="games"></div><div id="message"></div><button id="save">Save Game</button><button id="previous">Show Previous Games</button></body>');
        attachListeners()
        jasmine.Ajax.withMock(function() {
            $('[data-x="0"][data-y="0"]').click();
            $("#previous").click()
            var data = {
                games: [{
                        id: 1,
                        state: ["X", "", "", "", "", "", "", "", ""]
                    },
                    {
                        id: 2,
                        state: ["", "X", "O", "", "O", "", "", "", ""]
                    }
                ]
            }
            var response = {
                "status": 200,
                "contentType": 'application/json',
                "responseText": JSON.stringify(data)
            }
            jasmine.Ajax.requests.mostRecent().respondWith(response);
            // when you display the previous games you must give them a data attribute of gameid
            $('[data-gameid="2"]').click(function() {
                expect($('[data-x="0"][data-y="0"]').text()).toBe("")
                expect($('[data-x="1"][data-y="0"]').text()).toBe("X")
                expect($('[data-x="2"][data-y="0"]').text()).toBe("O")
                expect($('[data-x="1"][data-y="1"]').text()).toBe("O")
            });
        });
    });
});