import gulp from 'gulp';
import bower from 'bower';
import gulpfile from 'gulpfile';
import cp from 'child_process';

// Project paths
const src     = '_assets';
const tmp     = 'tmp';
const vendor  = 'scripts/vendor';
const dest    = 'public';
const site    = '_site';

gulpfile(gulp, {
  styles: {
    src: `${src}/styles/barvian.scss`,
    all: [`${src}/styles/**/*.scss`, `${src}/variables.json`],
    includePaths: [bower.config.directory],
    dest: [`${dest}/styles`, `${site}/${dest}/styles`],
    autoprefixer: {
      browsers: ['> 5%', 'last 2 versions'],
      cascade: false
    }
  },

  scripts: {
    src: `${src}/scripts/barvian.js`,
    dest: [`${dest}/scripts`, `${site}/${dest}/scripts`],
    bundle: 'barvian'
  },

  copy: {
    base: src,
    src: [
      `${vendor}/modernizr*.js`
    ],
    dest: [dest, `${site}/${dest}`]
  },

  fonts: {
    src: `${src}/fonts/**/*`,
    dest: [`${dest}/fonts`, `${site}/${dest}/fonts`]
  },

  images: {
    src: `${src}/images/**/*`,
    dest: [`${dest}/images`, `${site}/${dest}/images`]
  },

  sprites: {
    src: `${src}/sprites/**/*`,
    dest: '_includes'
  },

  clean: [
    site
  ],

  watch: {
    promptsReload: `${site}/**/*.html`,
    browserSync: {
      server: site,
      logPrefix: 'Barvian',
      scrollElementMapping: ['[role="main"]'],
      snippetOptions: {
        rule: {
          match: /<\/html>/i,
          fn: function (snippet, match) {
            return snippet + match;
          }
        }
      }
    }
  }
});

gulp.task('jekyll-build', (cb) => {
  cp.spawn('jekyll', ['build', '--incremental', '--no-watch'], {stdio: 'inherit'})
    .on('close', cb);
});

gulp.task('jekyll-watch', ['watch'], (cb) => {
  gulp.watch([
    '_config.yml',
    '*.{html,md}',
    '{_includes,_layouts,_projects}/**/*',
  ], ['jekyll-build']);
});

gulp.task('jekyll-default', ['jekyll-build', 'build', 'jekyll-watch']);
