sap.ui.define([
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator"
], function (Filter, FilterOperator) {
	"use strict";

	const oDataEntity = "/Games"

	return class Repository {
		constructor(model) {
			this.model = model;
		}

		createNewGame(data) {
			const binding = this.model.bindList(oDataEntity);
			const context = binding.create(data);
			return context.created().then(() => {
				const createdGame = context.getObject();
				return this._getGameWithBoard(createdGame.ID);
			});
		}

		_getGameWithBoard(gameId) {
			const binding = this.model.bindList(oDataEntity, null, null, [
				new Filter("ID", FilterOperator.EQ, gameId)
			], {
				$expand: "board"
			});

			return binding.requestContexts(0, 1).then((contexts) => {
				return contexts[0]?.getObject();
			});
		}

		getActiveGame() {
			const binding = this.model.bindList(oDataEntity, null, null, [
				new Filter("winner", FilterOperator.EQ, 0)
			], {
				$expand: "board"
			});
			return binding.requestContexts(0, 1).then((contexts) => {
				if (contexts.length === 0) {
					return null;
				}
				return contexts[0].getObject();
			});
		}

		deleteGame(gameId) {
			const listBinding = this.model.bindList(oDataEntity, null, null, [
				new Filter("ID", FilterOperator.EQ, gameId)
			]);

			return listBinding.requestContexts(0, 1).then((contexts) => {
				return contexts[0].delete("$direct");
			});
		}

		updateMove(cellId, gameId, cellValue, nextPlayer) {
			const cellBinding = this.model.bindContext("/BoardCells(" + cellId + ")");
			const gameBinding = this.model.bindContext(oDataEntity + "(" + gameId + ")");

			return Promise.all([
				cellBinding.requestObject(),
				gameBinding.requestObject()
			]).then(() => {
				const cellContext = cellBinding.getBoundContext();
				const gameContext = gameBinding.getBoundContext();

				cellContext.setProperty("value", cellValue);
				gameContext.setProperty("activePlayer", nextPlayer);

				return this.model.submitBatch("$auto").then(() => {
					return {
						cell: {
							value: cellContext.getProperty("value")
						},
						game: {
							activePlayer: gameContext.getProperty("activePlayer")
						}
					};
				});
			});
		}

	}

});