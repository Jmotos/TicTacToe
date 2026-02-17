sap.ui.define([
	"./BaseController", "sap/m/MessageBox", "sap/ui/model/json/JSONModel", "../model/Game", "../model/Repository"
], function (BaseController, MessageBox, JSONModel, Game, Repository) {
	"use strict";

	const gameModelName = "game";
	const boardRoute = "board";

	return BaseController.extend("com.trifork.tictactoe.controller.Main", {
		onInit: function () {
			const game = this._initializeNewGame();

			this._setBusy(true);
			game.loadActiveGame().then(function(activeGame) {
				if (activeGame) {
					this._setGameModel(activeGame);
				}
				this._setBusy(false);
			}.bind(this)).catch(function(error) {
				MessageBox.error(this._getText("msgErrorLoadingGame", [error.message]));
				this._setBusy(false);
			}.bind(this));
		},

		onStartGame: function () {
			const game = this._getGameModel().getData();
			const validation = game.validatePlayers();
			
			if (!validation.valid) {
				MessageBox.error(this._getText(validation.message));
				return;
			}
			
			this._setBusy(true);
			game.createNewGame().then(function() {
				this._getGameModel().refresh();
				this._setBusy(false);
				this.navTo(boardRoute);
			}.bind(this)).catch(function(error) {
				MessageBox.error(this._getText("msgErrorGameCreation", [error.message]));
				this._setBusy(false);
			}.bind(this));
		},

		onNewGame: function () {
			const game = this._getGameModel().getData();
			
			this._setBusy(true);
			game.reset().then(function() { 
				this._initializeNewGame();
				this._setBusy(false);
			}.bind(this)).catch(function(error) {
				MessageBox.error(this._getText("msgErrorDeletingGame", [error.message]));
				this._setBusy(false);
			}.bind(this));
		},

		onContinue: function () {
			this.navTo(boardRoute);
		},

		_initializeNewGame: function() {
			const mainModel = this.getView().getController().getOwnerComponent().getModel();
			const respository = new Repository(mainModel);
			const game = new Game(respository);
			this._setGameModel(game);
			return game;
		},

		_setBusy: function(isBusy) {
			this.getView().setBusy(isBusy);
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

		_setGameModel: function(game) {
			this.getOwnerComponent().setModel(new JSONModel(game), gameModelName);
		}
	});
});
