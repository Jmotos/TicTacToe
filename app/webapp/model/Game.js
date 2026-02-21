sap.ui.define([
	"./Cell", "./Rules"
], function (Cell, Rules) {
	"use strict";

	const empty = 0;
	const boardSize = 3;
	const player1 = 1;
	const player2 = 2;

	return class Game {
		constructor(repository, id, player1, player2, active, activePlayer, winner, board = []) {
			this.repository = repository;
			this.rules = new Rules();
			this.ID = id;
			this.player1 = player1 || "";
			this.player2 = player2 || "";
			this.active = active || false;
			this.winner = winner || 0;
			this.activePlayer = activePlayer || 0;
			this.board = this._initializeBoard(board);
		}

		createNewGame() {
			this.activePlayer = this._getRandomStartingPlayer();
			return this.repository.createNewGame(this._getOdataObject()).then(function(createdGame) {
				return new Game(this.repository, createdGame.ID, createdGame.player1, createdGame.player2, true, createdGame.activePlayer, createdGame.winner, createdGame.board);
			}.bind(this));
		}

		loadActiveGame() {
			return this.repository.getActiveGame().then((activeGame) => {
				if (!activeGame) {
					return null;
				}
				return new Game(this.repository, activeGame.ID, activeGame.player1, activeGame.player2, true, activeGame.activePlayer, activeGame.winner, activeGame.board);
			});
		}

		_initializeBoard(boardData) {
			const board = Array(boardSize).fill(null).map((_, row) =>
				Array(boardSize).fill(null).map((__, col) => new Cell(null, row, col, empty))
			);

			if (!boardData.length) {
				return board;
			}

			boardData.forEach((cellData) => {
				board[cellData.row][cellData.col] = new Cell(
					cellData.ID ?? null,
					cellData.row,
					cellData.col,
					cellData.value ?? empty
				);
			});

			return board;
		}

		validatePlayers() {
			if (this.player1?.trim() === "" || this.player2?.trim() === "") {
				return {
					valid: false,
					message: "msgErrorEmptyNames"
				};
			}

			if (this.player1 === this.player2) {
				return {
					valid: false,
					message: "msgErrorSameNames"
				};
			}

			return { valid: true };
		}

		_getOdataObject() {
			return {
				player1: this.player1,
				player2: this.player2,
				activePlayer: this.activePlayer,
			};
		}

		reset() {
			return this.repository.deleteGame(this.ID);
		}

		_getRandomStartingPlayer() {
			return Math.random() < 0.5 ? player1 : player2;
		}

		clickCell(row, col) {
			const cell = this.board[row][col];
			const currentPlayer = this.activePlayer;
			const nextPlayer = this.activePlayer === player1 ? player2 : player1;

			return this.repository.updateMove(cell.ID, this.ID, currentPlayer, nextPlayer)
				.then(function(data) {
					this.activePlayer = data.game.activePlayer;
					cell.value = data.cell.value;
					const status = this.rules.getStatus(this.board, cell);
					this.winner = status.winner;
					return status;
				}.bind(this));
		}

	}
});