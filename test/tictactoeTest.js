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

      expect(spy.firstCall.args[0]).to.equal('Player X Won!');
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

    expect(squares[0].innerHTML).to.equal('O');
    expect(window.turn).to.equal(2);
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
    expect(window.turn).to.equal(0);
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

    expect(board).to.have.ordered.members(['', '', '', '', '', '', '', '', '']);
  });
});
