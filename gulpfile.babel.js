import gulp from 'gulp';
import tasks from 'barvian-tasks';
import cleanTask from 'barvian-tasks/tasks/clean';
import _bower from 'bower'; const bower = _bower.config.directory;
import cp from 'child_process';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

// Project paths
const src = '_assets';
const vendor = 'scripts/vendor';
const dest = 'public';

// Jekyll config
const config = '_config.yml';
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const jekyll = yaml.safeLoad(fs.readFileSync(`./${config}`, 'utf8'));

gulp.task('components:build', () => {
  return gulp.src([
    `${bower}/webcomponentsjs/webcomponents-lite.min.js`
  ]).pipe(gulp.dest(`${dest}/${vendor}`));
});

gulp.task('components:clean', () => {
  return cleanTask(`${dest}/${vendor}/webcomponents-lite.min.js`);
});

gulp.task('jekyll:build', cb => {
  cp.spawn('jekyll', ['build', '-I', '--no-watch', '--config', config],
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
      ${Object.keys(jekyll.collections).map(c => `_${c}`).join()}
    }/**/*`.replace(/\s/g, '')
  ], ['jekyll:build']);
});

gulp.task('jekyll:clean', () => {
  return cleanTask(jekyll.destination);
});

tasks(gulp, {
  browserSync: {
    files: [
      `${jekyll.destination}/**/*.html`,
      `!${jekyll.destination}/${dest}/elements/**/*`
    ],
    server: jekyll.destination,
    scrollElementMapping: ['[role="main"]'],
    snippetOptions: {
      rule: {
        match: /<\/html>/i,
        fn: (snippet, match) => snippet + match
      }
    }
  },

  elements: {
    base: `${src}/elements`,
    entry: 'barvian.html',
    dest: [`${dest}/elements`, `${jekyll.destination}/${dest}/elements`]
  },

  styles: {
    src: `${src}/styles/barvian.scss`,
    all: [`${src}/styles/**/*.scss`, `${src}/variables.json`],
    includePaths: [bower],
    dest: [`${dest}/styles`, `${jekyll.destination}/${dest}/styles`]
  },

  scripts: {
    src: `${src}/scripts/barvian.js`,
    all: [
      `${src}/scripts/**/*.js`,
      `!${src}/${vendor}/**/*`,
      path.basename(__filename)
    ],
    bundle: 'barvian.js',
    dest: [`${dest}/scripts`, `${jekyll.destination}/${dest}/scripts`]
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
  }
});
