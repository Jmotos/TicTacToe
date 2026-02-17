const cds = require('@sap/cds');
const Repository = require('../src/repository');
const Game = require('../src/game');

module.exports = cds.service.impl(async function () {
	const { Games, BoardCells } = this.entities;
	const repository = new Repository(Games, BoardCells);

	this.before('CREATE', Games, async (req) => {
		const game = new Game(repository);
		try {
			await game.validate();
		} catch (error) {
			req.error(400, error.message);
		}
	});

	this.after('CREATE', Games, async (data, req) => {
		const game = new Game(repository);
		game.initializeBoardCells();
	});

	this.before('DELETE', Games, async (req) => {
		const gameId = req.data.ID;
		const game = new Game(repository);
		if (! await game.isActive(gameId)) {
			req.error(400, 'Only active games can be deleted');
		}
	});
});
