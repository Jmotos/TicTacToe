sap.ui.define([
], function () {
	"use strict";

	const empty = 0;
	const boardSize = 3;

	return class Game {
		constructor(repository, id, player1, player2, active, board = []) {
			this.repository = repository;
			this.ID = id;
			this.player1 = player1 || "";
			this.player2 = player2 || "";
			this.active = active || false;
			this.board = this._initializeBoard(board);
		}

		createNewGame() {
			return this.repository.createNewGame(this._getOdataObject()).then(function(createdGame) {
				this.ID = createdGame.ID;
			}.bind(this));
		}

		loadActiveGame() {
			return this.repository.getActiveGame().then((activeGame) => {
				if (!activeGame) {
					return null;
				}
				return new Game(this.repository, activeGame.ID, activeGame.player1, activeGame.player2, true, activeGame.board);
			});
		}

		_initializeBoard(boardData) {
			const board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(empty));
			boardData.forEach(cell => {
				board[cell.row][cell.col] = cell.value;
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
				player2: this.player2
			};
		}

		reset() {
			return this.repository.deleteGame(this.ID);
		}

	}
});
