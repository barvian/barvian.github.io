(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.page=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
  /* globals require, module */

  'use strict';

  /**
   * Module dependencies.
   */

  var pathtoRegexp = require('path-to-regexp');

  /**
   * Module exports.
   */

  module.exports = page;

  /**
   * Detect click event
   */
  var clickEvent = ('undefined' !== typeof document) && document.ontouchstart ? 'touchstart' : 'click';

  /**
   * To work properly with the URL
   * history.location generated polyfill in https://github.com/devote/HTML5-History-API
   */

  var location = ('undefined' !== typeof window) && (window.history.location || window.location);

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;


  /**
   * Decode URL components (query string, pathname, hash).
   * Accommodates both regular percent encoding and x-www-form-urlencoded format.
   */
  var decodeURLComponents = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Running flag.
   */

  var running;

  /**
   * HashBang option
   */

  var hashbang = false;

  /**
   * Previous context, for capturing
   * page exit events.
   */

  var prevContext;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or redirection,
   * or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page('/from', '/to')
   *   page();
   *
   * @param {String|Function} path
   * @param {Function} fn...
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' === typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' === typeof fn) {
      var route = new Route(path);
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
      // show <path> with [state]
    } else if ('string' === typeof path) {
      page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
      // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];
  page.exits = [];

  /**
   * Current path being processed
   * @type {String}
   */
  page.current = '';

  /**
   * Number of pages navigated to.
   * @type {number}
   *
   *     page.len == 0;
   *     page('/login');
   *     page.len == 1;
   */

  page.len = 0;

  /**
   * Get or set basepath to `path`.
   *
   * @param {String} path
   * @api public
   */

  page.base = function(path) {
    if (0 === arguments.length) return base;
    base = path;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options) {
    options = options || {};
    if (running) return;
    running = true;
    if (false === options.dispatch) dispatch = false;
    if (false === options.decodeURLComponents) decodeURLComponents = false;
    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) {
      document.addEventListener(clickEvent, onclick, false);
    }
    if (true === options.hashbang) hashbang = true;
    if (!dispatch) return;
    var url = (hashbang && ~location.hash.indexOf('#!')) ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
    page.replace(url, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function() {
    if (!running) return;
    page.current = '';
    page.len = 0;
    running = false;
    document.removeEventListener(clickEvent, onclick, false);
    window.removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @param {Boolean} dispatch
   * @return {Context}
   * @api public
   */

  page.show = function(path, state, dispatch, push) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    if (false !== dispatch) page.dispatch(ctx);
    if (false !== ctx.handled && false !== push) ctx.pushState();
    return ctx;
  };

  /**
   * Goes back in the history
   * Back should always let the current route push state and then go back.
   *
   * @param {String} path - fallback path to go back if no more history exists, if undefined defaults to page.base
   * @param {Object} [state]
   * @api public
   */

  page.back = function(path, state) {
    if (page.len > 0) {
      // this may need more testing to see if all browsers
      // wait for the next tick to go back in history
      history.back();
      page.len--;
    } else if (path) {
      setTimeout(function() {
        page.show(path, state);
      });
    }else{
      setTimeout(function() {
        page.show(base, state);
      });
    }
  };


  /**
   * Register route to redirect from one path to other
   * or just redirect to another route
   *
   * @param {String} from - if param 'to' is undefined redirects to 'from'
   * @param {String} [to]
   * @api public
   */
  page.redirect = function(from, to) {
    // Define route from a path to another
    if ('string' === typeof from && 'string' === typeof to) {
      page(from, function(e) {
        setTimeout(function() {
          page.replace(to);
        }, 0);
      });
    }

    // Wait for the push state and replace it with another
    if ('string' === typeof from && 'undefined' === typeof to) {
      setTimeout(function() {
        page.replace(from);
      }, 0);
    }
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @return {Context}
   * @api public
   */


  page.replace = function(path, state, init, dispatch) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    ctx.init = init;
    ctx.save(); // save before dispatching, which may redirect
    if (false !== dispatch) page.dispatch(ctx);
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Object} ctx
   * @api private
   */

  page.dispatch = function(ctx) {
    var prev = prevContext,
      i = 0,
      j = 0;

    prevContext = ctx;

    function nextExit() {
      var fn = page.exits[j++];
      if (!fn) return nextEnter();
      fn(prev, nextExit);
    }

    function nextEnter() {
      var fn = page.callbacks[i++];

      if (ctx.path !== page.current) {
        ctx.handled = false;
        return;
      }
      if (!fn) return unhandled(ctx);
      fn(ctx, nextEnter);
    }

    if (prev) {
      nextExit();
    } else {
      nextEnter();
    }
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */

  function unhandled(ctx) {
    if (ctx.handled) return;
    var current;

    if (hashbang) {
      current = base + location.hash.replace('#!', '');
    } else {
      current = location.pathname + location.search;
    }

    if (current === ctx.canonicalPath) return;
    page.stop();
    ctx.handled = false;
    location.href = ctx.canonicalPath;
  }

  /**
   * Register an exit route on `path` with
   * callback `fn()`, which will be called
   * on the previous context when a new
   * page is visited.
   */
  page.exit = function(path, fn) {
    if (typeof path === 'function') {
      return page.exit('*', path);
    }

    var route = new Route(path);
    for (var i = 1; i < arguments.length; ++i) {
      page.exits.push(route.middleware(arguments[i]));
    }
  };

  /**
   * Remove URL encoding from the given `str`.
   * Accommodates whitespace in both x-www-form-urlencoded
   * and regular percent-encoded form.
   *
   * @param {str} URL component to decode
   */
  function decodeURLEncodedURIComponent(val) {
    if (typeof val !== 'string') { return val; }
    return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @param {String} path
   * @param {Object} state
   * @api public
   */

  function Context(path, state) {
    if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + (hashbang ? '#!' : '') + path;
    var i = path.indexOf('?');

    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';
    if (hashbang) this.path = this.path.replace('#!', '') || '/';

    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
    this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
    this.params = {};

    // fragment
    this.hash = '';
    if (!hashbang) {
      if (!~this.path.indexOf('#')) return;
      var parts = this.path.split('#');
      this.path = parts[0];
      this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
      this.querystring = this.querystring.split('#')[0];
    }
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function() {
    page.len++;
    history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function() {
    history.replaceState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @param {String} path
   * @param {Object} options.
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = (path === '*') ? '(.*)' : path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(this.path,
      this.keys = [],
      options.sensitive,
      options.strict);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn) {
    var self = this;
    return function(ctx, next) {
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    };
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {String} path
   * @param {Object} params
   * @return {Boolean}
   * @api private
   */

  Route.prototype.match = function(path, params) {
    var keys = this.keys,
      qsIndex = path.indexOf('?'),
      pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
      m = this.regexp.exec(decodeURIComponent(pathname));

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];
      var val = decodeURLEncodedURIComponent(m[i]);
      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
        params[key.name] = val;
      }
    }

    return true;
  };


  /**
   * Handle "populate" events.
   */

  var onpopstate = (function () {
    var loaded = false;
    if ('undefined' === typeof window) {
      return;
    }
    if (document.readyState === 'complete') {
      loaded = true;
    } else {
      window.addEventListener('load', function() {
        setTimeout(function() {
          loaded = true;
        }, 0);
      });
    }
    return function onpopstate(e) {
      if (!loaded) return;
      if (e.state) {
        var path = e.state.path;
        page.replace(path, e.state);
      } else {
        page.show(location.pathname + location.hash, undefined, undefined, false);
      }
    };
  })();
  /**
   * Handle "click" events.
   */

  function onclick(e) {

    if (1 !== which(e)) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;



    // ensure link
    var el = e.target;
    while (el && 'A' !== el.nodeName) el = el.parentNode;
    if (!el || 'A' !== el.nodeName) return;



    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

    // ensure non-hash for the same path
    var link = el.getAttribute('href');
    if (!hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) return;



    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) return;

    // check target
    if (el.target) return;

    // x-origin
    if (!sameOrigin(el.href)) return;



    // rebuild path
    var path = el.pathname + el.search + (el.hash || '');

    // strip leading "/[drive letter]:" on NW.js on Windows
    if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
      path = path.replace(/^\/[a-zA-Z]:\//, '/');
    }

    // same page
    var orig = path;

    if (path.indexOf(base) === 0) {
      path = path.substr(base.length);
    }

    if (hashbang) path = path.replace('#!', '');

    if (base && orig === path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null === e.which ? e.button : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return (href && (0 === href.indexOf(origin)));
  }

  page.sameOrigin = sameOrigin;

}).call(this,require('_process'))
},{"_process":2,"path-to-regexp":3}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],3:[function(require,module,exports){
var isarray = require('isarray')

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {String} str
 * @return {Array}
 */
function parse (str) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var suffix = res[6]
    var asterisk = res[7]

    var repeat = suffix === '+' || suffix === '*'
    var optional = suffix === '?' || suffix === '*'
    var delimiter = prefix || '/'
    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      pattern: escapeGroup(pattern)
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {String}   str
 * @return {Function}
 */
function compile (str) {
  return tokensToFunction(parse(str))
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^' + tokens[i].pattern + '$')
    }
  }

  return function (obj) {
    var path = ''
    var data = obj || {}

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encodeURIComponent(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = encodeURIComponent(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {String} str
 * @return {String}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function stringToRegexp (path, keys, options) {
  var tokens = parse(path)
  var re = tokensToRegExp(tokens, options)

  // Attach keys back to the regexp.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] !== 'string') {
      keys.push(tokens[i])
    }
  }

  return attachKeys(re, keys)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {Array}  tokens
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function tokensToRegExp (tokens, options) {
  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''
  var lastToken = tokens[tokens.length - 1]
  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = token.pattern

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (prefix) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)'
  }

  return new RegExp('^' + route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [options]
 * @return {RegExp}
 */
function pathToRegexp (path, keys, options) {
  keys = keys || []

  if (!isarray(keys)) {
    options = keys
    keys = []
  } else if (!options) {
    options = {}
  }

  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys, options)
  }

  if (isarray(path)) {
    return arrayToRegexp(path, keys, options)
  }

  return stringToRegexp(path, keys, options)
}

},{"isarray":4}],4:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":8,"isarray":6,"path-to-regexp":7}],2:[function(require,module,exports){
/*! Picturefill - v2.3.1 - 2015-04-09
* http://scottjehl.github.io/picturefill
* Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT */
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
	"use strict";

	// For browsers that support matchMedium api such as IE 9 and webkit
	var styleMedia = (window.styleMedia || window.media);

	// For those that don't support matchMedium
	if (!styleMedia) {
		var style       = document.createElement('style'),
			script      = document.getElementsByTagName('script')[0],
			info        = null;

		style.type  = 'text/css';
		style.id    = 'matchmediajs-test';

		script.parentNode.insertBefore(style, script);

		// 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
		info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

		styleMedia = {
			matchMedium: function(media) {
				var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

				// 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
				if (style.styleSheet) {
					style.styleSheet.cssText = text;
				} else {
					style.textContent = text;
				}

				// Test if media query is true or false
				return info.width === '1px';
			}
		};
	}

	return function(media) {
		return {
			matches: styleMedia.matchMedium(media || 'all'),
			media: media || 'all'
		};
	};
}());
/*! Picturefill - Responsive Images that work today.
*  Author: Scott Jehl, Filament Group, 2012 ( new proposal implemented by Shawn Jansepar )
*  License: MIT/GPLv2
*  Spec: http://picture.responsiveimages.org/
*/
(function( w, doc, image ) {
	// Enable strict mode
	"use strict";

	function expose(picturefill) {
		/* expose picturefill */
		if ( typeof module === "object" && typeof module.exports === "object" ) {
			// CommonJS, just export
			module.exports = picturefill;
		} else if ( typeof define === "function" && define.amd ) {
			// AMD support
			define( "picturefill", function() { return picturefill; } );
		}
		if ( typeof w === "object" ) {
			// If no AMD and we are in the browser, attach to window
			w.picturefill = picturefill;
		}
	}

	// If picture is supported, well, that's awesome. Let's get outta here...
	if ( w.HTMLPictureElement ) {
		expose(function() { });
		return;
	}

	// HTML shim|v it for old IE (IE9 will still need the HTML video tag workaround)
	doc.createElement( "picture" );

	// local object for method references and testing exposure
	var pf = w.picturefill || {};

	var regWDesc = /\s+\+?\d+(e\d+)?w/;

	// namespace
	pf.ns = "picturefill";

	// srcset support test
	(function() {
		pf.srcsetSupported = "srcset" in image;
		pf.sizesSupported = "sizes" in image;
		pf.curSrcSupported = "currentSrc" in image;
	})();

	// just a string trim workaround
	pf.trim = function( str ) {
		return str.trim ? str.trim() : str.replace( /^\s+|\s+$/g, "" );
	};

	/**
	 * Gets a string and returns the absolute URL
	 * @param src
	 * @returns {String} absolute URL
	 */
	pf.makeUrl = (function() {
		var anchor = doc.createElement( "a" );
		return function(src) {
			anchor.href = src;
			return anchor.href;
		};
	})();

	/**
	 * Shortcut method for https://w3c.github.io/webappsec/specs/mixedcontent/#restricts-mixed-content ( for easy overriding in tests )
	 */
	pf.restrictsMixedContent = function() {
		return w.location.protocol === "https:";
	};
	/**
	 * Shortcut method for matchMedia ( for easy overriding in tests )
	 */

	pf.matchesMedia = function( media ) {
		return w.matchMedia && w.matchMedia( media ).matches;
	};

	// Shortcut method for `devicePixelRatio` ( for easy overriding in tests )
	pf.getDpr = function() {
		return ( w.devicePixelRatio || 1 );
	};

	/**
	 * Get width in css pixel value from a "length" value
	 * http://dev.w3.org/csswg/css-values-3/#length-value
	 */
	pf.getWidthFromLength = function( length ) {
		var cssValue;
		// If a length is specified and doesn’t contain a percentage, and it is greater than 0 or using `calc`, use it. Else, abort.
        if ( !(length && length.indexOf( "%" ) > -1 === false && ( parseFloat( length ) > 0 || length.indexOf( "calc(" ) > -1 )) ) {
            return false;
        }

		/**
		 * If length is specified in  `vw` units, use `%` instead since the div we’re measuring
		 * is injected at the top of the document.
		 *
		 * TODO: maybe we should put this behind a feature test for `vw`? The risk of doing this is possible browser inconsistancies with vw vs %
		 */
		length = length.replace( "vw", "%" );

		// Create a cached element for getting length value widths
		if ( !pf.lengthEl ) {
			pf.lengthEl = doc.createElement( "div" );

			// Positioning styles help prevent padding/margin/width on `html` or `body` from throwing calculations off.
			pf.lengthEl.style.cssText = "border:0;display:block;font-size:1em;left:0;margin:0;padding:0;position:absolute;visibility:hidden";

			// Add a class, so that everyone knows where this element comes from
			pf.lengthEl.className = "helper-from-picturefill-js";
		}

		pf.lengthEl.style.width = "0px";

        try {
		    pf.lengthEl.style.width = length;
        } catch ( e ) {}

		doc.body.appendChild(pf.lengthEl);

		cssValue = pf.lengthEl.offsetWidth;

		if ( cssValue <= 0 ) {
			cssValue = false;
		}

		doc.body.removeChild( pf.lengthEl );

		return cssValue;
	};

    pf.detectTypeSupport = function( type, typeUri ) {
        // based on Modernizr's lossless img-webp test
        // note: asynchronous
        var image = new w.Image();
        image.onerror = function() {
            pf.types[ type ] = false;
            picturefill();
        };
        image.onload = function() {
            pf.types[ type ] = image.width === 1;
            picturefill();
        };
        image.src = typeUri;

        return "pending";
    };
	// container of supported mime types that one might need to qualify before using
	pf.types = pf.types || {};

	pf.initTypeDetects = function() {
        // Add support for standard mime types
        pf.types[ "image/jpeg" ] = true;
        pf.types[ "image/gif" ] = true;
        pf.types[ "image/png" ] = true;
        pf.types[ "image/svg+xml" ] = doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
        pf.types[ "image/webp" ] = pf.detectTypeSupport("image/webp", "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=");
    };

	pf.verifyTypeSupport = function( source ) {
		var type = source.getAttribute( "type" );
		// if type attribute exists, return test result, otherwise return true
		if ( type === null || type === "" ) {
			return true;
		} else {
				var pfType = pf.types[ type ];
			// if the type test is a function, run it and return "pending" status. The function will rerun picturefill on pending elements once finished.
			if ( typeof pfType === "string" && pfType !== "pending") {
				pf.types[ type ] = pf.detectTypeSupport( type, pfType );
				return "pending";
			} else if ( typeof pfType === "function" ) {
				pfType();
				return "pending";
			} else {
				return pfType;
			}
		}
	};

	// Parses an individual `size` and returns the length, and optional media query
	pf.parseSize = function( sourceSizeStr ) {
		var match = /(\([^)]+\))?\s*(.+)/g.exec( sourceSizeStr );
		return {
			media: match && match[1],
			length: match && match[2]
		};
	};

	// Takes a string of sizes and returns the width in pixels as a number
	pf.findWidthFromSourceSize = function( sourceSizeListStr ) {
		// Split up source size list, ie ( max-width: 30em ) 100%, ( max-width: 50em ) 50%, 33%
		//                            or (min-width:30em) calc(30% - 15px)
		var sourceSizeList = pf.trim( sourceSizeListStr ).split( /\s*,\s*/ ),
			winningLength;

		for ( var i = 0, len = sourceSizeList.length; i < len; i++ ) {
			// Match <media-condition>? length, ie ( min-width: 50em ) 100%
			var sourceSize = sourceSizeList[ i ],
				// Split "( min-width: 50em ) 100%" into separate strings
				parsedSize = pf.parseSize( sourceSize ),
				length = parsedSize.length,
				media = parsedSize.media;

			if ( !length ) {
				continue;
			}
			// if there is no media query or it matches, choose this as our winning length
			if ( (!media || pf.matchesMedia( media )) &&
				// pass the length to a method that can properly determine length
				// in pixels based on these formats: http://dev.w3.org/csswg/css-values-3/#length-value
				(winningLength = pf.getWidthFromLength( length )) ) {
				break;
			}
		}

		//if we have no winningLength fallback to 100vw
		return winningLength || Math.max(w.innerWidth || 0, doc.documentElement.clientWidth);
	};

	pf.parseSrcset = function( srcset ) {
		/**
		 * A lot of this was pulled from Boris Smus’ parser for the now-defunct WHATWG `srcset`
		 * https://github.com/borismus/srcset-polyfill/blob/master/js/srcset-info.js
		 *
		 * 1. Let input (`srcset`) be the value passed to this algorithm.
		 * 2. Let position be a pointer into input, initially pointing at the start of the string.
		 * 3. Let raw candidates be an initially empty ordered list of URLs with associated
		 *    unparsed descriptors. The order of entries in the list is the order in which entries
		 *    are added to the list.
		 */
		var candidates = [];

		while ( srcset !== "" ) {
			srcset = srcset.replace( /^\s+/g, "" );

			// 5. Collect a sequence of characters that are not space characters, and let that be url.
			var pos = srcset.search(/\s/g),
				url, descriptor = null;

			if ( pos !== -1 ) {
				url = srcset.slice( 0, pos );

				var last = url.slice(-1);

				// 6. If url ends with a U+002C COMMA character (,), remove that character from url
				// and let descriptors be the empty string. Otherwise, follow these substeps
				// 6.1. If url is empty, then jump to the step labeled descriptor parser.

				if ( last === "," || url === "" ) {
					url = url.replace( /,+$/, "" );
					descriptor = "";
				}
				srcset = srcset.slice( pos + 1 );

				// 6.2. Collect a sequence of characters that are not U+002C COMMA characters (,), and
				// let that be descriptors.
				if ( descriptor === null ) {
					var descpos = srcset.indexOf( "," );
					if ( descpos !== -1 ) {
						descriptor = srcset.slice( 0, descpos );
						srcset = srcset.slice( descpos + 1 );
					} else {
						descriptor = srcset;
						srcset = "";
					}
				}
			} else {
				url = srcset;
				srcset = "";
			}

			// 7. Add url to raw candidates, associated with descriptors.
			if ( url || descriptor ) {
				candidates.push({
					url: url,
					descriptor: descriptor
				});
			}
		}
		return candidates;
	};

	pf.parseDescriptor = function( descriptor, sizesattr ) {
		// 11. Descriptor parser: Let candidates be an initially empty source set. The order of entries in the list
		// is the order in which entries are added to the list.
		var sizes = sizesattr || "100vw",
			sizeDescriptor = descriptor && descriptor.replace( /(^\s+|\s+$)/g, "" ),
			widthInCssPixels = pf.findWidthFromSourceSize( sizes ),
			resCandidate;

			if ( sizeDescriptor ) {
				var splitDescriptor = sizeDescriptor.split(" ");

				for (var i = splitDescriptor.length - 1; i >= 0; i--) {
					var curr = splitDescriptor[ i ],
						lastchar = curr && curr.slice( curr.length - 1 );

					if ( ( lastchar === "h" || lastchar === "w" ) && !pf.sizesSupported ) {
						resCandidate = parseFloat( ( parseInt( curr, 10 ) / widthInCssPixels ) );
					} else if ( lastchar === "x" ) {
						var res = curr && parseFloat( curr, 10 );
						resCandidate = res && !isNaN( res ) ? res : 1;
					}
				}
			}
		return resCandidate || 1;
	};

	/**
	 * Takes a srcset in the form of url/
	 * ex. "images/pic-medium.png 1x, images/pic-medium-2x.png 2x" or
	 *     "images/pic-medium.png 400w, images/pic-medium-2x.png 800w" or
	 *     "images/pic-small.png"
	 * Get an array of image candidates in the form of
	 *      {url: "/foo/bar.png", resolution: 1}
	 * where resolution is http://dev.w3.org/csswg/css-values-3/#resolution-value
	 * If sizes is specified, resolution is calculated
	 */
	pf.getCandidatesFromSourceSet = function( srcset, sizes ) {
		var candidates = pf.parseSrcset( srcset ),
			formattedCandidates = [];

		for ( var i = 0, len = candidates.length; i < len; i++ ) {
			var candidate = candidates[ i ];

			formattedCandidates.push({
				url: candidate.url,
				resolution: pf.parseDescriptor( candidate.descriptor, sizes )
			});
		}
		return formattedCandidates;
	};

	/**
	 * if it's an img element and it has a srcset property,
	 * we need to remove the attribute so we can manipulate src
	 * (the property's existence infers native srcset support, and a srcset-supporting browser will prioritize srcset's value over our winning picture candidate)
	 * this moves srcset's value to memory for later use and removes the attr
	 */
	pf.dodgeSrcset = function( img ) {
		if ( img.srcset ) {
			img[ pf.ns ].srcset = img.srcset;
			img.srcset = "";
			img.setAttribute( "data-pfsrcset", img[ pf.ns ].srcset );
		}
	};

	// Accept a source or img element and process its srcset and sizes attrs
	pf.processSourceSet = function( el ) {
		var srcset = el.getAttribute( "srcset" ),
			sizes = el.getAttribute( "sizes" ),
			candidates = [];

		// if it's an img element, use the cached srcset property (defined or not)
		if ( el.nodeName.toUpperCase() === "IMG" && el[ pf.ns ] && el[ pf.ns ].srcset ) {
			srcset = el[ pf.ns ].srcset;
		}

		if ( srcset ) {
			candidates = pf.getCandidatesFromSourceSet( srcset, sizes );
		}
		return candidates;
	};

	pf.backfaceVisibilityFix = function( picImg ) {
		// See: https://github.com/scottjehl/picturefill/issues/332
		var style = picImg.style || {},
			WebkitBackfaceVisibility = "webkitBackfaceVisibility" in style,
			currentZoom = style.zoom;

		if (WebkitBackfaceVisibility) {
			style.zoom = ".999";

			WebkitBackfaceVisibility = picImg.offsetWidth;

			style.zoom = currentZoom;
		}
	};

	pf.setIntrinsicSize = (function() {
		var urlCache = {};
		var setSize = function( picImg, width, res ) {
            if ( width ) {
			    picImg.setAttribute( "width", parseInt(width / res, 10) );
            }
		};
		return function( picImg, bestCandidate ) {
			var img;
			if ( !picImg[ pf.ns ] || w.pfStopIntrinsicSize ) {
				return;
			}
			if ( picImg[ pf.ns ].dims === undefined ) {
				picImg[ pf.ns].dims = picImg.getAttribute("width") || picImg.getAttribute("height");
			}
			if ( picImg[ pf.ns].dims ) { return; }

			if ( bestCandidate.url in urlCache ) {
				setSize( picImg, urlCache[bestCandidate.url], bestCandidate.resolution );
			} else {
				img = doc.createElement( "img" );
				img.onload = function() {
					urlCache[bestCandidate.url] = img.width;

                    //IE 10/11 don't calculate width for svg outside document
                    if ( !urlCache[bestCandidate.url] ) {
                        try {
                            doc.body.appendChild( img );
                            urlCache[bestCandidate.url] = img.width || img.offsetWidth;
                            doc.body.removeChild( img );
                        } catch(e){}
                    }

					if ( picImg.src === bestCandidate.url ) {
						setSize( picImg, urlCache[bestCandidate.url], bestCandidate.resolution );
					}
					picImg = null;
					img.onload = null;
					img = null;
				};
				img.src = bestCandidate.url;
			}
		};
	})();

	pf.applyBestCandidate = function( candidates, picImg ) {
		var candidate,
			length,
			bestCandidate;

		candidates.sort( pf.ascendingSort );

		length = candidates.length;
		bestCandidate = candidates[ length - 1 ];

		for ( var i = 0; i < length; i++ ) {
			candidate = candidates[ i ];
			if ( candidate.resolution >= pf.getDpr() ) {
				bestCandidate = candidate;
				break;
			}
		}

		if ( bestCandidate ) {

			bestCandidate.url = pf.makeUrl( bestCandidate.url );

			if ( picImg.src !== bestCandidate.url ) {
				if ( pf.restrictsMixedContent() && bestCandidate.url.substr(0, "http:".length).toLowerCase() === "http:" ) {
					if ( window.console !== undefined ) {
						console.warn( "Blocked mixed content image " + bestCandidate.url );
					}
				} else {
					picImg.src = bestCandidate.url;
					// currentSrc attribute and property to match
					// http://picture.responsiveimages.org/#the-img-element
					if ( !pf.curSrcSupported ) {
						picImg.currentSrc = picImg.src;
					}

					pf.backfaceVisibilityFix( picImg );
				}
			}

			pf.setIntrinsicSize(picImg, bestCandidate);
		}
	};

	pf.ascendingSort = function( a, b ) {
		return a.resolution - b.resolution;
	};

	/**
	 * In IE9, <source> elements get removed if they aren't children of
	 * video elements. Thus, we conditionally wrap source elements
	 * using <!--[if IE 9]><video style="display: none;"><![endif]-->
	 * and must account for that here by moving those source elements
	 * back into the picture element.
	 */
	pf.removeVideoShim = function( picture ) {
		var videos = picture.getElementsByTagName( "video" );
		if ( videos.length ) {
			var video = videos[ 0 ],
				vsources = video.getElementsByTagName( "source" );
			while ( vsources.length ) {
				picture.insertBefore( vsources[ 0 ], video );
			}
			// Remove the video element once we're finished removing its children
			video.parentNode.removeChild( video );
		}
	};

	/**
	 * Find all `img` elements, and add them to the candidate list if they have
	 * a `picture` parent, a `sizes` attribute in basic `srcset` supporting browsers,
	 * a `srcset` attribute at all, and they haven’t been evaluated already.
	 */
	pf.getAllElements = function() {
		var elems = [],
			imgs = doc.getElementsByTagName( "img" );

		for ( var h = 0, len = imgs.length; h < len; h++ ) {
			var currImg = imgs[ h ];

			if ( currImg.parentNode.nodeName.toUpperCase() === "PICTURE" ||
			( currImg.getAttribute( "srcset" ) !== null ) || currImg[ pf.ns ] && currImg[ pf.ns ].srcset !== null ) {
				elems.push( currImg );
			}
		}
		return elems;
	};

	pf.getMatch = function( img, picture ) {
		var sources = picture.childNodes,
			match;

		// Go through each child, and if they have media queries, evaluate them
		for ( var j = 0, slen = sources.length; j < slen; j++ ) {
			var source = sources[ j ];

			// ignore non-element nodes
			if ( source.nodeType !== 1 ) {
				continue;
			}

			// Hitting the `img` element that started everything stops the search for `sources`.
			// If no previous `source` matches, the `img` itself is evaluated later.
			if ( source === img ) {
				return match;
			}

			// ignore non-`source` nodes
			if ( source.nodeName.toUpperCase() !== "SOURCE" ) {
				continue;
			}
			// if it's a source element that has the `src` property set, throw a warning in the console
			if ( source.getAttribute( "src" ) !== null && typeof console !== undefined ) {
				console.warn("The `src` attribute is invalid on `picture` `source` element; instead, use `srcset`.");
			}

			var media = source.getAttribute( "media" );

			// if source does not have a srcset attribute, skip
			if ( !source.getAttribute( "srcset" ) ) {
				continue;
			}

			// if there's no media specified, OR w.matchMedia is supported
			if ( ( !media || pf.matchesMedia( media ) ) ) {
				var typeSupported = pf.verifyTypeSupport( source );

				if ( typeSupported === true ) {
					match = source;
					break;
				} else if ( typeSupported === "pending" ) {
					return false;
				}
			}
		}

		return match;
	};

	function picturefill( opt ) {
		var elements,
			element,
			parent,
			firstMatch,
			candidates,
			options = opt || {};

		elements = options.elements || pf.getAllElements();

		// Loop through all elements
		for ( var i = 0, plen = elements.length; i < plen; i++ ) {
			element = elements[ i ];
			parent = element.parentNode;
			firstMatch = undefined;
			candidates = undefined;

			// immediately skip non-`img` nodes
			if ( element.nodeName.toUpperCase() !== "IMG" ) {
				continue;
			}

			// expando for caching data on the img
			if ( !element[ pf.ns ] ) {
				element[ pf.ns ] = {};
			}

			// if the element has already been evaluated, skip it unless
			// `options.reevaluate` is set to true ( this, for example,
			// is set to true when running `picturefill` on `resize` ).
			if ( !options.reevaluate && element[ pf.ns ].evaluated ) {
				continue;
			}

			// if `img` is in a `picture` element
			if ( parent && parent.nodeName.toUpperCase() === "PICTURE" ) {

				// IE9 video workaround
				pf.removeVideoShim( parent );

				// return the first match which might undefined
				// returns false if there is a pending source
				// TODO the return type here is brutal, cleanup
				firstMatch = pf.getMatch( element, parent );

				// if any sources are pending in this picture due to async type test(s)
				// remove the evaluated attr and skip for now ( the pending test will
				// rerun picturefill on this element when complete)
				if ( firstMatch === false ) {
					continue;
				}
			} else {
				firstMatch = undefined;
			}

			// Cache and remove `srcset` if present and we’re going to be doing `picture`/`srcset`/`sizes` polyfilling to it.
			if ( ( parent && parent.nodeName.toUpperCase() === "PICTURE" ) ||
			( !pf.sizesSupported && ( element.srcset && regWDesc.test( element.srcset ) ) ) ) {
				pf.dodgeSrcset( element );
			}

			if ( firstMatch ) {
				candidates = pf.processSourceSet( firstMatch );
				pf.applyBestCandidate( candidates, element );
			} else {
				// No sources matched, so we’re down to processing the inner `img` as a source.
				candidates = pf.processSourceSet( element );

				if ( element.srcset === undefined || element[ pf.ns ].srcset ) {
					// Either `srcset` is completely unsupported, or we need to polyfill `sizes` functionality.
					pf.applyBestCandidate( candidates, element );
				} // Else, resolution-only `srcset` is supported natively.
			}

			// set evaluated to true to avoid unnecessary reparsing
			element[ pf.ns ].evaluated = true;
		}
	}

	/**
	 * Sets up picture polyfill by polling the document and running
	 * the polyfill every 250ms until the document is ready.
	 * Also attaches picturefill on resize
	 */
	function runPicturefill() {
		pf.initTypeDetects();
		picturefill();
		var intervalId = setInterval( function() {
			// When the document has finished loading, stop checking for new images
			// https://github.com/ded/domready/blob/master/ready.js#L15
			picturefill();

			if ( /^loaded|^i|^c/.test( doc.readyState ) ) {
				clearInterval( intervalId );
				return;
			}
		}, 250 );

		var resizeTimer;
		var handleResize = function() {
	        picturefill({ reevaluate: true });
	    };
		function checkResize() {
		    clearTimeout(resizeTimer);
		    resizeTimer = setTimeout( handleResize, 60 );
		}

		if ( w.addEventListener ) {
			w.addEventListener( "resize", checkResize, false );
		} else if ( w.attachEvent ) {
			w.attachEvent( "onresize", checkResize );
		}
	}

	runPicturefill();

	/* expose methods for testing */
	picturefill._ = pf;

	expose( picturefill );

} )( window, window.document, new window.Image() );

},{}],3:[function(require,module,exports){
'use strict';var _config = require('../../_config.yml');var config = _interopRequireWildcard(_config);var _picturefill = require("./../bower_components/picturefill/dist/picturefill.js");var _picturefill2 = _interopRequireDefault(_picturefill);var _routing = require('./routing');var _routing2 = _interopRequireDefault(_routing);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}

// eslint-disable-line no-unused-vars

// Barvian.me
// ==========

// Grab a reference to our auto-binding template
// and give it some initial binding values
var app = document.getElementById('app');

// Set app base URL to one specified in Jekyll config
// eslint-disable-line no-unused-vars
app.baseUrl = config.baseurl || '/';
Object.defineProperty(app, 'scroller', { 
  get: function get() {return this.$.pages;} });


app.scroll = function (top) {var _this = this;var duration = arguments.length <= 1 || arguments[1] === undefined ? 200 : arguments[1];
  if (duration > 0) {(function () {
      // TODO(blasten): use CSS scroll-behavior once it ships in Chrome.
      var easingFn = function easeOutQuad(t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;};

      var animationId = Math.random();
      var startTime = Date.now();
      var currentScrollTop = _this.scroller.scrollTop;
      var deltaScrollTop = top - currentScrollTop;

      _this._currentAnimationId = animationId;

      (function updateFrame() {
        var now = Date.now();
        var elapsedTime = now - startTime;

        if (elapsedTime > duration) {
          this.scroller.scrollTop = top;} else 

        if (this._currentAnimationId === animationId) {
          this.scroller.scrollTop = easingFn(elapsedTime, currentScrollTop, deltaScrollTop, duration);
          requestAnimationFrame(updateFrame.bind(this));}}).


      call(_this);})();} else 

  {
    this.scroller.scrollTop = top;}};



// Scroll page to top
app.scrollPageToTop = function () {
  this.scroll(0);};

},{"../../_config.yml":5,"./../bower_components/picturefill/dist/picturefill.js":2,"./routing":4}],4:[function(require,module,exports){
'use strict';var _page = require("./../bower_components/page/page.js");var _page2 = _interopRequireDefault(_page);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

// Routing
// =======

window.addEventListener('WebComponentsReady', function () {
  // Removes end / from app.baseUrl which page.base requires for production
  if (window.location.port === '') {
    _page2.default.base(app.baseUrl.replace(/\/$/, ''));}


  // Middleware
  // ----------

  function scrollToTop(ctx, next) {
    app.scrollPageToTop();
    next();}


  // Routes
  // ------

  (0, _page2.default)('*', scrollToTop, function (ctx, next) {
    next();});


  // Static pages
  [app.baseUrl, '/about/', '/contact/'].forEach(function (url) {
    (0, _page2.default)(url, function () {return app.route = url;});});


  (0, _page2.default)({ 
    hashbang: false });});

},{"./../bower_components/page/page.js":1}],5:[function(require,module,exports){
module.exports = {"name":"Maxwell Barvian","title":"Digital product designer","email":"max@barvian.me","url":"http://barvian.me","baseurl":"","keywords":["designer","web designer","web","developer","web developer","chicago web designer","chicago web developer","front-end development","web design"],"dribbble_username":"barvian","twitter_username":"mbarvian","github_username":"barvian","availability":"full","destination":"_site","plugins_dir":"_plugins","layouts_dir":"_layouts","data_dir":"_data","includes_dir":"_includes","collections":{"works":{"output":true,"permalink":"/work/:path/"}},"exclude":["node_modules","gulpfile.*","package.json","CNAME","bower.json","README.md"],"markdown":"kramdown","permalink":"pretty","defaults":[{"scope":{"path":""},"values":{"layout":"page"}},{"scope":{"path":"","type":"works"},"values":{"layout":"work"}}]}
},{}],6:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],7:[function(require,module,exports){
/**
 * Expose `pathtoRegexp`.
 */

module.exports = pathtoRegexp;

/**
 * Match matching groups in a regular expression.
 */
var MATCHING_GROUP_REGEXP = /\((?!\?)/g;

/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String|RegExp|Array} path
 * @param  {Array} keys
 * @param  {Object} options
 * @return {RegExp}
 * @api private
 */

function pathtoRegexp(path, keys, options) {
  options = options || {};
  keys = keys || [];
  var strict = options.strict;
  var end = options.end !== false;
  var flags = options.sensitive ? '' : 'i';
  var extraOffset = 0;
  var keysOffset = keys.length;
  var i = 0;
  var name = 0;
  var m;

  if (path instanceof RegExp) {
    while (m = MATCHING_GROUP_REGEXP.exec(path.source)) {
      keys.push({
        name: name++,
        optional: false,
        offset: m.index
      });
    }

    return path;
  }

  if (Array.isArray(path)) {
    // Map array parts into regexps and return their source. We also pass
    // the same keys and options instance into every generation to get
    // consistent matching groups before we join the sources together.
    path = path.map(function (value) {
      return pathtoRegexp(value, keys, options).source;
    });

    return new RegExp('(?:' + path.join('|') + ')', flags);
  }

  path = ('^' + path + (strict ? '' : path[path.length - 1] === '/' ? '?' : '/?'))
    .replace(/\/\(/g, '/(?:')
    .replace(/([\/\.])/g, '\\$1')
    .replace(/(\\\/)?(\\\.)?:(\w+)(\(.*?\))?(\*)?(\?)?/g, function (match, slash, format, key, capture, star, optional, offset) {
      slash = slash || '';
      format = format || '';
      capture = capture || '([^\\/' + format + ']+?)';
      optional = optional || '';

      keys.push({
        name: key,
        optional: !!optional,
        offset: offset + extraOffset
      });

      var result = ''
        + (optional ? '' : slash)
        + '(?:'
        + format + (optional ? slash : '') + capture
        + (star ? '((?:[\\/' + format + '].+?)?)' : '')
        + ')'
        + optional;

      extraOffset += result.length - match.length;

      return result;
    })
    .replace(/\*/g, function (star, index) {
      var len = keys.length

      while (len-- > keysOffset && keys[len].offset > index) {
        keys[len].offset += 3; // Replacement length minus asterisk length.
      }

      return '(.*)';
    });

  // This is a workaround for handling unnamed matching groups.
  while (m = MATCHING_GROUP_REGEXP.exec(path)) {
    var escapeCount = 0;
    var index = m.index;

    while (path.charAt(--index) === '\\') {
      escapeCount++;
    }

    // It's possible to escape the bracket.
    if (escapeCount % 2 === 1) {
      continue;
    }

    if (keysOffset + i === keys.length || keys[keysOffset + i].offset > m.index) {
      keys.splice(keysOffset + i, 0, {
        name: name++, // Unnamed matching groups must be consistently linear.
        optional: false,
        offset: m.index
      });
    }

    i++;
  }

  // If the path is non-ending, match until the end or a slash.
  path += (end ? '$' : (path[path.length - 1] === '/' ? '' : '(?=\\/|$)'));

  return new RegExp(path, flags);
};

},{}],8:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[3]);
