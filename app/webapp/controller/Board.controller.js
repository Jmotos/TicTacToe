sap.ui.define([
	"./BaseController", "sap/m/MessageBox", "sap/ui/model/json/JSONModel", "../model/Game", "../model/Repository"
], function (BaseController, MessageBox, JSONModel, Game, Repository) {
	"use strict";

	const mainRoute = "main";

	return BaseController.extend("com.trifork.tictactoe.controller.Game", {
		onInit: function () {
			if (!this.getGameModel()?.getData()) {
				this.navTo(mainRoute);
			}

			this._loadActiveGame();
		},

		onCellPress: function (event, row, column) {
			const gameModel = this.getGameModel();
			const game = gameModel.getData();

			if (game.winner !== 0) {
				return;
			}
			
			this._setBusy(true);
			game.clickCell(row, column).then(function(status) {
				gameModel.refresh();
				this._setBusy(false);
				this._clearFocus();
				if (status.winner !== 0) {
					this._showGameFinishedPopup(this._getText("msgGameWinner", status.winner));
				} else if (status.draw) {
					this._showGameFinishedPopup(this._getText("msgGameDraw"));
				}
			}.bind(this)).catch(function(error) {
				MessageBox.error(error.message);
				this._setBusy(false);
			}.bind(this));
		},

		_showGameFinishedPopup: function (message) {
			const newGameAction = this._getText("btnNewGame");
			MessageBox.information(message, {
				actions: [newGameAction, MessageBox.Action.CLOSE],
				onClose: function (action) {
					if (action === newGameAction) {
						this.onStartNewGame();
					}
				}.bind(this)
			});
		},

		onStartNewGame: function () {
			const oldGame = this.getGameModel().getData();
			const newGame = this.initializeNewGame();
			newGame.player1 = oldGame.player1;
			newGame.player2 = oldGame.player2;
			this.getGameModel().refresh();

			this.navTo(mainRoute);
		},

		_loadActiveGame: function() {
			const mainModel = this.getOwnerComponent().getModel();
			const repository = new Repository(mainModel);
			const game = new Game(repository);

			this._setBusy(true);
			game.loadActiveGame().then(function (activeGame) {
				this.setGameModel(activeGame);
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

		_setBusy: function(isBusy) {
			this.getView().setBusy(isBusy);
		},

		_clearFocus: function() {
			setTimeout(function () {
				document.activeElement?.blur?.();
			}, 0);
		},
	});
});
