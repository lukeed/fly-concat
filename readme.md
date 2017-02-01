# fly-concat [![Build Status](https://travis-ci.org/lukeed/fly-concat.svg?branch=master)](https://travis-ci.org/lukeed/fly-concat)

> Concatenate files with optional source maps.


## Install

```
$ npm install --save-dev fly-concat
```


## Usage

```js
// flyfile.js
exports.task = function * (fly) {
  // concat only; no sourcemap
  yield fly.source('src/*.js')
    .concat('all.js')
    .target('dist'); //=> 'dist/all.js'

  // concat with sourcemap
  yield fly.source('src/*.js')
    .concat({output: 'all.js', map: true})
    .target('dist'); //=> 'dist/all.js', 'dist/all.js.map'

  // concat nested source
  yield fly.source('src/js/*.js')
    .concat({output: 'all.js', base: 'src'})
    .target('dist'); //=> 'dist/all.js' vs 'dist/js/all.js'
};
```


## API

### .concat(options)

Passing `options` as a `String` is a shortcut for `{output: <value>}`. Only concatenation will occur with this configuration.

#### options.base

Type: `string`<br>
Default: `''`

Adjust the concatenated file's base directory. This is useful when your `source()` is nested deeper than your `target()`.

```js
// without \`base\`
yield fly.source('src/js/**/*.js')
  .concat('all.js').target('dist/js');
  //=> dist/js/client/all.js

// with \`base\`
yield fly.source('src/js/**/*.js')
  .concat({output: 'all.js', base: 'src/js').target('dist/js');
  //=> dist/js/all.js
```

#### options.map

Type: `boolean`<br>
Default: `false`

Should a sourcemap be generated? If `true`, its name will be `{options.output}.map` and it will be a sibling of the concatenated file.

```
dist\
  |- all.js
  |- all.js.map
```

#### options.output

Type: `string`<br>
Default: `''`

The name of your concatenated file.

#### options.sep

Type: `string`<br>
Default: `''`


## License

MIT © [Luke Edwards](https://lukeed.com)
