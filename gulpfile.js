const { src, dest, series, parallel } = require("gulp");

const { css } = require("./gulp_tasks/css");
const { js } = require("./gulp_tasks/js");

const pkg = require("./package.json");
const options = {
  autoprefixer: {
    browsers: ["last 2 versions"],
    cascade: false,
  },
  dist: "./dist",
  temp: "./temp",
};

function scripts(cb) {
  return src(["src/js/main.js"])
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["es2015"],
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest(`${options.dist}/js`));
}

exports.default = series(parallel(css, js));

exports.dev = series(parallel(css));
