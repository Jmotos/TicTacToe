sap.ui.define([
	"./BaseController", "sap/m/MessageBox"
], function (BaseController, MessageBox) {
	"use strict";

	const boardRoute = "board";

	return BaseController.extend("com.trifork.tictactoe.controller.Main", {
		onInit: function () {
			const game = this.initializeNewGame();

			this._setBusy(true);
			game.loadActiveGame().then(function(activeGame) {
				if (activeGame) {
					this.setGameModel(activeGame);
				}
				this._setBusy(false);
			}.bind(this)).catch(function(error) {
				MessageBox.error(this._getText("msgErrorLoadingGame", [error.message]));
				this._setBusy(false);
			}.bind(this));
		},

		onStartGame: function () {
			const game = this.getGameModel().getData();
			const validation = game.validatePlayers();
			
			if (!validation.valid) {
				MessageBox.error(this._getText(validation.message));
				return;
			}
			
			this._setBusy(true);
			game.createNewGame().then(function(createdGame) {
				this.setGameModel(createdGame);
				this._setBusy(false);
				this.navTo(boardRoute);
			}.bind(this)).catch(function(error) {
				MessageBox.error(this._getText("msgErrorGameCreation", [error.message]));
				this._setBusy(false);
			}.bind(this));
		},

		onNewGame: function () {
			const game = this.getGameModel().getData();
			
			this._setBusy(true);
			game.reset().then(function() { 
				this.initializeNewGame();
				this._setBusy(false);
			}.bind(this)).catch(function(error) {
				MessageBox.error(this._getText("msgErrorDeletingGame", [error.message]));
				this._setBusy(false);
			}.bind(this));
		},

		onContinue: function () {
			this.navTo(boardRoute);
		},

		_setBusy: function(isBusy) {
			this.getView().setBusy(isBusy);
		},

		_getText: function (key, args) {
			if (!this.i18n) {
				this.i18n = this.getView().getModel("i18n").getResourceBundle();
			}
			return this.i18n.getText(key, args);
		}
	});
});
