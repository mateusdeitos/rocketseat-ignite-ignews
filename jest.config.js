module.exports = {
	testPathIgnorePatterns: ["/node_modules/", "/.next/"],
	transform: {
		"^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
	},
	setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
	testEnvironment: "jsdom",
	moduleNameMapper: { // yarn add identity-obj-proxy -D
		"\\.(css|sass|scss)$": "identity-obj-proxy",
	}
}