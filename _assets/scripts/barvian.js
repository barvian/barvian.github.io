import * as config from '../../_config.yml';
import pictureFill from 'picturefill'; // eslint-disable-line no-unused-vars
import routing from './routing'; // eslint-disable-line no-unused-vars
import attachFastClick from 'fastclick';

// barvian.me
// ==========

// Fast click for all
attachFastClick(document.body);

// Grab a reference to our auto-binding template
// and give it some initial binding values
const app = document.getElementById('app');

// Set app base URL to one specified in Jekyll config
app.baseUrl = config.baseurl || '/';

// This keeps the nav functioning on work pages
app.compressRoute = function(route) {
  if (route.startsWith('/work/')) {
    return '/';
  }
  return route;
};
