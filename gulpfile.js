var path = require("path");
var argv = require("yargs").argv;
var gulp = require("gulp");
var jade = require("gulp-pug");
var prettify = require("gulp-prettify");
var precss = require("precss");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var path = require("path");
var iconfont = require("gulp-iconfont");
var iconfontCss = require("gulp-iconfont-css");
var sass = require("gulp-sass");
var del = require("del");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var filter = require("gulp-filter");

var isProd = argv.production === undefined ? false : true;
var buildPath = argv.buildPath || "template-page";

var config = {
  paths: [
    // images
    "src/img/**/*",
    "!src/i/sprite/**/*",
    // js
    "src/js/**/*",
    // fonts
    "src/fonts/**/*",
    // videos
    "src/video/**/*",
    // other
    "src/robots.txt"
  ]
};

gulp.task("build:copy", function(callback) {
  gulp
    .src(config.paths, { base: "src" })
    .pipe(gulp.dest(buildPath))
    .on("finish", callback);
});

gulp.task("build:css", function() {
  var processors = [
    autoprefixer({ browsers: ["last 5 versions", "> 0.5%"] }),
    precss({
      /* options */
    })
  ];

  return gulp
    .src("./src/scss/*.scss")
    .pipe(sass({ outputStyle: "compact" }).on("error", sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest(path.join(buildPath, "css")));
});

gulp.task("build:iconfont", function(cb) {
  var fontName = "mid";

  gulp
    .src("src/icons/*.svg")
    .pipe(
      iconfontCss({
        fontName: fontName,
        path: "src/libs/font-template.scss",
        targetPath: "../styles/blocks/general/icons.scss",
        fontPath: "../fonts/",
        cssClass: "ic"
      })
    )
    .pipe(
      iconfont({
        fontName: fontName,
        formats: ["ttf", "eot", "woff", "woff2"],
        normalize: true,
        autohint: false,
        prependUnicode: true,
        fontHeight: 692
      })
    )
    .pipe(gulp.dest("./src/fonts/"))
    .on("finish", cb);
});

var filterByExtension = function(extension) {
  return filter(function(file) {
    return file.path.match(new RegExp("." + extension + "$"));
  });
};

gulp.task("plugins", function() {
  var jsFilter = filterByExtension("js");

  return gulp
    .src("src/plugins/**/*.js")
    .pipe(jsFilter)
    .pipe(concat("vendor.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(path.join(buildPath, "js")));
});

gulp.task("html", function() {
  return gulp.src("src/*.html").pipe(gulp.dest(buildPath));
});

gulp.task("keepme", function() {
  return gulp.src("src/*.keepme").pipe(gulp.dest(buildPath));
});

gulp.task("clean", function(callback) {
  del([path.join(buildPath, "**", "*")]).then(function() {
    callback();
  });
});

gulp.task("build", ["clean"], function() {
  gulp.run("html");
  gulp.run("keepme");
  gulp.run("build:css");
  gulp.run("build:copy");
  gulp.run("plugins");
});

gulp.task("watch", ["build"], function() {
  gulp.watch(["src/*.html"], ["html"]);
  gulp.watch(["src/scss/**/*.scss"], ["build:css"]);
  gulp.watch(config.paths, ["build:copy"]);
});

gulp.task("default", ["build"]);
