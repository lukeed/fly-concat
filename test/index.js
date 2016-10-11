'use strict';

const join = require('path').join;
const test = require('tape').test;
const Fly = require('fly');

const bun = 'out.js';
const dir = join(__dirname, 'fixtures');
const tmp = join(__dirname, '.tmp');
const tar = join(tmp, bun);

test('fly-concat', t => {
	t.plan(8);

	const fly = new Fly({
		plugins: [{
			name: 'concat',
			func: require('../')
		}],
		tasks: {
			a: function * () {
				// test #1: str
				yield this.source(`${dir}/*.js`).concat1(bun).target(tmp);
				const arr1 = yield this.$.expand(`${tmp}/*`);
				const out1 = yield this.$.find(bun, tmp);
				t.equal(out1, tar, 'via str; create `output` file');
				t.equal(arr1.length, 1, 'via str; do not create a sourcemap');
				yield this.clear(tmp);
				yield this.start('b');
			},
			b: function * () {
				// test #2: obj w/ `maps`
				yield this.source(`${dir}/*.js`).concat1({output: bun, maps: 1}).target(tmp);
				const arr1 = yield this.$.expand(`${tmp}/*`);
				const out1 = yield this.$.find(bun, tmp);
				const out2 = yield this.$.find(`${bun}.map`, tmp);
				t.equal(out1, tar, 'via obj w/ `maps`; create `output` file');
				t.ok(arr1.length === 2 && out2.length, 'via obj w/ `maps`; create a sourcemap');
				yield this.clear(tmp);
				yield this.start('c');
			},
			c: function * () {
				// test #3: obj w/ `maps` and `base`
				yield this.source(`${dir}/*.js`).concat1({output: bun, maps: 1, base: tmp}).target(tmp);
				const arr1 = yield this.$.expand(`${tmp}/*`);
				const out1 = yield this.$.find(bun, tmp);
				const out2 = yield this.$.find(`${bun}.map`, tmp);
				t.equal(out1, tar, 'via obj w/ `maps` & `base`; create `output` file');
				t.ok(arr1.length === 2 && out2.length, 'via obj w/ `maps` & `base`; create a sourcemap');
				yield this.clear(tmp);
				yield this.start('d');
			},
			d: function * () {
				// test #4: obj w/ `maps` & `base` (nested)
				yield this.source(`${dir}/sub/*.js`).concat1({output: bun, maps: 1, base: tmp}).target(tmp);
				const arr1 = yield this.$.expand(`${tmp}/*`);
				const out1 = yield this.$.find(bun, tmp);
				const out2 = yield this.$.find(`${bun}.map`, tmp);
				t.equal(out1, tar, 'via obj w/ `maps` & `base` (nested); create `output` file');
				t.ok(arr1.length === 2 && out2.length, 'via obj w/ `maps` & `base` (nested); create a sourcemap');
				yield this.clear(tmp);
			}
		}
	});

	fly.start('a');
});
