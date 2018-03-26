const gulp = require('gulp'),
  ts = require('gulp-typescript'),
  clean = require('gulp-clean'),
  cp = require('child_process'),
  tsProject2015 = ts.createProject('tsconfig.json', {target: 'es5'}),
  tsProject2017 = ts.createProject('tsconfig.json', {target: 'es2017'})

gulp.task('clean-build', function () {
  return gulp.src('build', {read: false})
    .pipe(clean())
})

gulp.task('clean-es5', function () {
  return gulp.src('es5', {read: false})
    .pipe(clean())
})

gulp.task('clean', ['clean-build', 'clean-es5'])

gulp.task('ts2017', function () {
  return tsProject2017.src()
    .pipe(tsProject2017())
    .pipe(gulp.dest('build'))
})

gulp.task('ts2015', function () {
  return tsProject2015.src()
    .pipe(tsProject2015())
    .pipe(gulp.dest('es5'))
})

gulp.task('build', ['ts2017', 'ts2015'])

gulp.task('default', ['clean', 'build'])
