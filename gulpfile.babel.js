/* eslint-disable require-jsdoc */
import gulp from 'gulp';
import CommonRegistry from 'barvian-registry';
import del from 'del';
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
const jekyll = yaml.safeLoad(fs.readFileSync(`./${config}`, 'utf8'));

gulp.registry(new CommonRegistry({
  browserSync: {
    files: [
      `${jekyll.destination}/**/*.html`,
      `!${jekyll.destination}/${dest}/elements/**/*`
    ],
    server: jekyll.destination,
    snippetOptions: {
      rule: {
        match: /<\/body\>/i,
        fn: (snippet, match) => snippet + match
      }
    }
  },

  copy: {
    src: [
      `${bower}/webcomponentsjs/webcomponents-lite.min.js`,
      `${src}/${vendor}/modernizr*.js`
    ],
    dest: [`${dest}/${vendor}`, `${jekyll.destination}/${dest}/${vendor}`]
  },

  elements: {
    base: `${src}/elements`,
    entry: 'barvian.html',
    dest: [`${dest}/elements`, `${jekyll.destination}/${dest}/elements`],
    includePaths: [bower]
  },

  styles: {
    src: `${src}/styles/{app,barvian}.scss`,
    all: [`${src}/styles/**/*.scss`, `${src}/variables.json`],
    includePaths: [bower],
    dest: [`${dest}/styles`, `${jekyll.destination}/${dest}/styles`],
    modularize: 'app.css'
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
    dest: [`${dest}`, `${jekyll.destination}/${dest}`]
  }
}));

gulp.task('jekyll', done => {
  cp.spawn('jekyll', ['build', '-I', '--no-watch', '--config', config],
    {stdio: 'inherit'}
  ).on('close', done);
});

gulp.task('jekyll:watch', () => {
  gulp.watch([
    config,
    '*.{html,md}', '!README.md',
    `{
      ${jekyll.plugins_dir},
      ${jekyll.layouts_dir},
      ${jekyll.includes_dir},
      ${jekyll.data_dir},
      ${Object.keys(jekyll.collections).map(c => `_${c}`).join()}
    }/**/*`.replace(/\s/g, '')
  ], gulp.task('jekyll'));
});

gulp.task('jekyll:clean', () => {
  return del(jekyll.destination);
});

let oldBuild = gulp.task('build');
gulp.task('build', gulp.series(oldBuild, 'jekyll'));
