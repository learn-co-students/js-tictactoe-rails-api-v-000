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


  });
});
