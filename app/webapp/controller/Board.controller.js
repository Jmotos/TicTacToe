sap.ui.define([
	"./BaseController", "sap/m/MessageBox"
], function (BaseController, MessageBox) {
	"use strict";

	const gameModelName = "game";

	return BaseController.extend("com.trifork.tictactoe.controller.Game", {
		onInit: function () {
			// Initialize if needed
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

		_getGameModel: function() {
			return this.getOwnerComponent().getModel(gameModelName);
		},

		_setBusy: function(isBusy) {
			this.getView().setBusy(isBusy);
		},
	});
});
