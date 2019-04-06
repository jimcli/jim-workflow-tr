const translate = require('@vitalets/google-translate-api');
const chalk = require('chalk');

/**
 * This is a jim-workflow that takes cli params and passes them though Google Translate
 */
module.exports = class JimTranslate {
	/**
	 * Kick things off
	 *
	 * @param {Object} jim The jim-object
	 */
	constructor(jim) {
		this.jim = jim;
	}

	/**
	 * The jim-run method
	 */
	run() {
		const { params } = this.jim;
		let from;
		let to;
		let text;
		if (params.length === 0 || params.length === 1) {
			this.jim.Logger.info(
				'To translate text with this command, pass it like this:' +
					'\nSpecify target language and text:' +
					'\n  jim tr de "Translate this text"' +
					'\n\nSpecify source language, target language and text' +
					'\n  jim tr en de "Translate this text"' +
					'\n\nIf you specify both target and source language, you can also omit the quotes:' +
					'\n  jim tr en de Translate this text'
			);
			return;
		}
		if (params.length === 2) {
			[to, text] = params;
		} else if (params.length >= 3) {
			[from, to, ...text] = params;
			text = text.join(' ');
		}
		translate(text, {
			from,
			to,
		})
			.then(result => {
				if (params.length === 2) {
					this.jim.Logger.info(
						`Translated ${chalk.bold(
							result.from.language.iso
						)} to ${chalk.bold(to)}`
					);
				}
				this.jim.Logger.log(result.text);
			})
			.catch(error => {
				this.jim.Logger.error(error.stack);
			});
	}
};
