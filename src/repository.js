class Repository {
	constructor(Games, BoardCells) {
		this.Games = Games;
		this.BoardCells = BoardCells;
	}

	async getActiveGame() {
		return await SELECT.one.from(this.Games).columns('ID').where({ winner: 0 });
	}

	async getGameById(gameId) {
		return await SELECT.one.from(this.Games).where({ ID: gameId });
	}

	async createBoardCells(cells) {
		await INSERT.into(this.BoardCells).entries(cells);
	}

	async delete(gameId) {
		await DELETE.from(this.BoardCells).where({ game_ID: gameId });
		return await DELETE.from(this.Games).where({ ID: gameId });
	}
}

module.exports = Repository;
