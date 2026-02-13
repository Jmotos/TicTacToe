sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: com.trifork.tictactoe",
		defaults: {
			page: "ui5://test-resources/com/trifork/tictactoe/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "com/trifork/tictactoe/",
				never: "test-resources/com/trifork/tictactoe/"
			},
			loader: {
				paths: {
					"com/trifork/tictactoe": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for com.trifork.tictactoe"
			}
		}
	};
});
