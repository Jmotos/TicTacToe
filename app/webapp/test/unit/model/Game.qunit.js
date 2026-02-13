sap.ui.define(["com/trifork/tictactoe/model/Game"], function (Game) {
	"use strict";

	const playerNames = ["Alice", "Bob"];
	const emptyPlayerName = "";
	const fullSpacesPlayerName = "   ";
	const gameId = "test-game-123";

	QUnit.module("Game Model", {
		beforeEach: function () {
			this.mockRepository = {
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
	});

	QUnit.test("Constructor initializes with default values", function (assert) {
		const game = new Game(this.mockRepository, gameId, playerNames[0], playerNames[1], true);

		assert.strictEqual(game.ID, gameId, "ID is set correctly");
		assert.strictEqual(game.player1, playerNames[0], "player1 is set correctly");
		assert.strictEqual(game.player2, playerNames[1], "player2 is set correctly");
		assert.strictEqual(game.active, true, "active is set correctly");
		assert.ok(Array.isArray(game.board), "board is an array");
		assert.strictEqual(game.board.length, 3, "board has 3 rows");
		assert.strictEqual(game.board[0].length, 3, "board has 3 columns");
	});

	QUnit.test("Constructor initializes empty board when no board data provided", function (assert) {
		const game = new Game(this.mockRepository, gameId, playerNames[0], playerNames[1], false);

		assert.strictEqual(game.board[0][0], 0, "board cell [0][0] is empty");
		assert.strictEqual(game.board[0][1], 0, "board cell [0][1] is empty");
		assert.strictEqual(game.board[0][2], 0, "board cell [0][2] is empty");
		assert.strictEqual(game.board[1][0], 0, "board cell [1][0] is empty");
		assert.strictEqual(game.board[1][1], 0, "board cell [1][1] is empty");
		assert.strictEqual(game.board[1][2], 0, "board cell [1][2] is empty");
		assert.strictEqual(game.board[2][0], 0, "board cell [2][0] is empty");
		assert.strictEqual(game.board[2][1], 0, "board cell [2][1] is empty");
		assert.strictEqual(game.board[2][2], 0, "board cell [2][2] is empty");
	});

	QUnit.test("Constructor initializes board with provided data", function (assert) {
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
		const game = new Game(this.mockRepository, gameId, playerNames[0], playerNames[1], true, boardData);

		assert.strictEqual(game.board[0][0], boardData[0].value, "board cell [0][0] has correct value");
		assert.strictEqual(game.board[0][1], boardData[1].value, "board cell [0][1] has correct value");
		assert.strictEqual(game.board[0][2], boardData[2].value, "board cell [0][2] has correct value");
		assert.strictEqual(game.board[1][0], boardData[3].value, "board cell [1][0] has correct value");
		assert.strictEqual(game.board[1][1], boardData[4].value, "board cell [1][1] has correct value");
		assert.strictEqual(game.board[1][2], boardData[5].value, "board cell [1][2] has correct value");
		assert.strictEqual(game.board[2][0], boardData[6].value, "board cell [2][0] has correct value");
		assert.strictEqual(game.board[2][1], boardData[7].value, "board cell [2][1] has correct value");
		assert.strictEqual(game.board[2][2], boardData[8].value, "board cell [2][2] has correct value");
	});

	QUnit.test("validatePlayers returns valid for different non-empty names", function (assert) {
		const game = new Game(this.mockRepository, gameId, playerNames[0], playerNames[1], false);
		const result = game.validatePlayers();

		assert.strictEqual(result.valid, true, "validation passes for different names");
	});

	QUnit.test("validatePlayers returns error for empty player1", function (assert) {
		const game = new Game(this.mockRepository, gameId, emptyPlayerName, playerNames[1], false);
		const result = game.validatePlayers();

		assert.strictEqual(result.valid, false, "validation fails for empty player1");
		assert.strictEqual(result.message, "msgErrorEmptyNames", "returns correct error message");
	});

	QUnit.test("validatePlayers returns error for empty player2", function (assert) {
		const game = new Game(this.mockRepository, gameId, playerNames[0], emptyPlayerName, false);
		const result = game.validatePlayers();

		assert.strictEqual(result.valid, false, "validation fails for empty player2");
		assert.strictEqual(result.message, "msgErrorEmptyNames", "returns correct error message");
	});

	QUnit.test("validatePlayers returns error for whitespace-only names", function (assert) {
		const game = new Game(this.mockRepository, gameId, fullSpacesPlayerName, playerNames[1], false);
		const result = game.validatePlayers();

		assert.strictEqual(result.valid, false, "validation fails for whitespace-only player1");
		assert.strictEqual(result.message, "msgErrorEmptyNames", "returns correct error message");
	});

	QUnit.test("validatePlayers returns error for same names", function (assert) {
		const game = new Game(this.mockRepository, gameId, playerNames[1], playerNames[1], false);
		const result = game.validatePlayers();

		assert.strictEqual(result.valid, false, "validation fails for same names");
		assert.strictEqual(result.message, "msgErrorSameNames", "returns correct error message");
	});

	QUnit.test("createNewGame calls repository with correct data", function (assert) {
		const done = assert.async();
		let createData = null;

		this.mockRepository.createNewGame = function (data) {
			createData = data;
			return Promise.resolve({ ID: gameId });
		};

		const game = new Game(this.mockRepository, null, playerNames[0], playerNames[1], false);

		game.createNewGame().then(function () {
			assert.ok(createData, "repository createNewGame was called");
			assert.strictEqual(createData.player1, playerNames[0], "player1 is sent correctly");
			assert.strictEqual(createData.player2, playerNames[1], "player2 is sent correctly");
			assert.strictEqual(game.ID, gameId, "ID is set to returned value");
			done();
		});
	});

	QUnit.test("loadActiveGame returns null when no active game", function (assert) {
		const done = assert.async();
		const game = new Game(this.mockRepository);

		game.loadActiveGame().then(function (result) {
			assert.strictEqual(result, null, "returns null when no active game");
			done();
		});
	});

	QUnit.test("loadActiveGame returns Game instance when active game exists", function (assert) {
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
			assert.strictEqual(result.board[0][0], 0, "Game board is initialized correctly");
			done();
		});
	});

	QUnit.test("reset calls repository deleteGame with game ID", function (assert) {
		const done = assert.async();
		let deletedGameId = null;

		this.mockRepository.deleteGame = function (gameId) {
			deletedGameId = gameId;
			return Promise.resolve();
		};

		const game = new Game(this.mockRepository, gameId, playerNames[0], playerNames[1], true);

		game.reset().then(function () {
			assert.strictEqual(deletedGameId, gameId, "deleteGame called with game ID");
			done();
		});
	});
});
