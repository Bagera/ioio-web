const { src, dest } = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");

// PostCss
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssvars = require("postcss-css-variables");
const csso = require("postcss-csso");
const cssImport = require("postcss-import");

const options = {
  dist: "./_site",
  temp: "./temp",
};

const postcssPlugins = [cssImport(), cssvars(), autoprefixer(), csso()];

function processCss() {
  return src(`${options.dist}/css/**.css`)
    .pipe(sourcemaps.init())
    .pipe(postcss(postcssPlugins))
    .pipe(sourcemaps.write("."))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(`${options.dist}/css/`));
}

module.exports = { css: processCss };
