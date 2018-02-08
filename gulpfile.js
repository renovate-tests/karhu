const gulp = require('gulp'),
  ts = require('gulp-typescript'),
  tsProject = ts.createProject('tsconfig.json', {target: 'es2017'}),
  clean = require('gulp-clean'),
  cp = require('child_process')

const target = 'build'

gulp.task('clean-build', function () {
  return gulp.src(target, {read: false})
    .pipe(clean())
})

gulp.task('clean', ['clean-build'])

gulp.task('ts', function () {
  return tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest(target))
})

gulp.task('build', ['ts'])

gulp.task('default', ['clean', 'build'])
