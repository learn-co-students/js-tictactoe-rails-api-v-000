// Code your JavaScript / jQuery solution here
var game;
$(function() {
    game = new Game();
    $("#save").click(() => game.saveGame());
    $("#previous").click(() => game.previousGames());
    $("#clear").click(() => game.resetGame());
});

class Game {
    constructor() {
        this.gameId = null;
        this.turn = 0;
        this.root_url = "/games/";
        this.board = new Board();
        this.player = new Player(this.turn);
    }
    get gameId() {
        return this.currentGameId;
    }
    set gameId(gameId) {
        this.currentGameId = gameId;
    }
    showGame(elem) {
        $.get(this.root_url + elem.id, function(gameState) {
            let savedGame = gameState.data.attributes["state"];
            game = new Game()
            game.gameId = gameState.data.id;
            game.turn = savedGame.filter((cell) => !!cell).length
            game.board.$cells.map(function(index) { return $(this).text(savedGame[index]) });
        })
    }
    previousGames() {
        $.get(this.root_url, function(savedGames) {
            let $games = $("#games");
            if (!!savedGames.data.length) {
                $games.empty();
                savedGames.data.forEach(game => $games.append(`<button id=${game.id} onclick="game.showGame(this)">${game.id}</button></br>`));
            }
        })
    }
    saveGame() {
        let boardState = this.board.$cells.map(function() { return $(this).text() }).get();
        if (!!this.gameId) {
            this.$put(`${this.root_url}/${this.gameId}`, { state: boardState });
        } else {
            $.post(this.root_url, { state: boardState }, function(savedGame) {
                this.gameId = savedGame.data.id;
            })
        }
    }
    resetGame() {
        this.gameId = null;
        this.turn = 0;
        this.board.reset();
    }
    checkWinner() {
        let winnerCombIdx = game.win_comb.find((winning_row) =>
            (winning_row.every((index) => (this.board.$cells[index].innerHTML === 'X') ||
                winning_row.every((index) => this.board.$cells[index].innerHTML === 'O'))));

        if (!!winnerCombIdx) {
            this.setMessage(`Player ${this.board.$cells[winnerCombIdx[0]].innerHTML} Won!`)
        }
        return !!winnerCombIdx;
    }
    doTurn(htmlTd) {
        this.board.updateState(htmlTd, this.player.getToken(this.turn));
        this.turn++;
        if (this.checkWinner()) {
            this.saveGame();
            this.resetGame();
        } else if (this.turn === 9) {
            this.setMessage("Tie game.");
            this.saveGame();
            this.resetGame();
        }
    }

    setMessage(message) {
        return $("div#message").html(message)
    }

    $put(url, data) {
        $.ajax({
            url: url,
            type: 'PATCH',
            data: data,
        });
    }
}

Game.prototype.win_comb = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

class Board {
    constructor() {
        this.$cells = $("table tr td");
        this.attachListeners();
    }
    attachListeners() {
        this.$cells.each(function() {
            $(this).click(function() {
                let isCellFree = !$(this).text();
                let isEndOfGame = game.checkWinner(this.$cells) || this.turn === 9;
                if (isCellFree && !isEndOfGame) {
                    game.doTurn(this);
                }
            })
        });
    }
    reset() {
        this.$cells.empty();
    }
    updateState(htmlTd, token) {
        return (htmlTd.innerHTML = token);
    }

}
class Player {
    getToken(turn) {
        return (turn % 2) ? "O" : "X";
    }
}