import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetModules: true,
    restoreMocks: true,
};

export default config;
