const Game = require('../src/game');
const { expect } = require('chai');

const empty = 0;
const activeGameId = 'active-game-1';
const activeGame = { ID: 'active-game-1', winner: 0 };
const finishedGame = { ID: 'finished-game-1', winner: 1 };

describe('Game Logic', () => {

	describe('Create Game', () => {

		test('should fail when another active game exists', async () => {
			const mockRepository = new MockRepository([activeGame]);
			const game = new Game(mockRepository);
			try {
				await game.validate();
				throw new Error('Expected error was not thrown');
			} catch (error) {
				expect(error.message).to.equal('An active game already exists. Finish the current game before creating a new one.');
			}
		});

		test('should create game', async () => {
			const mockRepository = new MockRepository([]);
			const game = new Game(mockRepository);
			await game.validate();
			expect(true).to.be.true;
		});

	});

	describe('Board Creation', () => {

		async function createGameInitializeBoardCells() {
			const mockRepository = new MockRepository([activeGame]);
			const game = new Game(mockRepository);
			await game.initializeBoardCells();
			return game;
		}

		test('should create a 3x3 board with 9 cells', async () => {
			const game = await createGameInitializeBoardCells();
			expect(game.repository.boardCells).to.have.length(9);
		});

		test('should initialize all cells as empty', async () => {
			const game = await createGameInitializeBoardCells();
			game.repository.boardCells.forEach(cell => {
				expect(cell.value).to.equal(empty);
			});
		});

		test('should create cells with correct positions', async () => {
			const game = await createGameInitializeBoardCells();
			game.repository.boardCells.forEach(cell => {
				expect(cell.row).to.be.at.least(0);
				expect(cell.row).to.be.below(3);
				expect(cell.col).to.be.at.least(0);
				expect(cell.col).to.be.below(3);
			});
		});

		test('should assign game_ID to all cells', async () => {
			const game = await createGameInitializeBoardCells();
			game.repository.boardCells.forEach(cell => {
				expect(cell.game_ID).to.equal(activeGame.ID);
			});
		});
	});

	describe('Delete Game', () => {

		test('should allow deletion of active game', async () => {
			const mockRepository = new MockRepository([activeGame]);
			const game = new Game(mockRepository);
			const isActive = await game.isActive(activeGameId);
			expect(isActive).to.be.true;
		});

		test('should not allow deletion of finished game', async () => {
			const mockRepository = new MockRepository([finishedGame]);
			const game = new Game(mockRepository);
			const isActive = await game.isActive(activeGameId);
			expect(isActive).to.be.false;
		});
		
	});

});

class MockRepository {
	constructor(activeGames) {
		this.activeGames = activeGames;
		this.boardCells = [];
	}

	async getActiveGame() {
		return this.activeGames[0] || null;
	}

	async createBoardCells(cells) {
		this.boardCells = cells;
	}

	async getGameById() {
		return this.activeGames[0];
	}
}