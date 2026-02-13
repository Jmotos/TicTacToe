sap.ui.define([
	"./BaseController", "sap/m/MessageBox", "sap/ui/model/json/JSONModel", "../model/Game", "../model/Repository"
], function (BaseController, MessageBox, JSONModel, Game, Repository) {
	"use strict";

	const oDataEntity = "/Games"
	const gameModelName = "game";

	return BaseController.extend("com.trifork.tictactoe.controller.Main", {
		onInit: function () {
			const game = this._initializeNewGame();

			this._setBusy(true);
			game.loadActiveGame().then(function(activeGame) {
				if (activeGame) {
					this.getView().setModel(new JSONModel(activeGame), gameModelName);
				}
				this._setBusy(false);
			}.bind(this)).catch(function(error) {
				MessageBox.error(this._getText("msgErrorLoadingGame", [error.message]));
				this._setBusy(false);
			}.bind(this));
		},

		onStartGame: function () {
			const gameModel = this.getView().getModel(gameModelName);
			const game = gameModel.getData();
			const validation = game.validatePlayers();
			
			if (!validation.valid) {
				MessageBox.error(this._getText(validation.message));
				return;
			}
			
			this._setBusy(true);
			const mainModel = this.getView().getModel();
			const binding = mainModel.bindList(oDataEntity);
			const context = binding.create(game.getOdataObject());

			context.created().then(function() {
				MessageBox.success(this._getText("msgSuccessGameCreated"));
				gameModel.refresh();
				this._setBusy(false);
				//TODO: Navigate to game view
			}.bind(this)).catch(function(error) {
				MessageBox.error(this._getText("msgErrorGameCreation", [error.message]));
				this._setBusy(false);
			}.bind(this));
		},

		onNewGame: function () {
			const game = this.getView().getModel(gameModelName).getData();
			
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
			//TODO: Navigate to game view
		},

		_initializeNewGame: function() {
			const mainModel = this.getView().getController().getOwnerComponent().getModel();
			const respository = new Repository(mainModel);
			const game = new Game(respository);
			this.getView().setModel(new JSONModel(game), gameModelName);
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
		}
	});
});
