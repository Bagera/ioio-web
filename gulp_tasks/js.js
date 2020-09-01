const { src, dest } = require("gulp");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");

const options = {
  dist: "./_site",
  temp: "./temp",
};

function transpile(cb) {
  return src([`${options.dist}/js/**/*.js`, `${options.dist}/js/**.mjs`], {
    base: `${options.dist}/js`,
  })
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(rename({ suffix: ".min", extname: ".js" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(`${options.dist}/js`));
}

function minify(cb) {
  return src(["src/js/main.js"])
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest(`${options.dist}/js`));
}

module.exports = { js: transpile };
