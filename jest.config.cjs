module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node', // Since your library targets Node.js
    roots: ['<rootDir>/src/test'], // Focus Jest on your test directory
    testMatch: ['**/*.spec.ts'], // Only consider files ending in .test.ts as test files
    moduleFileExtensions: ['ts', 'js', 'json', 'node'], // File types Jest will process
    collectCoverage: true, // Enable coverage collection
    collectCoverageFrom: ['src/**/*.{ts,js}', '!src/test/**', '!src/spec/**'], // Collect coverage from source but not test files
    coverageDirectory: 'coverage', // Where to output coverage reports
    coverageReporters: ['text', 'lcov'], // Reporters for coverage; lcov for CI, text for console output
    transformIgnorePatterns: ['node_modules'],
    moduleNameMapper: {
        '(.+)\\.js': '$1'
    },
}
