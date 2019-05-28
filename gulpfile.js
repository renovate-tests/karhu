const gulp = require('gulp'),
  ts = require('gulp-typescript'),
  gulpClean = require('gulp-clean'),
  cp = require('child_process'),
  tsProject2015 = ts.createProject('tsconfig.json', {target: 'es5'}),
  tsProject2017 = ts.createProject('tsconfig.json', {target: 'es2017'})

function cleanBuild() {
  return gulp.src('build', {read: false})
    .pipe(gulpClean())
}


function cleanES5() {
  return gulp.src('es5', {read: false})
    .pipe(gulpClean())
}

const clean = gulp.parallel(cleanBuild, cleanES5)

function build2017() {
  return tsProject2017.src()
    .pipe(tsProject2017())
    .pipe(gulp.dest('build'))
}


function buildES5() {
  return tsProject2015.src()
    .pipe(tsProject2015())
    .pipe(gulp.dest('es5'))
}

const build = gulp.parallel(build2017, buildES5)
const defaultTask = gulp.series(clean, build)

module.exports = {
  clean,
  build,
  default: defaultTask
}
