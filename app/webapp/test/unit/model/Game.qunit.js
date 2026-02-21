sap.ui.define(["com/trifork/tictactoe/model/Game"], function (Game) {
	"use strict";

	const playerNames = ["Alice", "Bob"];
	const emptyPlayerName = "";
	const fullSpacesPlayerName = "   ";
	const gameId = "test-game-123";
	const initialActivePlayer = 0;
	const noWinner = 0;

	function createMockRepository() {
		return {
			getActiveGame: function () {
				return Promise.resolve(null);
			},
			deleteGame: function () {
				return Promise.resolve();
			},
			createNewGame: function () {
				return Promise.resolve({ ID: gameId });
			}
		};
	}

	function createNewGame(repository, active = false, boardData = []) {
		return new Game(repository, gameId, playerNames[0], playerNames[1], active, initialActivePlayer, noWinner, boardData);
	};

	QUnit.module("Game Model", function () {
		QUnit.module("constructor", function (hooks) {
			hooks.beforeEach(function () {
				this.mockRepository = createMockRepository();
			});

			QUnit.test("initializes with default values", function (assert) {
				const game = new Game(this.mockRepository, gameId, playerNames[0], playerNames[1], true);

				assert.strictEqual(game.ID, gameId, "ID is set correctly");
				assert.strictEqual(game.player1, playerNames[0], "player1 is set correctly");
				assert.strictEqual(game.player2, playerNames[1], "player2 is set correctly");
				assert.strictEqual(game.active, true, "active is set correctly");
				assert.ok(Array.isArray(game.board), "board is an array");
				assert.strictEqual(game.board.length, 3, "board has 3 rows");
				assert.strictEqual(game.board[0].length, 3, "board has 3 columns");
			});

			QUnit.test("initializes empty board when no board data provided", function (assert) {
				const game = new Game(this.mockRepository, gameId, playerNames[0], playerNames[1], false);

				assert.strictEqual(game.board[0][0].value, 0, "board cell [0][0] is empty");
				assert.strictEqual(game.board[0][1].value, 0, "board cell [0][1] is empty");
				assert.strictEqual(game.board[0][2].value, 0, "board cell [0][2] is empty");
				assert.strictEqual(game.board[1][0].value, 0, "board cell [1][0] is empty");
				assert.strictEqual(game.board[1][1].value, 0, "board cell [1][1] is empty");
				assert.strictEqual(game.board[1][2].value, 0, "board cell [1][2] is empty");
				assert.strictEqual(game.board[2][0].value, 0, "board cell [2][0] is empty");
				assert.strictEqual(game.board[2][1].value, 0, "board cell [2][1] is empty");
				assert.strictEqual(game.board[2][2].value, 0, "board cell [2][2] is empty");
			});

			QUnit.test("initializes board with provided data", function (assert) {
				const boardData = [
					{ row: 0, col: 0, value: 1 },
					{ row: 0, col: 1, value: 0 },
					{ row: 0, col: 2, value: 0 },
					{ row: 1, col: 0, value: 0 },
					{ row: 1, col: 1, value: 2 },
					{ row: 1, col: 2, value: 0 },
					{ row: 2, col: 0, value: 0 },
					{ row: 2, col: 1, value: 0 },
					{ row: 2, col: 2, value: 1 },
				];
				const game = createNewGame(this.mockRepository, true, boardData);

				assert.strictEqual(game.board[0][0].value, boardData[0].value, "board cell [0][0] has correct value");
				assert.strictEqual(game.board[0][1].value, boardData[1].value, "board cell [0][1] has correct value");
				assert.strictEqual(game.board[0][2].value, boardData[2].value, "board cell [0][2] has correct value");
				assert.strictEqual(game.board[1][0].value, boardData[3].value, "board cell [1][0] has correct value");
				assert.strictEqual(game.board[1][1].value, boardData[4].value, "board cell [1][1] has correct value");
				assert.strictEqual(game.board[1][2].value, boardData[5].value, "board cell [1][2] has correct value");
				assert.strictEqual(game.board[2][0].value, boardData[6].value, "board cell [2][0] has correct value");
				assert.strictEqual(game.board[2][1].value, boardData[7].value, "board cell [2][1] has correct value");
				assert.strictEqual(game.board[2][2].value, boardData[8].value, "board cell [2][2] has correct value");
			});
		});

		QUnit.module("validatePlayers", function (hooks) {
			hooks.beforeEach(function () {
				this.mockRepository = createMockRepository();
			});

			QUnit.test("returns valid for different non-empty names", function (assert) {
				const game = new Game(this.mockRepository, gameId, playerNames[0], playerNames[1], false);
				const result = game.validatePlayers();

				assert.strictEqual(result.valid, true, "validation passes for different names");
			});

			QUnit.test("returns error for empty player1", function (assert) {
				const game = new Game(this.mockRepository, gameId, emptyPlayerName, playerNames[1], false);
				const result = game.validatePlayers();

				assert.strictEqual(result.valid, false, "validation fails for empty player1");
				assert.strictEqual(result.message, "msgErrorEmptyNames", "returns correct error message");
			});

			QUnit.test("returns error for empty player2", function (assert) {
				const game = new Game(this.mockRepository, gameId, playerNames[0], emptyPlayerName, false);
				const result = game.validatePlayers();

				assert.strictEqual(result.valid, false, "validation fails for empty player2");
				assert.strictEqual(result.message, "msgErrorEmptyNames", "returns correct error message");
			});

			QUnit.test("returns error for whitespace-only names", function (assert) {
				const game = new Game(this.mockRepository, gameId, fullSpacesPlayerName, playerNames[1], false);
				const result = game.validatePlayers();

				assert.strictEqual(result.valid, false, "validation fails for whitespace-only player1");
				assert.strictEqual(result.message, "msgErrorEmptyNames", "returns correct error message");
			});

			QUnit.test("returns error for same names", function (assert) {
				const game = new Game(this.mockRepository, gameId, playerNames[1], playerNames[1], false);
				const result = game.validatePlayers();

				assert.strictEqual(result.valid, false, "validation fails for same names");
				assert.strictEqual(result.message, "msgErrorSameNames", "returns correct error message");
			});
		});

		QUnit.module("createNewGame", function (hooks) {
			hooks.beforeEach(function () {
				this.mockRepository = createMockRepository();
			});

			QUnit.test("calls repository with correct data", function (assert) {
				const done = assert.async();
				let createData = null;

				this.mockRepository.createNewGame = function (data) {
					createData = data;
					return Promise.resolve({ ID: gameId });
				};

				const game = createNewGame(this.mockRepository);

				game.createNewGame().then(function (newGame) {
					assert.ok(createData, "repository createNewGame was called");
					assert.strictEqual(createData.player1, playerNames[0], "player1 is sent correctly");
					assert.strictEqual(createData.player2, playerNames[1], "player2 is sent correctly");
					assert.strictEqual(newGame.ID, gameId, "ID is set to returned value");
					done();
				});
			});
		});

		QUnit.module("loadActiveGame", function (hooks) {
			hooks.beforeEach(function () {
				this.mockRepository = createMockRepository();
			});

			QUnit.test("returns null when no active game", function (assert) {
				const done = assert.async();
				const game = new Game(this.mockRepository);

				game.loadActiveGame().then(function (result) {
					assert.strictEqual(result, null, "returns null when no active game");
					done();
				});
			});

			QUnit.test("returns Game instance when active game exists", function (assert) {
				const done = assert.async();
				const activeGameData = {
					ID: gameId,
					player1: playerNames[0],
					player2: playerNames[1],
					board: [
						{ row: 0, col: 0, value: 0 }
					]
				};

				this.mockRepository.getActiveGame = function () {
					return Promise.resolve(activeGameData);
				};

				const game = new Game(this.mockRepository);

				game.loadActiveGame().then(function (result) {
					assert.ok(result instanceof Game, "returns a Game instance");
					assert.strictEqual(result.ID, gameId, "Game has correct ID");
					assert.strictEqual(result.player1, playerNames[0], "Game has correct player1");
					assert.strictEqual(result.player2, playerNames[1], "Game has correct player2");
					assert.strictEqual(result.active, true, "Game is marked as active");
					assert.strictEqual(result.board[0][0].value, 0, "Game board is initialized correctly");
					done();
				});
			});
		});

		QUnit.module("reset", function (hooks) {
			hooks.beforeEach(function () {
				this.mockRepository = createMockRepository();
			});

			QUnit.test("calls repository deleteGame with game ID", function (assert) {
				const done = assert.async();
				let deletedGameId = null;

				this.mockRepository.deleteGame = function (id) {
					deletedGameId = id;
					return Promise.resolve();
				};

				const game = new Game(this.mockRepository, gameId, playerNames[0], playerNames[1], true);

				game.reset().then(function () {
					assert.strictEqual(deletedGameId, gameId, "deleteGame called with game ID");
					done();
				});
			});
		});

		QUnit.module("clickCell", function (hooks) {
			hooks.beforeEach(function () {
				this.mockRepository = createMockRepository();
			});

			QUnit.test("updates activePlayer from repository response", function (assert) {
				const done = assert.async();
				const initialPlayer = 1;
				const nextPlayer = 2;
				const boardData = [
					{ ID: gameId, row: 1, col: 1, value: initialPlayer }
				];

				this.mockRepository.updateMove = function () {
					return Promise.resolve({
						cell: { value: nextPlayer },
						game: { activePlayer: nextPlayer }
					});
				};

				const game = createNewGame(this.mockRepository, true, boardData);

				game.clickCell(1, 1).then(function () {
					assert.strictEqual(game.activePlayer, nextPlayer, "activePlayer is updated to 2");
					done();
				});
			});

			QUnit.test("updates clicked cell value from repository response", function (assert) {
				const done = assert.async();
				const initialPlayer = 1;
				const nextPlayer = 2;
				const boardData = [
					{ ID: gameId, row: 1, col: 1, value: initialPlayer }
				];

				this.mockRepository.updateMove = function () {
					return Promise.resolve({
						cell: { value: nextPlayer },
						game: { activePlayer: nextPlayer }
					});
				};

				const game = createNewGame(this.mockRepository, true, boardData);

				game.clickCell(1, 1).then(function () {
					assert.strictEqual(game.board[1][1].value, nextPlayer, "clicked cell value is updated to 2");
					done();
				});
			});

			function _checkWinner(assert, mockRepository, boardData, clickedCell) {
				const done = assert.async();
				const player1 = 1;
				const nextPlayer = 2;

				mockRepository.updateMove = function () {
					return Promise.resolve({
						cell: { value: player1 },
						game: { activePlayer: nextPlayer }
					});
				};

				const game = createNewGame(mockRepository, true, boardData);

				game.clickCell(clickedCell.row, clickedCell.col).then(function (status) {
					assert.strictEqual(status.winner, player1, "player 1 wins");
					assert.strictEqual(status.draw, false, "it is not a draw");
					done();
				});
			}

			QUnit.test("there is no winner after click when there are less than 5 filled cells", function (assert) {
				const done = assert.async();
				const boardData = [
					{ ID: "00", row: 0, col: 0, value: 0 },
					{ ID: "01", row: 0, col: 1, value: 1 },
					{ ID: "10", row: 1, col: 0, value: 2 },
					{ ID: "11", row: 1, col: 1, value: 1 }
				];

				this.mockRepository.updateMove = function () {
					return Promise.resolve({
						cell: { value: 1 },
						game: { activePlayer: 2 }
					});
				};

				const game = createNewGame(this.mockRepository, true, boardData);

				game.clickCell(0, 0).then(function (status) {
					assert.strictEqual(status.winner, 0, "there is no winner");
					assert.strictEqual(status.draw, false, "it is not a draw");
					done();
				});
			});

			QUnit.test("player wins when fills column 00-10-20", function (assert) {
				const clickedCell = { row: 0, col: 0};
				const boardData = [
					{ ID: "00", row: 0, col: 0, value: 0 },
					{ ID: "01", row: 0, col: 1, value: 2 },
					{ ID: "02", row: 0, col: 2, value: 2 },
					{ ID: "10", row: 1, col: 0, value: 1 },
					{ ID: "11", row: 1, col: 1, value: 0 },
					{ ID: "12", row: 1, col: 2, value: 0 },
					{ ID: "20", row: 2, col: 0, value: 1 },
					{ ID: "21", row: 2, col: 1, value: 0 },
					{ ID: "22", row: 2, col: 2, value: 0 },
				];

				_checkWinner(assert, this.mockRepository, boardData, clickedCell);
			});

			QUnit.test("player wins when fills column 01-11-21", function (assert) {
				const clickedCell = { row: 0, col: 1};
				const boardData = [
					{ ID: "00", row: 0, col: 0, value: 2 },
					{ ID: "01", row: 0, col: 1, value: 0 },
					{ ID: "02", row: 0, col: 2, value: 2 },
					{ ID: "10", row: 1, col: 0, value: 0 },
					{ ID: "11", row: 1, col: 1, value: 1 },
					{ ID: "12", row: 1, col: 2, value: 0 },
					{ ID: "20", row: 2, col: 0, value: 0 },
					{ ID: "21", row: 2, col: 1, value: 1 },
					{ ID: "22", row: 2, col: 2, value: 0 },
				];

				_checkWinner(assert, this.mockRepository, boardData, clickedCell);
			});

			QUnit.test("player wins when fills column 02-12-22", function (assert) {
				const clickedCell = { row: 0, col: 2};
				const boardData = [
					{ ID: "00", row: 0, col: 0, value: 2 },
					{ ID: "01", row: 0, col: 1, value: 2 },
					{ ID: "02", row: 0, col: 2, value: 0 },
					{ ID: "10", row: 1, col: 0, value: 0 },
					{ ID: "11", row: 1, col: 1, value: 0 },
					{ ID: "12", row: 1, col: 2, value: 1 },
					{ ID: "20", row: 2, col: 0, value: 0 },
					{ ID: "21", row: 2, col: 1, value: 0 },
					{ ID: "22", row: 2, col: 2, value: 1 },
				];

				_checkWinner(assert, this.mockRepository, boardData, clickedCell);
			});

			QUnit.test("player wins when fills row 00-01-02", function (assert) {
				const clickedCell = { row: 0, col: 0};
				const boardData = [
					{ ID: "00", row: 0, col: 0, value: 0 },
					{ ID: "01", row: 0, col: 1, value: 1 },
					{ ID: "02", row: 0, col: 2, value: 1 },
					{ ID: "10", row: 1, col: 0, value: 0 },
					{ ID: "11", row: 1, col: 1, value: 0 },
					{ ID: "12", row: 1, col: 2, value: 2 },
					{ ID: "20", row: 2, col: 0, value: 0 },
					{ ID: "21", row: 2, col: 1, value: 0 },
					{ ID: "22", row: 2, col: 2, value: 2 },
				];

				_checkWinner(assert, this.mockRepository, boardData, clickedCell);
			});

			QUnit.test("player wins when fills row 10-11-12", function (assert) {
				const clickedCell = { row: 1, col: 0};
				const boardData = [
					{ ID: "00", row: 0, col: 0, value: 0 },
					{ ID: "01", row: 0, col: 1, value: 2 },
					{ ID: "02", row: 0, col: 2, value: 2 },
					{ ID: "10", row: 1, col: 0, value: 0 },
					{ ID: "11", row: 1, col: 1, value: 1 },
					{ ID: "12", row: 1, col: 2, value: 1 },
					{ ID: "20", row: 2, col: 0, value: 0 },
					{ ID: "21", row: 2, col: 1, value: 0 },
					{ ID: "22", row: 2, col: 2, value: 0 },
				];

				_checkWinner(assert, this.mockRepository, boardData, clickedCell);
			});

			QUnit.test("player wins when fills row 20-21-22", function (assert) {
				const clickedCell = { row: 2, col: 0};
				const boardData = [
					{ ID: "00", row: 0, col: 0, value: 0 },
					{ ID: "01", row: 0, col: 1, value: 2 },
					{ ID: "02", row: 0, col: 2, value: 2 },
					{ ID: "10", row: 1, col: 0, value: 0 },
					{ ID: "11", row: 1, col: 1, value: 0 },
					{ ID: "12", row: 1, col: 2, value: 0 },
					{ ID: "20", row: 2, col: 0, value: 0 },
					{ ID: "21", row: 2, col: 1, value: 1 },
					{ ID: "22", row: 2, col: 2, value: 1 },
				];

				_checkWinner(assert, this.mockRepository, boardData, clickedCell);
			});

			QUnit.test("player wins when fills diagonal 00-11-22", function (assert) {
				const clickedCell = { row: 2, col: 2};
				const boardData = [
					{ ID: "00", row: 0, col: 0, value: 1 },
					{ ID: "01", row: 0, col: 1, value: 0 },
					{ ID: "02", row: 0, col: 2, value: 2 },
					{ ID: "10", row: 1, col: 0, value: 0 },
					{ ID: "11", row: 1, col: 1, value: 1 },
					{ ID: "12", row: 1, col: 2, value: 2 },
					{ ID: "20", row: 2, col: 0, value: 0 },
					{ ID: "21", row: 2, col: 1, value: 0 },
					{ ID: "22", row: 2, col: 2, value: 0 },
				];

				_checkWinner(assert, this.mockRepository, boardData, clickedCell);
			});

			QUnit.test("player wins when fills diagonal 02-11-20", function (assert) {
				const clickedCell = { row: 2, col: 0};
				const boardData = [
					{ ID: "00", row: 0, col: 0, value: 0 },
					{ ID: "01", row: 0, col: 1, value: 2 },
					{ ID: "02", row: 0, col: 2, value: 1 },
					{ ID: "10", row: 1, col: 0, value: 0 },
					{ ID: "11", row: 1, col: 1, value: 1 },
					{ ID: "12", row: 1, col: 2, value: 2 },
					{ ID: "20", row: 2, col: 0, value: 0 },
					{ ID: "21", row: 2, col: 1, value: 0 },
					{ ID: "22", row: 2, col: 2, value: 0 },
				];

				_checkWinner(assert, this.mockRepository, boardData, clickedCell);
			});

			QUnit.test("there is a draw when the board is filled and not any player wins", function (assert) {
				const done = assert.async();
				const player1 = 1;
				const nextPlayer = 2;
				const clickedCell = { row: 2, col: 1};
				const boardData = [
					{ ID: "00", row: 0, col: 0, value: 1 },
					{ ID: "01", row: 0, col: 1, value: 2 },
					{ ID: "02", row: 0, col: 2, value: 1 },
					{ ID: "10", row: 1, col: 0, value: 2 },
					{ ID: "11", row: 1, col: 1, value: 2 },
					{ ID: "12", row: 1, col: 2, value: 1 },
					{ ID: "20", row: 2, col: 0, value: 1 },
					{ ID: "21", row: 2, col: 1, value: 0 },
					{ ID: "22", row: 2, col: 2, value: 2 },
				];

				this.mockRepository.updateMove = function () {
					return Promise.resolve({
						cell: { value: player1 },
						game: { activePlayer: nextPlayer }
					});
				};

				const game = createNewGame(this.mockRepository, true, boardData);

				game.clickCell(clickedCell.row, clickedCell.col).then(function (status) {
					assert.strictEqual(status.winner, noWinner, "there is not any winner");
					assert.strictEqual(status.draw, true, "it is a draw");
					done();
				});
			});


		});
	});
});
