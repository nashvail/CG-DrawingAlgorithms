const fs = require('fs');
const gulp = require('gulp');
const rollup = require('rollup').rollup;
const through = require('through');

const paths = {
  js: ['./js/**/*.js']
}

gulp.task('rollup', () => {
  return gulp.src('js/main.js')
    .pipe(through(function(file) {
      rollup({
        entry: file.path,
        plugins: []
      }).then((bundle)=> {
        var result = bundle.generate({
          format: 'iife'
        });
        fs.writeFileSync('./js/bundle.js', result.code);
        this.emit('data', file);
      });
    }))
});

gulp.task('watch', ['default'], () => {
  gulp.watch(paths.js, ['rollup']);
});

gulp.task('default', ['rollup']);