/**
 * Testing src/parseCss.js functions
 *
 * parseComponent
 **/
const { createElement } = require('react');
const path = require('path');

const { parseComponent, extractMarkup } = require('../src/parseCss.js');

/**
 * parseComponent
 */
describe('parseComponent', () => {
	test('parse AllStyles component correctly', () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
			componentName: 'AllStyles',
			brand: {},
		});

		expect(result.code).toBe(0);
		expect(result.ids).toStrictEqual([
			'gshptl-component1-look1',
			'a2lehl-component1-look2',
			'1imz2ok-component1-look3',
		]);
		expect(result.html).toBe(
			'<div class="css-gshptl-component1-look1"></div><div class="css-a2lehl-component1-look2"></div><div class="css-1imz2ok-component1-look3"></div>'
		);
		expect(result.css).toBe(
			'.css-gshptl-component1-look1{background:rebeccapurple;}.css-a2lehl-component1-look2{background:hotpinnk;}.css-1imz2ok-component1-look3{background:red;}'
		);
	});

	test(`error when AllStyles component doesn't exist`, () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/void`),
			componentName: 'AllStyles',
			brand: {},
		});

		expect(result.code).toBe(1);
		expect(typeof result.error).not.toBe(undefined);
		expect(typeof result.message).not.toBe(undefined);
		expect(result.message.includes('tests/mock/void')).toBe(true);
		expect(result.message.includes('open')).toBe(true);
	});

	test('error when AllStyles component is invalid', () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe-invalid.js`),
			componentName: 'AllStyles',
			brand: {},
		});

		expect(result.code).toBe(1);
		expect(typeof result.error).not.toBe(undefined);
		expect(typeof result.message).not.toBe(undefined);
		expect(result.message.includes('tests/mock/recipe-invalid.js')).toBe(true);
		expect(result.message.includes('parse')).toBe(true);
	});

	test('parse AllStyles component correctly even without brand', () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
			componentName: 'AllStyles',
		});

		expect(result.code).toBe(0);
		expect(result.ids).toStrictEqual([
			'gshptl-component1-look1',
			'a2lehl-component1-look2',
			'1imz2ok-component1-look3',
		]);
		expect(result.html).toBe(
			'<div class="css-gshptl-component1-look1"></div><div class="css-a2lehl-component1-look2"></div><div class="css-1imz2ok-component1-look3"></div>'
		);
		expect(result.css).toBe(
			'.css-gshptl-component1-look1{background:rebeccapurple;}.css-a2lehl-component1-look2{background:hotpinnk;}.css-1imz2ok-component1-look3{background:red;}'
		);
	});

	test('parse docs component correctly', () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
			componentName: 'docs',
			brand: {},
		});

		expect(result.code).toBe(0);
		expect(result.error.length).toBe(0);
		expect(result.message.length).toBe(0);
		expect(result.recipes.length).toBe(3);
		expect(result.recipes[0].heading).toBe('Variation 1 for Component 1');
		expect(typeof result.recipes[0].component).toBe('function');
		expect(result.recipes[0].static).toStrictEqual({
			code: 0,
			html: '<div class="css-gshptl-component1-look1">Here comes the content</div>',
			ids: ['gshptl-component1-look1'],
			css: '.css-gshptl-component1-look1{background:rebeccapurple;}',
		});
		expect(result.recipes[1].heading).toBe('Variation 2 for Component 1');
		expect(typeof result.recipes[1].component).toBe('function');
		expect(result.recipes[1].static).toStrictEqual({
			code: 0,
			html: '<div class="css-a2lehl-component1-look2">Here comes the content</div>',
			ids: ['a2lehl-component1-look2'],
			css: '.css-a2lehl-component1-look2{background:hotpinnk;}',
		});
		expect(result.recipes[2].heading).toBe('Variation 3 for Component 1');
		expect(typeof result.recipes[2].component).toBe('function');
		expect(result.recipes[2].static).toStrictEqual({
			code: 0,
			html: '<div class="css-1imz2ok-component1-look3">Here comes the content</div>',
			ids: ['1imz2ok-component1-look3'],
			css: '.css-1imz2ok-component1-look3{background:red;}',
		});
	});

	test(`error when docs component doesn't exist`, () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/void`),
			componentName: 'docs',
			brand: {},
		});

		expect(result.code).toBe(1);
		expect(typeof result.error).not.toBe(undefined);
		expect(typeof result.message).not.toBe(undefined);
		expect(result.message.includes('tests/mock/void')).toBe(true);
		expect(result.message.includes('open')).toBe(true);
	});

	test('error when docs component is invalid', () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe-invalid.js`),
			componentName: 'docs',
			brand: {},
		});

		expect(result.code).toBe(1);
		expect(typeof result.error).not.toBe(undefined);
		expect(typeof result.message).not.toBe(undefined);
		expect(result.message.length).toBe(3);
		expect(result.message[0].includes('tests/mock/recipe-invalid.js')).toBe(true);
		expect(result.message[1].includes('tests/mock/recipe-invalid.js')).toBe(true);
		expect(result.message[2].includes('tests/mock/recipe-invalid.js')).toBe(true);
		expect(result.recipes.length).toBe(3);
	});

	test('parse AllStyles component correctly with children', () => {
		const result = parseComponent({
			componentPath: path.normalize(`${__dirname}/../tests/mock/recipe2.js`),
			componentName: 'AllStyles',
			brand: {},
			children: 'CHILD',
		});

		expect(result.code).toBe(0);
		expect(result.ids).toStrictEqual(['a8hlze-Component']);
		expect(result.html).toBe('<div class="css-a8hlze-Component">CHILD</div>');
		expect(result.css).toBe('.css-a8hlze-Component{background:red;}');
	});
});

/**
 * extractMarkup
 */
describe('extractMarkup', () => {
	test('extract markup from a simple component', () => {
		const result = extractMarkup({
			Component: () => createElement('div', null, `Hello there`),
			componentPath: 'path/to/component',
			brand: {},
		});

		expect(result.code).toBe(0);
		expect(result.html).toBe('<div>Hello there</div>');
		expect(result.ids).toStrictEqual([]);
		expect(result.css).toBe('');
	});

	test('extract markup from a simple component with children', () => {
		const result = extractMarkup({
			Component: ({ children }) => createElement('div', null, `Hello ${children}`),
			componentPath: 'path/to/component',
			brand: {},
			children: 'World',
		});

		expect(result.code).toBe(0);
		expect(result.html).toBe('<div>Hello World</div>');
		expect(result.ids).toStrictEqual([]);
		expect(result.css).toBe('');
	});
});
