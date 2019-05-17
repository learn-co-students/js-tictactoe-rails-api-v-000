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
        this.currentGameId = null;
        this.turn = 0;
        this.root_url = "/games/";
        this.board = new Board();
        this.player = new Player(this.turn);
    }
    showGame(elem) {
        $.get(this.root_url + elem.id, function(game) {
            let savedGame = game.data.attributes["state"];
            this.currentGameId = game.data.id;
            this.turn = savedGame.filter((cell) => !!cell).length
            $("table tr td").map(function(index) { return $(this).text(savedGame[index]) });
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
        if (!!this.currentGameId) {
            this.$put(`${this.root_url}/${this.currentGameId}`, { state: board });
        } else {
            $.post(this.root_url, { state: boardState }, function(savedGame) {
                this.currentGameId = savedGame.data.id;
            })
        }
    }
    resetGame() {
        this.currentGameId = null;
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