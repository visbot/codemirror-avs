// Dependencies
const concat = require('gulp-concat');
const debug  = require('gulp-debug');
const gulp   = require('gulp');
const eslint = require('gulp-eslint');
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

// Build custom PrismJS version with NSIS
gulp.task('build', (done) => {
    gulp.src(jsFiles)
        .pipe(uglify(options))
        .pipe(concat('avs.min.js'))
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
gulp.task('default', gulp.series('lint', 'build', function(done) {
  done();
}));
