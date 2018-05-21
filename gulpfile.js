// Dependencies
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const debug = require('gulp-debug');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const uglify = require('gulp-uglify');

// File definitions
const jsFiles = [
'./src/*.js'
];

const options = {
  output: {
    comments: /^!/
  }
};

const plugins = [
  autoprefixer({browsers: ['last 2 versions']}),
  cssnano()
];

// Build custom PrismJS version with NSIS
gulp.task('uglify', (done) => {
  gulp.src(jsFiles)
  .pipe(uglify(options))
  .pipe(gulp.dest('dist'));
  done();
});

gulp.task('cssnano', (done) => {
   gulp.src('./src/*.css')
  .pipe(postcss(plugins))
  .pipe(gulp.dest('dist'));
  done();
});

// Lint JavaScript files
gulp.task('lint', (done) => {
  gulp.src(jsFiles)
  .pipe(debug({title: 'eslint:'}))
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
  done();
});

// Tasks
gulp.task('build', gulp.series('cssnano', 'uglify', function(done) {
  done();
}));

gulp.task('default', gulp.series('lint', 'build', function(done) {
  done();
}));
