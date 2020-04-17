/**
 * All functions for logging to the console
 *
 * log           - Logging prettiness
 **/

const { Color } = require('./color.js');

class Logger {
  constructor() {
    this.mode = 'cli';
    this.debugEnabled = false;
    this.errorCount = 0;
    this.messages = [];
    this.set = false;
    this.buffer = [];
    this.color = new Color(ignoreColor = this.mode === 'cli');
  }

	_logAndPrint(message, prettyMessage) {
    this.messages.push(message);
    console.log(prettyMessage);
    // Do we really need this buffer stuff?
		// if (this.set && this.buffer.length && this.debugEnabled) {
			// console.log(debug.buffer.join('\n'));
			// debug.buffer = false;
		// }

		// if (!debug.set) {
			// debug.buffer = text;
		// } else if (debug.enabled) {
			// console.log(text);
		// }
	}

	/**
	 * Log the start message
	 *
	 * @param  {string}  text  - The sting you want to log
	 */
	start(text) {
		if (this.mode === 'cli') console.log(`\n   ${this.color.bold(text)}`);
	}

	/**
	 * Log an informal message
	 *
	 * @param  {string}  text  - The sting you want to log
	 */
	info(text) {
		if (this.mode === 'cli') console.info(this.color.gray(`☏  ${text}`));
	}

	/**
	 * Log a success message
	 *
	 * @param  {string}  text  - The sting you want to log
	 */
	success(text) {
		if (this.mode === 'cli') console.log(this.color.green(`☀  ${text}`));
	}

	/**
	 * Log a warning message
	 *
	 * @param  {string}  text  - The sting you want to log
	 */
	warn(text) {
		if (this.mode === 'cli') console.warn(this.color.yellow(`⚠  ${text}`));
	}

	/**
	 * Log a error message
	 *
	 * @param  {string}  text  - The sting you want to log
	 */
	error: (text) => {
		if (this.mode === 'cli') {
			this.errorCount++;
			console.error(this.color.red(`☁  ${text}`));
		}
	}

	/**
	 * Log a header for a function call
	 *
	 * @param  {string}  name  - The name of the function
	 * @param  {object}  args  - Arguments this function may have taken
	 * @param  {boolean} debug - Global debug mode on/off switch
	 */
	logHeader(name, args) {
		const prettyMessage = 
			`${debug.messages.length > 0 ? '\n\n' : ''}   ===== RUNNING "${name}" =====\n` +
			`${args ? JSON.stringify(args) : ''}`;
		const message =
			`\n===== RUNNING "${this.color.bold(name)}" =====${
				args ? `\n${this.color.cyan(JSON.stringify(args))}` : ''
			}`;
    this._logAndPrint(message, prettyMessage);
	}

	/**
	 * Return a message to report starting a process
	 *
	 * @param  {string}  text       - The sting you want to log
	 * @param  {boolean} debug      - Global debug mode on/off switch
	 */
	log(text) {
    const message = `🔎  ${text}`;
    this._logAndPrint(message, message);
	}

	/**
	 * Return a message to report starting a process
	 *
	 * @param  {string}  text       - The sting you want to log
	 * @param  {boolean} debug      - Global debug mode on/off switch
	 */
	logError(text) {
		const message = `🛑  ${text}`;
		const prettyMessage = `🛑  ${this.color.red(text)}`;
    this._logAndPrint(message, prettyMessage);
	}
};

export { Logger };
