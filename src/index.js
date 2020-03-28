/**
 * The entry file for the blender API
 *
 * blender - The blender API
 **/
const path = require('path');

const { SETTINGS, getSettings, checkInput } = require('./settings.js');
const { PACKAGES, getPackages } = require('./packages.js');
const { parseComponent } = require('./parseCss.js');
const { clean } = require('./clean.js');
const { DEBUG } = require('./log.js');

/**
 * The blender API
 */
function blender(options = {}) {
	clean(); // clean memory

	return new Promise(async (resolve, reject) => {
		DEBUG.mode = 'api'; // setting debug mode to api means no console.logs that clutters the output
		const { cwd = process.cwd() } = options;

		// parse and check options
		const isGoodHuman = checkInput(options);
		SETTINGS.set = getSettings(options, cwd);
		DEBUG.enabled = SETTINGS.get.debug;

		if (isGoodHuman.pass === false) {
			reject(isGoodHuman);
		}

		// return version
		if (SETTINGS.get.version) {
			resolve(`v${version}`);
			process.exit();
		}

		// get all packages
		PACKAGES.set = getPackages(cwd);

		// run tester
		if (SETTINGS.get.test) {
			const result = tester(PACKAGES.get);
			if (result.code > 0) {
				reject(result);
			} else {
				resolve(result);
			}
		}

		// run blender file generator

		// const thing = await parseComponent({
		// 	componentPath: path.normalize(`${__dirname}/../tests/mock/recipe1.js`),
		// 	brand: {},
		// });
		// console.log(thing);

		resolve({
			packages: PACKAGES.get,
			options: { ...SETTINGS.get },
		});
	});
}

blender({ cwd: path.normalize(`${__dirname}/../tests/mock/mock-project1/`) }).then((data) =>
	console.log(JSON.stringify(data, null, 2))
);

module.exports = exports = {
	blender,
};
