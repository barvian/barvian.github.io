import gulp from 'gulp';
import bower from 'bower';
import gulpfile from 'gulpfile';
import cleanTask from 'gulpfile/tasks/clean';
import cp from 'child_process';
import fs from 'fs';
import yaml from 'js-yaml';

// Project paths
const src     = '_assets';
const tmp     = 'tmp';
const vendor  = 'scripts/vendor';
const dest    = 'public';

// Jekyll config
const config  = '_config.yml';
const jekyll  = yaml.safeLoad(fs.readFileSync(`./${config}`, 'utf8'));

gulp.task('jekyll:build', (cb) => {
  cp.spawn('jekyll', ['build', '--incremental', '--no-watch', '--config', config],
    {stdio: 'inherit'}
  ).on('close', cb);
});

gulp.task('jekyll:watch', () => {
  return gulp.watch([
    config,
    '*.{html,md}', '!README.md',
    `{
      ${jekyll.plugins_dir},
      ${jekyll.layouts_dir},
      ${jekyll.includes_dir},
      ${jekyll.data_dir},
      ${Object.keys(jekyll.collections).map(c => '_'+c).join()}
    }/**/*`,
  ], ['jekyll:build']);
});

gulp.task('jekyll:clean', () => {
  return cleanTask(jekyll.destination);
});

gulpfile(gulp, {
  styles: {
    src: `${src}/styles/barvian.scss`,
    all: [`${src}/styles/**/*.scss`, `${src}/variables.json`],
    includePaths: [bower.config.directory],
    dest: [`${dest}/styles`, `${jekyll.destination}/${dest}/styles`],
    autoprefixer: {
      browsers: ['> 5%', 'last 2 versions'],
      cascade: false
    }
  },

  scripts: {
    src: `${src}/scripts/barvian.js`,
    dest: [`${dest}/scripts`, `${jekyll.destination}/${dest}/scripts`],
    bundle: 'barvian'
  },

  copy: {
    base: src,
    src: [
      `${vendor}/modernizr*.js`
    ],
    dest: [dest, `${jekyll.destination}/${dest}`]
  },

  fonts: {
    src: `${src}/fonts/**/*`,
    dest: [`${dest}/fonts`, `${jekyll.destination}/${dest}/fonts`]
  },

  images: {
    src: `${src}/images/**/*`,
    dest: [`${dest}/images`, `${jekyll.destination}/${dest}/images`]
  },

  sprites: {
    src: `${src}/sprites/**/*`,
    dest: jekyll.includes_dir
  },

  watch: {
    promptsReload: `${jekyll.destination}/**/*.html`,
    browserSync: {
      server: jekyll.destination,
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
