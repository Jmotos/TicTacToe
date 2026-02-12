module.exports = {
	testEnvironment: 'node',
	testMatch: ['**/test/**/*.test.js'],
	collectCoverageFrom: [
		'srv/**/*.js',
		'!srv/**/*.cds'
	],
	coverageDirectory: 'coverage',
	testTimeout: 10000
};
