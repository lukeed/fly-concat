'use strict';

const resolve = require('path').resolve;
const Concat = require('concat-with-sourcemaps');

const defs = {
	sep: '',
	base: '',
	maps: false,
	output: null
};

module.exports = function () {
	this.plugin('concat', {every: 0}, function * (arr, o) {
		if (typeof o === 'string') {
			o = {output: o};
		}

		o = Object.assign({}, defs, o);

		if (!o.output) {
			throw new Error('`fly-concat` did not receive an `output` filename.');
		}

		const bundle = new Concat(o.maps, o.output, o.sep);

		for (const file of arr) {
			bundle.add(file.base, file.data, file.map || file.sourceMap);
		}

		// if did not specify a `base`, assume first file's location
		const dir = o.base ? resolve(this.root, o.base) : arr[0].dir;
		// concat'd content
		let data = bundle.content;

		// reset
		this._.files = [];

		if (o.maps && bundle.sourceMap) {
			const mapFile = o.output.concat('.map');
			// add link to sourcemap file
			data += new Buffer(`\n//# sourceMappingURL=${mapFile}`);
			// add sourcemap file definition
			this._.files.push({
				dir: dir,
				base: mapFile,
				data: bundle.sourceMap
			});
		}

		// always add the concat'd file
		this._.files.push({
			dir: dir,
			base: o.output,
			data: data
		});
	});
};
