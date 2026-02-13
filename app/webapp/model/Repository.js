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
				return context.getObject();
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
	}

});