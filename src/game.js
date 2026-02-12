boardSize = 3;
empty = 0;

class Game {
	constructor(repository) {
		this.board = [];
		this.repository = repository;
		if (!this.repository) {
			throw new Error('Repository not provided');
		}
	}

	async isActive(gameId) {
		const game = await this.repository.getGameById(gameId);
		return game?.winner === 0;
	}

	async validate() {
		if (await this.existsAnActiveGame()) {
			throw new Error('An active game already exists. Finish the current game before creating a new one.');
		}
	}

	async existsAnActiveGame() {
		return Boolean(await this.repository.getActiveGame());
	}

	async initializeBoardCells() {
		const activeGame = await this.repository.getActiveGame();
		this.board = this.createBoard(activeGame.ID);
		return await this.repository.createBoardCells(this.board);
	}

	createBoard(gameId) {
		const board = [];
		for (let row = 0; row < boardSize; row++) {
			for (let col = 0; col < boardSize; col++) {
				board.push({
					game_ID: gameId,
					row: row,
					col: col,
					value: empty
				});
			}
		}
		return board;
	}
}

module.exports = Game;
