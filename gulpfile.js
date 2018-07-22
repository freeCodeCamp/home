const path = require("path");
const gulp = require("gulp");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const gulpUglify = require("gulp-uglify-es").default;
const pug = require("gulp-pug");
const gulpBabel = require("gulp-babel");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const gulpSass = require("gulp-sass");
const htmlmin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");

const gulpBuild = "build";
const gulpDest = "public";

/** HMTL */
const views = () =>
  gulp
    .src("./src/views/*.pug")
    .pipe(
      pug({
        // Your options in here.
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(gulpDest));

/** CSS */
const sass = () =>
  gulp
    .src("./src/sass/**/*.scss")
    .pipe(gulpSass().on("error", gulpSass.logError))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("./public/css"));

/** JS */
const js = () =>
  gulp
    .src("src/**/*.js")
    .pipe(
      gulpBabel({
        presets: ["env"]
      })
    )
    .pipe(concat("bundle.js"))
    .pipe(rename("bundle.min.js"))
    .pipe(gulpUglify())
    .pipe(gulp.dest(gulpDest));

/** Dev-server */
const reload = done => {
  browserSync.reload();
  done();
};

const serve = done => {
  browserSync.init({
    port: 4545,
    open: false,
    server: {
      baseDir: "./public",
    }
  });
  done();
};

/** Watchers */
const watchJS = () => gulp.watch("./src/**/*.js", gulp.series(js, reload));
const watchPug = () => gulp.watch("./src/**/*.pug", gulp.series(views, reload));
const watchSass = () =>
  gulp.watch("./src/sass/**/*.scss", gulp.series(sass, reload));

const build = gulp.parallel(views, sass, js);

/** Default */
const dev = gulp.series(
  views,
  sass,
  js,
  serve,
  gulp.parallel(watchJS, watchPug, watchSass)
);

module.exports = { default: dev, build };
