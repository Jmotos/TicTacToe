sap.ui.define([
], function () {
	"use strict";

	return class Cell {
		constructor(id, row, col, value) {
			this.ID = id;
			this.row = row;
			this.col = col;
			this.value = value;
		}
	}
});
