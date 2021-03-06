/**
 * All functions for around packages
 *
 * PACKAGES    - The packages store
 * getPackages - Retrieve packages from the node_modules folder
 **/
const path = require('path');
const fs = require('fs');

const { SETTINGS } = require('./settings.js');
const { color } = require('./color.js');
const { log } = require('./log.js');
const { D } = require('./log.js');

/**
 * The packages store
 *
 * @type {Object}
 */
const PACKAGES = {
	store: [],

	get get() {
		return this.store;
	},
	set set(settings) {
		this.store = settings;
	},

	clean() {
		this.store = [];
	},
};

/**
 * Retrieve packages from the node_modules folder
 *
 * @param  {string} cwd - The current working directory
 *
 * @return {array}      - An array of objects with package data
 */
function getPackages(cwd = process.cwd()) {
	D.header('getPackages', { cwd });

	const nodeModulesPath = path.normalize(`${cwd}/node_modules/`);

	let inScope = [];
	if (SETTINGS.get.scope) {
		try {
			inScope = fs
				.readdirSync(path.normalize(`${nodeModulesPath}/${SETTINGS.get.scope}`), {
					withFileTypes: true,
				}) // read all items in that folder
				.filter(
					(item) =>
						!item.name.startsWith('.') &&
						!item.name.startsWith('@') &&
						(item.isDirectory() || item.isSymbolicLink())
				) // filter out dot files and non-folder
				.map((folder) =>
					fs.realpathSync(path.normalize(`${nodeModulesPath}/${SETTINGS.get.scope}/${folder.name}`))
				); // add absolute path and resolve symlinks
			D.log(`Retrieved in scope packages: "${color.yellow(JSON.stringify(inScope))}"`);
		} catch (error) {
			if (error.code === 'ENOENT') {
				D.log('No scope found');
				D.log(error);
			} else {
				D.error(
					`Something went wrong when trying to read packages at ${color.yellow(
						`${nodeModulesPath}/${SETTINGS.get.scope}`
					)}`
				);
				D.error(error);
			}
		}
	}

	const includes = SETTINGS.get.include.map((module) => {
		try {
			return fs.realpathSync(path.normalize(`${nodeModulesPath}/${module}`));
		} catch (_) {
			return path.normalize(`${nodeModulesPath}/${module}`);
		}
	});

	D.log(`Retrieved in included packages: "${color.yellow(JSON.stringify(includes))}"`);

	const packages = [...inScope, ...includes] // merging both sets
		.map((module) => {
			let pkg = { blender: false };
			try {
				pkg = require(`${module}/package.json`);
			} catch (error) {
				log.warn(
					`The package "${color.yellow(module.replace(nodeModulesPath, ''))}" could not be found.`
				);
			}

			return {
				name: pkg.name,
				version: pkg.version,
				path: module,
				pkg: pkg.blender,
			};
		}) // added each package.json blender section
		.filter((module) => {
			// remove all packages which don't support the blender
			if (!module.pkg) {
				return false;
			}
			// remove all packages which have been excluded except those that are marked as core
			if (SETTINGS.get.exclude.includes(module.name) && !module.pkg.isCore) {
				return false;
			}
			return true;
		});

	D.log(`getPackages return: "${color.yellow(JSON.stringify(packages))}"`);

	// we need to flag all packages with babel to include them
	require('@babel/register')({
		presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react')],
		plugins: [
			require.resolve('@babel/plugin-transform-runtime'),
			[
				require.resolve('@babel/plugin-syntax-dynamic-import'),
				{
					root: SETTINGS.get.cwd,
					suppressResolveWarning: true,
				},
			],
		],
		only: packages.map((pkg) => `${pkg.path}`),
	});

	return packages;
}

module.exports = exports = {
	PACKAGES,
	getPackages,
};
