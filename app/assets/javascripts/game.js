// #####Object Oriented Design Patturn########
// with updated_at tooltips on game load buttons.

function element(id) {
  return document.getElementById(id);
}
let game;
window.onload = function() {
  game = new Game;
  game.attachListeners();
}


const Game = createGame();

function createGame() {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8], [0,3,6],
    [1,4,7], [2,5,8], [0,4,8], [2,4,6]
  ];

  return class {
    constructor(id=0, board=(new Board), turn=0) {
      this.id = id;
      this.turn = turn;
      this.board = board;
    }

    static new(gameData) {
      if (!!gameData) {
        const board = Board.new(gameData.attributes.state);
        game = new Game(gameData.id, board);
        game.setTurn();
        return game;
      } else {
        game = new Game;
        return game;
      }
    }

    loadGameBtn(gameData) {
      const date = new Date(gameData.attributes['updated-at']);
      const today = new Date(Date.now());
      const formattedDate = (date) => `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
      const updatedTime = `${date.getHours()}:${date.getMinutes()}`;
      const btn = document.createElement("button");
      btn.id = `loadGame-${gameData.id}`;
      btn.innerText = gameData.id;
      btn.title = formattedDate(today) === formattedDate(date) ? updatedTime : formattedDate(date);
      btn.addEventListener("click", this.loadGame(gameData));
      element("games").appendChild(btn);
    }

    loadGame(gameData) {
      return () => {
        const g = Game.new(gameData);
        g.board.setState();
      }
    }

    saveGame() {
      debugger;
      const gameObj = game;
      if (!!gameObj.id) {
        $.ajax({
          type: 'patch',
          url:"/games/"+gameObj.id,
          data:{state:gameObj.board.tokens()}
        });
      } else {
        $.post("/games", {state:gameObj.board.state}, function(g) {
          gameObj.id = g.data.id;
          gameObj.loadGameBtn(g.data)
        });
      }
    }

    player() {
      return !(this.turn % 2) ? "X":"O"
    }

    setTurn() {
      this.board.state.forEach(t => t ? this.turn++ : this.turn)
    }

    setMessage(string) {
      element("message").innerText = string;
    }

    checkWinner(gameObj) {
      var winner = false;
      const board = gameObj.board.tokens()
      winCombos.forEach(c => {
        if (
          board[c[0]] !== "" &&
          board[c[0]] === board[c[1]] &&
          board[c[1]] === board[c[2]]
        ) {
          winner = true;
          this.setMessage("Player "+board[c[0]]+" Won!");
        }
      });
      return winner;
    }

    updateState(elementName) {
      elementName.innerText = this.player()
    }

    doTurn(square) {
      this.updateState(square);
      this.turn++;
      if (this.checkWinner(this)) {
        this.saveGame();
        Game.new();
      } else if (this.turn === 9) {
        setMessage("Tie game.");
        this.saveGame();
        Game.new();
      }
    }
    //#####LISTENERS######
    attachListeners() {
      const g = this
      element("save").addEventListener("click", () => g.saveGame());
      element("previous").addEventListener("click", g.previousGames());
      element("clear").addEventListener("click", g.constructor.new);

      [...(this.board.squares())].forEach(square => square.addEventListener("click", () => {
        if (!this.checkWinner(this) && !square.innerText){
          this.doTurn(square);
        }
      } ));
    }

    previousGames() {
      return () => {
        const g = this;
        const gamesDiv = element("games")
        while (gamesDiv.firstChild) {gamesDiv.removeChild(gamesDiv.firstChild)};
        fetch("/games").then(resp => resp.json()).then(gamesList => {
          gamesList.data.forEach(gameData => g.loadGameBtn(gameData));
        });
      }
    }
  }
}

class Board {
  constructor(state=this.tokens()) {
    this.state = state;
  }

  static new(state) {
    return new Board(state);
  }

  setState() {
    this.squares().forEach((td, i) => {
      td.innerText = this.state[i]
    })
  }

  squares() {
    return [...document.getElementsByTagName("td")];
  }

  tokens() {
    return this.squares().map((square, i) => square.innerText)
  }
}
