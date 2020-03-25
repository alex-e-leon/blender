const path = require('path');
const fs = require('fs');

const { CLIOPTIONS } = require('./const.js');
const { color } = require('./color.js');
const { D, log } = require('./log.js');

/**
 * The settings store
 *
 * @type {Object}
 */
const SETTINGS = {
	store: {},

	get get() {
		return this.store;
	},
	set set(settings) {
		this.store = settings;
	},
};

/**
 * Get the settings from the package.json, the cli and our defaults value and merge them all together
 *
 * @param  {object} options   - The options for this program
 * @param  {string} cwd       - The current working directory
 * @param  {array}  inputArgs - The array of our cli options of which the first two are ignored
 *
 * @return {object}           - The settings object with all merged
 */
function getSettings(options = CLIOPTIONS, cwd = process.cwd(), inputArgs = process.argv) {
	D.header('getSettings', { options, cwd, inputArgs });

	const cliArgs = getCliArgs(options, inputArgs);
	const pkgOptions = getPkgOptions(cwd);
	const defaults = getDefaults(options);

	const settings = { ...defaults, ...pkgOptions };

	D.log(`settings merged with defaults: "${color.yellow(JSON.stringify(settings))}"`);

	Object.entries(cliArgs).map(([key, value]) => {
		if (key.startsWith('output-')) {
			settings.output[key.replace('output-', '')] = value;
		} else if (key === 'output') {
			Object.entries(options)
				.filter(([option, obj]) => option.startsWith('output-') && obj.type === 'string')
				.map(([option]) => {
					settings.output[option.replace('output-', '')] = value;
				});
		} else {
			settings[key.startsWith('-') ? key : camelCase(key)] = value;
		}
	});

	D.log(`getSettings return: "${color.yellow(JSON.stringify(settings))}"`);

	return settings;
}

/**
 * Get the default values from our options
 *
 * @param  {object} options - The defaults options object
 *
 * @return {object}         - An object of only the items with default values
 */
function getDefaults(options) {
	D.header('getDefaults', { options });
	const defaults = {};

	Object.entries(options).map(([option, value]) => {
		if (typeof value.default !== 'undefined') {
			defaults[option] = value.default;
		}
	});

	D.log(`getDefaults return: "${color.yellow(JSON.stringify(defaults))}"`);

	return defaults;
}

/**
 * Convert a string to camel case
 *
 * @param  {string} name - The string to be converted
 *
 * @return {string}      - Camel-cased string
 */
function camelCase(name) {
	return name
		.split('-')
		.map((bit, i) => {
			if (i > 0) {
				return bit.charAt(0).toUpperCase() + bit.slice(1);
			}
			return bit;
		})
		.join('');
}

/**
 * Get the blender settings from the package.json
 *
 * @param  {string} cwd - The current working directory
 *
 * @return {object}     - The settings object from the package.json
 */
function getPkgOptions(cwd) {
	D.header('getPkgOptions', { cwd });

	const pkgPath = path.normalize(`${cwd}/package.json`);
	let pkgSettings;
	try {
		pkgSettings = require(pkgPath).blender;
		D.log(`Found package.json at "${color.yellow(pkgPath)}"`);
	} catch (error) {
		D.error(`Unable to find package.json at "${color.yellow(pkgPath)}"`);
		log.info(`No ${color.yellow(`package.json`)} file found`);
	}

	D.log(`getPkgOptions return: "${color.yellow(JSON.stringify(pkgSettings))}"`);

	return pkgSettings || {};
}

/**
 * Parse our cli options into an easily digestible object
 *
 * @param  {object} options   - The options object with names for each option as key and an optional flag key
 * @param  {array}  inputArgs - The array of our cli options of which the first two are ignored
 *
 * @return {object}           - A shallow 1-level deep object
 */
function getCliArgs(options, inputArgs) {
	D.header('getCliArgs', { options, inputArgs });

	const argDict = {};
	Object.entries(options).map(([name, value]) => {
		argDict[`--${name}`] = name;
		if (value.flag) {
			argDict[`-${value.flag}`] = name;
		}
	});
	D.log(`Created arguments dictonary: "${color.yellow(JSON.stringify(argDict))}"`);

	const cliArgs = {};
	let currentFlag = '';
	inputArgs
		.slice(2) // ignore the first two items as first is path to node binary and second is path to node script (this one)
		.map((arg) => {
			// catch all full size flags "--version", "--debug" and all single short flags "-v", "-d"
			if (arg.startsWith('--') || (arg.startsWith('-') && arg.length === 2)) {
				currentFlag = argDict[arg] || arg;
				cliArgs[currentFlag] = true;
			}
			// catch all combined short flags "-xyz"
			else if (arg.startsWith('-')) {
				arg
					.slice(1) // remove the "-"       -> "xyz"
					.split('') // split into each flag -> ["x","y","z"]
					.map((flag) => {
						currentFlag = argDict[`-${flag}`] || `-${flag}`;
						cliArgs[currentFlag] = true;
					});
			}
			// catch all values passed to flags
			else {
				if (currentFlag === '') {
					D.error(`Found value without flag: "${color.yellow(arg)}"`);
					log.warn(
						`The cli argument "${color.bold(
							arg
						)}" has no preceding flags and therefore can't be categorized`
					);
				} else {
					if (Array.isArray(cliArgs[currentFlag])) {
						cliArgs[currentFlag].push(arg);
					} else if (typeof cliArgs[currentFlag] === 'string') {
						cliArgs[currentFlag] = [cliArgs[currentFlag], arg];
					} else {
						cliArgs[currentFlag] = arg;
					}
				}
			}
		});

	D.log(`getCliArgs return: "${color.yellow(JSON.stringify(cliArgs))}"`);

	return cliArgs;
}

module.exports = exports = {
	SETTINGS,
	getSettings,
	camelCase,
	getPkgOptions,
	getCliArgs,
};
