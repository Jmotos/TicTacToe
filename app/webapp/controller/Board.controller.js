sap.ui.define([
	"./BaseController", "sap/m/MessageBox", "sap/ui/model/json/JSONModel", "../model/Game", "../model/Repository"
], function (BaseController, MessageBox, JSONModel, Game, Repository) {
	"use strict";

	const gameModelName = "game";

	return BaseController.extend("com.trifork.tictactoe.controller.Game", {
		onInit: function () {
			const gameModel = this._getGameModel();

			if (gameModel?.getData()) {
				return;
			}

			this._loadActiveGame();
		},

		onCellPress: function (event, row, column) {
			const gameModel = this._getGameModel();
			const game = gameModel.getData();
			
			this._setBusy(true);
			game.clickCell(row, column).then(function() {
				gameModel.refresh();
				this._setBusy(false);
			}.bind(this)).catch(function(error) {
				MessageBox.error(error.message);
				this._setBusy(false);
			}.bind(this));
		},

		_loadActiveGame: function() {
			const mainModel = this.getOwnerComponent().getModel();
			const repository = new Repository(mainModel);
			const game = new Game(repository);

			this._setBusy(true);
			game.loadActiveGame().then(function (activeGame) {
				this.getOwnerComponent().setModel(new JSONModel(activeGame), gameModelName);
				this._setBusy(false);
			}.bind(this)).catch(function (error) {
				MessageBox.error(this._getText("msgErrorLoadingGame", [error.message]));
				this._setBusy(false);
			}.bind(this));
		},

		_getText: function (key, args) {
			if (!this.i18n) {
				this.i18n = this.getView().getModel("i18n").getResourceBundle();
			}
			return this.i18n.getText(key, args);
		},

		_getGameModel: function() {
			return this.getOwnerComponent().getModel(gameModelName);
		},

		_setBusy: function(isBusy) {
			this.getView().setBusy(isBusy);
		},
	});
});
