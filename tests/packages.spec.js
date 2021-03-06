/**
 * Testing src/packages.js functions
 *
 * PACKAGES
 * getPackages
 **/
const path = require('path');

const { PACKAGES, getPackages } = require('../src/packages.js');
const { SETTINGS } = require('../src/settings.js');
const { DEBUG } = require('../src/debug.js');

/**
 * PACKAGES
 */
describe('PACKAGES', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('Get the current packages', () => {
		expect(PACKAGES.get).toStrictEqual([]);
	});

	test('Set the packages', () => {
		const packages = [
			{
				key: 'value',
				sub: {
					deep: 'value',
				},
			},
			{},
		];
		PACKAGES.set = packages;

		expect(PACKAGES.get).toStrictEqual(packages);
	});

	test('Clear the packages', () => {
		const packages = [
			{
				key: 'value',
				sub: {
					deep: 'value',
				},
			},
			{},
		];
		PACKAGES.set = packages;

		expect(PACKAGES.get).toStrictEqual(packages);

		PACKAGES.clean();

		expect(PACKAGES.get).toStrictEqual([]);
	});
});

/**
 * getPackages
 */
describe('getPackages', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('Get all packages that support the blender from a scope', () => {
		SETTINGS.set = {
			scope: '@westpac',
			include: [],
			exclude: [],
		};

		const result = getPackages(path.normalize(`${__dirname}/../tests/mock/mock-project1/`));

		expect(result.length).toBe(4);
		expect(result[0].path.endsWith('mock-project1/node_modules/@westpac/component1')).toBe(true);
		expect(result[0].pkg).toStrictEqual({
			recipe: 'blender/recipe.js',
			js: 'blender/script.js',
		});
		expect(result[1].path.endsWith('mock-project1/node_modules/@westpac/component2')).toBe(true);
		expect(result[1].pkg).toStrictEqual({ recipe: 'blender/recipe.js' });
		expect(result[2].path.endsWith('mock-project1/node_modules/@westpac/core')).toBe(true);
		expect(result[2].pkg).toStrictEqual({
			recipe: 'blender/recipe.js',
			js: 'blender/jquery.js',
			isCore: true,
		});
		expect(result[3].path.endsWith('mock-project1/node_modules/@westpac/wbc')).toBe(true);
		expect(result[3].pkg).toStrictEqual({ tokens: true });
	});

	test('Include additional packages via the include option', () => {
		SETTINGS.set = {
			scope: '@westpac',
			include: ['component4'],
			exclude: [],
		};

		const result = getPackages(path.normalize(`${__dirname}/../tests/mock/mock-project1/`));

		expect(result.length).toBe(5);
		expect(result[0].path.endsWith('mock-project1/node_modules/@westpac/component1')).toBe(true);
		expect(result[0].pkg).toStrictEqual({
			recipe: 'blender/recipe.js',
			js: 'blender/script.js',
		});
		expect(result[1].path.endsWith('mock-project1/node_modules/@westpac/component2')).toBe(true);
		expect(result[1].pkg).toStrictEqual({ recipe: 'blender/recipe.js' });
		expect(result[2].path.endsWith('mock-project1/node_modules/@westpac/core')).toBe(true);
		expect(result[2].pkg).toStrictEqual({
			recipe: 'blender/recipe.js',
			js: 'blender/jquery.js',
			isCore: true,
		});
		expect(result[3].path.endsWith('mock-project1/node_modules/@westpac/wbc')).toBe(true);
		expect(result[3].pkg).toStrictEqual({ tokens: true });
		expect(result[4].path.endsWith('mock-project1/node_modules/component4')).toBe(true);
		expect(result[4].pkg).toStrictEqual({
			recipe: 'blender/recipe.js',
			js: 'blender/script.js',
		});
	});

	test(`Warn if a package is included that doesn't exist`, () => {
		console.warn = jest.fn();

		SETTINGS.set = {
			scope: '@westpac',
			include: ['component4', 'foo'],
			exclude: [],
		};

		const result = getPackages(path.normalize(`${__dirname}/../tests/mock/mock-project1/`));

		expect(result.length).toBe(5);
		expect(result[0].path.endsWith('mock-project1/node_modules/@westpac/component1')).toBe(true);
		expect(result[0].pkg).toStrictEqual({
			recipe: 'blender/recipe.js',
			js: 'blender/script.js',
		});
		expect(result[1].path.endsWith('mock-project1/node_modules/@westpac/component2')).toBe(true);
		expect(result[1].pkg).toStrictEqual({ recipe: 'blender/recipe.js' });
		expect(result[2].path.endsWith('mock-project1/node_modules/@westpac/core')).toBe(true);
		expect(result[2].pkg).toStrictEqual({
			recipe: 'blender/recipe.js',
			js: 'blender/jquery.js',
			isCore: true,
		});
		expect(result[3].path.endsWith('mock-project1/node_modules/@westpac/wbc')).toBe(true);
		expect(result[3].pkg).toStrictEqual({ tokens: true });
		expect(result[4].path.endsWith('mock-project1/node_modules/component4')).toBe(true);
		expect(result[4].pkg).toStrictEqual({
			recipe: 'blender/recipe.js',
			js: 'blender/script.js',
		});
		expect(console.warn.mock.calls.length).toBe(1);
		expect(console.warn.mock.calls[0][0].includes('foo')).toBeTruthy();
		expect(console.warn.mock.calls[0][0].includes('could not be found')).toBeTruthy();
	});

	test('Exclude packages from scope and included once', () => {
		SETTINGS.set = {
			scope: '@westpac',
			include: ['component4'],
			exclude: ['@westpac/component2'],
		};

		const result = getPackages(path.normalize(`${__dirname}/../tests/mock/mock-project1/`));

		expect(result.length).toBe(4);
		expect(result[0].path.endsWith('mock-project1/node_modules/@westpac/component1')).toBe(true);
		expect(result[0].pkg).toStrictEqual({
			recipe: 'blender/recipe.js',
			js: 'blender/script.js',
		});
		expect(result[1].path.endsWith('mock-project1/node_modules/@westpac/core')).toBe(true);
		expect(result[1].pkg).toStrictEqual({
			recipe: 'blender/recipe.js',
			js: 'blender/jquery.js',
			isCore: true,
		});
		expect(result[2].path.endsWith('mock-project1/node_modules/@westpac/wbc')).toBe(true);
		expect(result[2].pkg).toStrictEqual({
			tokens: true,
		});
		expect(result[3].path.endsWith('mock-project1/node_modules/component4')).toBe(true);
		expect(result[3].pkg).toStrictEqual({
			js: 'blender/script.js',
			recipe: 'blender/recipe.js',
		});
	});

	test('Exclude packages with scope and excluded once', () => {
		SETTINGS.set = {
			scope: '@bank',
			include: [],
			exclude: ['@bank/component1'],
		};

		const result = getPackages(path.normalize(`${__dirname}/../tests/mock/mock-project4/`));

		expect(result.length).toBe(3);
		expect(result[0].path.endsWith('mock-project4/node_modules/@bank/component2')).toBe(true);
		expect(result[0].pkg).toStrictEqual({
			recipe: 'blender/recipe.js',
		});
		expect(result[1].path.endsWith('mock-project4/node_modules/@bank/core')).toBe(true);
		expect(result[1].pkg).toStrictEqual({
			recipe: 'blender/recipe.js',
			js: 'blender/jquery.js',
			isCore: true,
		});
		expect(result[2].path.endsWith('mock-project4/node_modules/@bank/wbc')).toBe(true);
		expect(result[2].pkg).toStrictEqual({
			tokens: true,
		});
	});

	test('Exclude packages without scope and included once', () => {
		SETTINGS.set = {
			scope: '',
			include: ['@bank/component1'],
			exclude: [],
		};

		const result = getPackages(path.normalize(`${__dirname}/../tests/mock/mock-project4/`));

		expect(result.length).toBe(1);
		expect(result[0].path.endsWith('mock-project4/node_modules/@bank/component1')).toBe(true);
		expect(result[0].pkg).toStrictEqual({
			js: 'blender/script.js',
			recipe: 'blender/recipe.js',
		});
	});

	test('Include two packages without scope from two different folders', () => {
		SETTINGS.set = {
			include: ['@bank/component1', '@westpac/component1'],
			exclude: [],
		};

		const result = getPackages(path.normalize(`${__dirname}/../tests/mock/mock-project4/`));

		expect(result.length).toBe(2);
		expect(result[0].path.endsWith('mock-project4/node_modules/@bank/component1')).toBe(true);
		expect(result[0].pkg).toStrictEqual({
			js: 'blender/script.js',
			recipe: 'blender/recipe.js',
		});
		expect(result[1].path.endsWith('mock-project4/node_modules/@westpac/component1')).toBe(true);
		expect(result[1].pkg).toStrictEqual({
			js: 'blender/script.js',
			recipe: 'blender/recipe.js',
		});
	});

	test('Include one package without scope that does not exist', () => {
		console.warn = jest.fn();

		SETTINGS.set = {
			include: ['@bank/component1'],
			exclude: [],
		};

		const result = getPackages(path.normalize(`${__dirname}/../tests/mock/mock-project1/`));

		expect(result.length).toBe(0);
		expect(console.warn.mock.calls.length).toBe(1);
		expect(console.warn.mock.calls[0][0].includes('@bank/component1')).toBeTruthy();
		expect(console.warn.mock.calls[0][0].includes('could not be found')).toBeTruthy();
	});

	test('Log when scope does not exist', () => {
		SETTINGS.set = {
			scope: '@void',
			include: [],
			exclude: [],
		};

		const result = getPackages(path.normalize(`${__dirname}/../tests/mock/mock-project1/`));

		expect(result.length).toBe(0);
		expect(DEBUG.messages.includes('🔎  No scope found')).toBe(true);
		const index = DEBUG.messages.indexOf('🔎  No scope found');
		expect(DEBUG.messages[index + 1].includes('Error: ENOENT')).toBe(true);
	});

	test('Log when readFile errors', () => {
		jest.mock('fs');
		const { getPackages } = require('../src/packages.js');
		const { SETTINGS } = require('../src/settings.js');
		const { DEBUG } = require('../src/debug.js');

		SETTINGS.set = {
			scope: '@westpac',
			include: [],
			exclude: [],
		};

		const result = getPackages(path.normalize(`${__dirname}/../tests/mock/mock-project1/`));

		expect(result.length).toBe(0);
		expect(DEBUG.messages.includes('🛑  Error: OUR ERROR')).toBe(true);
		const index = DEBUG.messages.indexOf('🛑  Error: OUR ERROR');
		expect(
			DEBUG.messages[index - 1].includes('Something went wrong when trying to read packages')
		).toBe(true);
	});
});
