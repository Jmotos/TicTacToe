sap.ui.define([], function () {
	"use strict";

	const empty = 0;
	const winLength = 3;

	return class Rules {
		getStatus(board, clickedCell) {
			const boardSize = board.length;
			const filledCells = board.flat().filter(cell => cell.value !== empty).length;

			if (filledCells < 5) {
				return { winner: null, draw: false };
			}

			const winnerColumns = this._getWinnerColumns(clickedCell, boardSize);
			if (winnerColumns.every(cell => clickedCell.value === board[cell.row][cell.col].value)) {
				return { winner: clickedCell.value, draw: false };
			}

			const winnerRows = this._getWinnerRows(clickedCell, boardSize);
			if (winnerRows.every(cell => clickedCell.value === board[cell.row][cell.col].value)) {
				return { winner: clickedCell.value, draw: false };
			}

			const winnerMainDiagonals = this._getWinnerMainDiagonals(clickedCell, boardSize);
			if (
				winnerMainDiagonals.length === winLength &&
				winnerMainDiagonals.every(cell => clickedCell.value === board[cell.row][cell.col].value)
			) {
				return { winner: clickedCell.value, draw: false };
			}

			const winnerSecondaryDiagonals = this._getWinnerSecondaryDiagonals(clickedCell, boardSize);
			if (
				winnerSecondaryDiagonals.length === winLength &&
				winnerSecondaryDiagonals.every(cell => clickedCell.value === board[cell.row][cell.col].value)
			) {
				return { winner: clickedCell.value, draw: false };
			}

			if (filledCells === boardSize * boardSize) {
				return { winner: null, draw: true };
			}

			return { winner: null, draw: false };
		}

		_getWinnerColumns(cell, boardSize) {
			const columns = [];

			for (let row = 0; row < boardSize; row++) {
				columns.push({ row: row, col: cell.col });
			}

			return columns;
		}

		_getWinnerRows(cell, boardSize) {
			const rows = [];

			for (let col = 0; col < boardSize; col++) {
				rows.push({ row: cell.row, col: col });
			}

			return rows;
		}

		_getWinnerMainDiagonals(cell, boardSize) {
			const diagonals = [];
			let min = Math.min(cell.row, cell.col);
			const minDiagonal = { row: cell.row - min, col: cell.col - min };

			while (minDiagonal.row < boardSize && minDiagonal.col < boardSize) {
				diagonals.push({ row: minDiagonal.row, col: minDiagonal.col });
				minDiagonal.row++;
				minDiagonal.col++;
			}

			return diagonals;
		}

		_getWinnerSecondaryDiagonals(cell, boardSize) {
			const diagonals = [];
			let min = Math.min(cell.row, cell.col);
			const minDiagonal = { row: cell.row - min, col: cell.col + min };

			while (minDiagonal.row >= 0 && minDiagonal.col < boardSize) {
				diagonals.push({ row: minDiagonal.row, col: minDiagonal.col });
				minDiagonal.row--;
				minDiagonal.col++;
			}

			return diagonals;
		}
	};
});