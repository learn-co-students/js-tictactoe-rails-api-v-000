try {
  // If window is defined, it means we're running the tests in the browser, so we should use Mocha's BDD interface.
  window.document;
  mocha.setup('bdd');
} catch (e) {
  // If window is not defined, window.document will result in an error, taking us to the catch block and assigning the JSDom virtual DOM's window object to the 'window' variable.
  var window = dom.window;
}

const sandbox = sinon.sandbox.create();
const expect = chai.expect;

const squares = window.document.querySelectorAll('td');
const messageDiv = window.document.getElementById('message');
const gamesDiv = window.document.getElementById('games');
const saveButton = window.document.getElementById('save');
const previousButton = window.document.getElementById('previous');
const clearButton = window.document.getElementById('clear');

// Define helper functions
function resetFixtures() {
  for (let i = 0; i < 9; i++) {
    squares[i].innerHTML = '';
  }
  window.turn *= 0;
  messageDiv.innerHTML = '';
  gamesDiv.innerHTML = '';
}

function populateBoard(arr) {
  for (let i = 0; i < 9; i++) {
    squares[i].innerHTML = arr[i];
  }
}
// End helper function definitions

describe('tictactoe.js', () => {
  describe('player()', () => {
    afterEach(() => {
      sandbox.restore();
      resetFixtures();
    });

    it('is defined', () => {
      expect(window.player).to.be.a('function');
    });

    it('returns "X" when the turn count is even', () => {
      expect(window.player()).to.equal('X');
    });

    it('returns "O" when the turn count is odd', () => {
      window.turn = 3;

      expect(window.player()).to.equal('O');
    });
  });

  describe('updateState()', () => {
    afterEach(() => {
      sandbox.restore();
      resetFixtures();
    });

    it('is defined', () => {
      expect(window.updateState).to.be.a('function');
    });

    it('invokes the player() function', () => {
      const spy = sandbox.stub(window, 'player');

      window.updateState(squares[4]);

      expect(spy.calledOnce).to.be.true;
    });

    it("adds the current player's token to the passed-in <td> element", () => {
      sandbox.stub(window, 'player').
        onFirstCall().returns('X').
        onSecondCall().returns('O');

      window.updateState(squares[8]);
      window.updateState(squares[0]);

      expect(squares[8].innerHTML).to.equal('X');
      expect(squares[0].innerHTML).to.equal('O');
    });
  });

  describe('setMessage()', () => {
    afterEach(() => {
      sandbox.restore();
      resetFixtures();
    });

    it('sets a provided string as the innerHTML of the div#message element', () => {
      const string = "Player X Won!";

      window.setMessage(string);

      expect(messageDiv.innerHTML).to.contain(string);
    });
  });

  describe('checkWinner()', () => {
    afterEach(() => {
      sandbox.restore();
      resetFixtures();
    });

    it('is defined', () => {
      expect(window.checkWinner).to.be.a('function');
    });

    it('returns true when a player wins horizontally', () => {
      populateBoard(['X', 'X', 'X', '', '', '', 'O', 'O', '']);
      //  X | X | X
      // -----------
      //    |   |
      // -----------
      //  O | O |

      expect(window.checkWinner()).to.be.true;
    });

    it('returns true when a player wins diagonally', () => {
      populateBoard(['X', 'X', 'O', '', 'O', '', 'O', 'X', '']);
      //  X | X | O
      // -----------
      //    | O |
      // -----------
      //  O | X |

      expect(window.checkWinner()).to.be.true;
    });

    it('returns true when a player wins vertically', () => {
      populateBoard(['O', '', 'X', '', 'O', 'X', 'O', '', 'X']);
      //  O |   | X
      // -----------
      //    | O | X
      // -----------
      //  O |   | X

      expect(window.checkWinner()).to.be.true;
    });

    it('returns false if no winning combination is present on the board', () => {
      expect(window.checkWinner()).to.equal(false);

      populateBoard(['X', 'O', 'X', 'X', 'O', 'X', 'O', 'X', 'O']);
      //  X | O | X
      // -----------
      //  X | O | X
      // -----------
      //  O | X | O

      expect(window.checkWinner()).to.equal(false);
    });

    it('invokes the setMessage() function with the argument "Player X Won!" when player X wins', () => {
      const spy = sandbox.stub(window, 'setMessage');

      populateBoard(['', '', '', 'X', 'X', 'X', 'O', 'O', '']);
      //    |   |
      // -----------
      //  X | X | X
      // -----------
      //  O | O |

      window.checkWinner();

      expect(spy.firstCall.args[0]).to.equal('Player X Won!');
    });

    it('invokes the setMessage() function with the argument "Player O Won!" when player O wins', () => {
      const spy = sandbox.stub(window, 'setMessage');

      populateBoard(['O', '', '', 'X', 'O', 'X', 'X', '', 'O']);
      //  O |   |
      // -----------
      //  X | O | X
      // -----------
      //  X |   | O

      window.checkWinner();

      expect(spy.firstCall.args[0]).to.equal('Player O Won!');
    });
  });

  describe('doTurn()', () => {
    afterEach(() => {
      sandbox.restore();
      resetFixtures();
    });

    it('is defined', () => {
      expect(window.doTurn).to.be.a('function');
    });

    it('increments the value of the "turn" variable', () => {
      expect(window.turn).to.equal(0);

      window.doTurn(squares[0]);

      expect(window.turn).to.equal(1);
    });

    it('invokes the checkWinner() function', () => {
      const spy = sandbox.spy(window, 'checkWinner');

      window.doTurn(squares[8]);

      expect(spy.calledOnce).to.be.true;
    });

    it('invokes the updateState() function', () => {
      const spy = sandbox.spy(window, 'updateState');

      window.doTurn(squares[0]);

      expect(spy.calledOnce).to.be.true;
    });

    it('invokes the setMessage() function with the argument "Tie game." when the game is tied', () => {
      sinon.useFakeXMLHttpRequest();

      const spy = sandbox.spy(window, 'setMessage');

      populateBoard(['X', 'O', 'X', 'X', 'O', 'X', 'O', '', 'O']);
      //  X | O | X
      // -----------
      //  X | O | X
      // -----------
      //  O |   | O

      window.turn = 8;
      window.doTurn(squares[7]);

      expect(spy.firstCall.args[0]).to.equal('Tie game.');
    });

    it('resets the board and the "turn" counter when a game is won', () => {
      sinon.useFakeXMLHttpRequest();

      populateBoard(['X', 'X', 'O', 'X', 'O', 'X', '', 'O', 'O']);
      //  X | X | O
      // -----------
      //  X | O | X
      // -----------
      //    | O | O

      window.turn = 8;
      window.doTurn(squares[6]);

      const board = Array.from(squares).map(s => s.innerHTML);

      expect(board).to.have.members(['', '', '', '', '', '', '', '', '']);
      expect(window.turn).to.equal(0);
    });
  });

  describe('attachListeners()', () => {
    afterEach(() => {
      sandbox.restore();
      resetFixtures();
    });

    it('is defined', () => {
      expect(window.attachListeners).to.be.a('function');
    });

    it('attaches event listeners that invoke doTurn() when a square is clicked on', () => {
      var spy = sandbox.stub(window, 'doTurn');

      squares[0].click();

      expect(spy.calledOnce).to.be.true;

      squares[8].click();

      expect(spy.calledTwice).to.be.true;
    });

    it('passes the clicked-on <td> element to doTurn()', () => {
      var spy = sandbox.stub(window, 'doTurn');

      squares[0].click();
      squares[8].click();

      expect(spy.firstCall.args[0]).to.equal(squares[0]);
      expect(spy.secondCall.args[0]).to.equal(squares[8]);
    });
  });
});

describe('Gameplay', () => {
  afterEach(() => {
    resetFixtures();
  });

  it('Users cannot place a token in a square that is already taken', () => {
    squares[0].innerHTML = 'X';
    window.turn = 1;

    squares[0].click();

    expect(squares[0].innerHTML).to.equal('X');
    expect(window.turn).to.equal(1);
  });

  it('Users cannot play any turns once a game is won or tied', () => {
    populateBoard(['X', 'X', 'X', '', '', '', 'O', 'O', '']);
    window.turn = 5;
    //  X | X | X
    // -----------
    //    |   |
    // -----------
    //  O | O |

    squares[4].click();

    expect(squares[4].innerHTML).to.equal('');
    expect(window.turn).to.equal(5);
  });

  it('Users can play multiple games', () => {
    sinon.useFakeXMLHttpRequest();

    populateBoard(['X', 'O', 'X', 'X', 'O', 'X', 'O', '', 'O']);
    //  X | O | X
    // -----------
    //  X | O | X
    // -----------
    //  O |   | O

    window.turn = 8;
    window.doTurn(squares[7]);

    window.doTurn(squares[4]);

    const board = Array.from(squares).map(s => s.innerHTML);

    expect(board).to.have.ordered.members(['', '', '', '', 'X', '', '', '', '']);
  });
});

describe('AJAX interactions with the Rails API', () => {

  // Define helper functions
  function jsonifyGame(board) {
    return JSON.stringify({
      "data": {
        "id": "1",
        "type": "games",
        "attributes": {
          "state": board
        }
      },
      "jsonapi": {
        "version": "1.0"
      }
    });
  }

  function jsonifyGames(boards) {
    const jsonObj = {
      "data": [],
      "jsonapi": {
        "version": "1.0"
      }
    };

    for (let i = 0, l = boards.length; i < l; i++) {
      jsonObj.data.push({
        "id": "" + (i + 1),
        "type": "games",
        "attributes": {
          "state": boards[i]
        }
      });
    }

    return JSON.stringify(jsonObj);
  }
  // End helper function definitions

  describe('Clicking the button#previous element', () => {
    beforeEach(() => {
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = req => requests.push(req);
    });

    afterEach(() => {
      xhr.restore();
      resetFixtures();
    });

    it('sends a GET request to the "/games" route', () => {
      previousButton.click();

      expect(requests[0].method).to.equal('GET');
      expect(requests[0].url).to.equal('/games');
    });

    context('when no previously-saved games exist in the database', () => {
      it('does not add any children to the div#games element in the DOM', () => {
        previousButton.click();

        requests[0].respond(
          200,
          { 'Content-Type': 'application/json' },
          jsonifyGames([])
        );

        expect(gamesDiv.children.length).to.equal(0);
      });
    });

    context('when previously-saved games exist in the database', () => {
      it("adds those previous games as buttons in the DOM's div#games element", () => {
        previousButton.click();

        requests[0].respond(
          200,
          { 'Content-Type': 'application/json' },
          jsonifyGames([
            ['', '', '', '', '', '', '', '', ''],
            ['O', 'X', 'O', '', 'X', 'X', '', 'X', 'O'] // 'X' wins
          ])
        );

        const gameButtons = Array.from(gamesDiv.children).filter(c => c.tagName === 'BUTTON');

        expect(gameButtons.length).to.equal(2);
      });

      it('does not re-add saved games already present in the div#games element when the "previous" button is clicked a second time', () => {
        previousButton.click();

        requests[0].respond(
          200,
          { 'Content-Type': 'application/json' },
          jsonifyGames([
            ['', '', '', '', '', '', '', '', ''],
            ['O', 'X', 'O', '', 'X', 'X', '', 'X', 'O'], // 'X' wins
            ['X', 'X', 'O', 'O', 'O', 'X', 'X', 'X', 'O'] // Tie game
          ])
        );

        previousButton.click();

        requests[1].respond(
          200,
          { 'Content-Type': 'application/json' },
          jsonifyGames([
            ['', '', '', '', '', '', '', '', ''],
            ['O', 'X', 'O', '', 'X', 'X', '', 'X', 'O'], // 'X' wins
            ['X', 'X', 'O', 'O', 'O', 'X', 'X', 'X', 'O'], // Tie game
            ['O', 'X', '', '', '', '', '', '', ''] // In-progress
          ])
        );

        const gameButtons = Array.from(gamesDiv.children).filter(c => c.tagName === 'BUTTON');

        expect(gameButtons.length).to.equal(4);
      });
    });
  });

  describe('Clicking the button#save element', () => {
    beforeEach(() => {
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = req => requests.push(req);
    });

    afterEach(() => {
      xhr.restore();
      resetFixtures();
    });

    context('when the current game has not yet been saved', () => {
      it('sends a POST request to the "/games" route', () => {
        saveButton.click();

        expect(requests[0].method).to.equal('POST');
        expect(requests[0].url).to.equal('/games');
      });
    });

    context('when the current game already exists in the database', () => {
      it('sends a PATCH request to the "/games/:id" route', () => {
        saveButton.click();

        requests[0].respond(
          201,
          { 'Content-Type': 'application/json' },
          jsonifyGame(['', '', '', '', '', '', '', '', ''])
        );

        saveButton.click();

        expect(requests[0].method).to.equal('POST');
        expect(requests[0].url).to.equal('/games');

        expect(requests[1].method).to.equal('PATCH');
        expect(requests[1].url).to.equal('/games/1');
      });
    });
  });

  describe('Clicking the button#clear element', () => {
    beforeEach(() => {
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = req => requests.push(req);
    });

    afterEach(() => {
      xhr.restore();
      resetFixtures();
    });

    context('when an unsaved game is in progress', () => {
      it('clears the game board', () => {
        squares[8].innerHTML = 'X';
        window.turn = 1;

        clearButton.click();

        const board = Array.from(squares).map(s => s.innerHTML);

        expect(board).to.have.members(['', '', '', '', '', '', '', '', '']);
        expect(window.turn).to.equal(0);
      });

      it('does not save the cleared game', () => {
        clearButton.click();

        expect(requests).to.be.empty;
      });
    });

    context('when the in-progress game has already been saved', () => {
      it('fully resets the game board so that the next press of the "save" button results in a new game being saved', () => {
        saveButton.click();

        requests[0].respond(
          201,
          { 'Content-Type': 'application/json' },
          jsonifyGame(['', '', '', '', '', '', '', '', ''])
        );

        clearButton.click();

        saveButton.click();

        expect(requests[1].method).to.equal('POST');
        expect(requests[1].url).to.equal('/games');
      });
    });
  });

  describe('Completing a game', () => {
    beforeEach(() => {
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = req => requests.push(req);
    });

    afterEach(() => {
      xhr.restore();
      resetFixtures();
    });

    it('auto-saves tie games', () => {
      populateBoard(['X', 'O', 'X', 'X', 'O', 'X', 'O', '', 'O']);
      //  X | O | X
      // -----------
      //  X | O | X
      // -----------
      //  O |   | O

      window.turn = 8;
      window.doTurn(squares[7]);

      expect(requests[0].method).to.equal('POST');
      expect(requests[0].url).to.equal('/games');
    });

    it('auto-saves won games', () => {
      populateBoard(['X', 'X', '', '', '', '', 'O', 'O', '']);
      window.turn = 4;
      //  X | X |
      // -----------
      //    |   |
      // -----------
      //  O | O |

      squares[2].click();

      expect(requests[0].method).to.equal('POST');
      expect(requests[0].url).to.equal('/games');
    });
  });

  describe('Clicking a saved game button (in the div#games element)', () => {
    beforeEach(() => {
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = req => requests.push(req);
    });

    afterEach(() => {
      xhr.restore();
      resetFixtures();
    });

    it('sends a GET request to the "/games/:id" route', () => {
      previousButton.click();

      requests[0].respond(
        200,
        { 'Content-Type': 'application/json' },
        jsonifyGames([
          ['', '', '', '', 'X', '', '', 'O', '']
        ])
      );

      const gameButtons = Array.from(gamesDiv.children).filter(c => c.tagName === 'BUTTON');

      gameButtons[0].click();

      expect(requests[1].method).to.equal('GET');
      expect(requests[1].url).to.equal('/games/1');
    });

    it("loads the saved game's state into the board", () => {
      previousButton.click();

      requests[0].respond(
        200,
        { 'Content-Type': 'application/json' },
        jsonifyGames([
          ['', '', '', '', 'X', '', '', 'O', '']
        ])
      );

      const gameButtons = Array.from(gamesDiv.children).filter(c => c.tagName === 'BUTTON');

      gameButtons[0].click();

      requests[1].respond(
        200,
        { 'Content-Type': 'application/json' },
        jsonifyGame(['', '', '', '', 'X', '', '', 'O', ''])
      );

      const board = Array.from(squares).map(s => s.innerHTML);

      expect(board).to.have.ordered.members(['', '', '', '', 'X', '', '', 'O', '']);
      expect(window.turn).to.equal(2);
    });

    it('marks the newly-loaded game state such that clicking the "save" button after loading a game sends a PATCH request', () => {
      previousButton.click();

      requests[0].respond(
        200,
        { 'Content-Type': 'application/json' },
        jsonifyGames([
          ['', '', '', '', 'X', '', '', 'O', '']
        ])
      );

      const gameButtons = Array.from(gamesDiv.children).filter(c => c.tagName === 'BUTTON');

      gameButtons[0].click();

      requests[1].respond(
        200,
        { 'Content-Type': 'application/json' },
        jsonifyGame(['', '', '', '', 'X', '', '', 'O', ''])
      );

      saveButton.click();

      expect(requests[2].method).to.equal('PATCH');
      expect(requests[2].url).to.equal('/games/1');
    });
  });
});
