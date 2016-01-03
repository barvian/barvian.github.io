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
}));

function buildComponents() {
  return gulp.src([
    `${bower}/webcomponentsjs/webcomponents-lite.min.js`
  ]).pipe(gulp.dest(`${dest}/${vendor}`));
}
buildComponents.displayName = 'components:build';
buildComponents.description = 'Copy bower components';
gulp.task(buildComponents);

function cleanComponents() {
  return del([
    `${dest}/${vendor}/webcomponents-lite.min.js`
  ]);
}
cleanComponents.displayName = 'components:clean';
cleanComponents.description = 'Clean copied components';
gulp.task(cleanComponents);

function runJekyll(done) {
  cp.spawn('jekyll', ['build', '-I', '--no-watch', '--config', config],
    {stdio: 'inherit'}
  ).on('close', done);
}
runJekyll.displayName = 'jekyll';
runJekyll.description = 'Generate jekyll build';
gulp.task(runJekyll);

function watchJekyll() {
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
  ], runJekyll);
}
watchJekyll.displayName = 'jekyll:watch';
watchJekyll.description = 'Watch jekyll files and re-generate';
gulp.task(watchJekyll);

function cleanJekyll() {
  return del(jekyll.destination);
}
cleanJekyll.displayName = 'jekyll:clean';
cleanJekyll.description = 'Clean jekyll';
gulp.task(cleanJekyll);

let oldBuild = gulp.task('build');
gulp.task('build', gulp.series(oldBuild, runJekyll));
