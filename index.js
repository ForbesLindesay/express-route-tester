'use strict';

var pathRegexp = require('path-to-regexp');
var debounce = require('debounce');

var _ = document.querySelector.bind(document);

function escape(str) {
  return (str.length) ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;') : '';
}
function hide(selector) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = 'none';
  }
}
function show(selector) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = null;
  }
}

_('#inputRoute').addEventListener('input', debounce(update, 100), false);
_('#inputPath').addEventListener('input', debounce(updatePath, 100), false);

var keys, regexp;
function update() {
  keys = [];
  regexp = pathRegexp(_('#inputRoute').value, keys);
  _('#regexp-display').textContent = regexp.toString();
  if (keys.length) {
    _('#keys-display').innerHTML = '<ol>' + keys.map(function wrap(key) {
      return '<li>' + escape(key.name) + (key.optional ? ' (optional)' : '') + '</li>';
    }).join('') + '</ol>';
  } else {
    _('#keys-display').innerHTML = 'There are no keys captured by this route';
  }
  updatePath();
}
function updatePath() {
  var path = _('#inputPath').value;
  if (regexp.test(path)) {
    hide('.is-not-match');
    show('.is-match');
    var result = regexp.exec(path);
    _('#keys-results-display').innerHTML = '<dl class="dl-horizontal">' + keys.map(function (key, i) {
      return '<dt>' + escape(key.name) + '</dt><dd>' +
      escape(result[i + 1]) + '</dd>';
    }).join('') + '</dl>';
  } else {
    show('.is-not-match');
    hide('.is-match');
  }
}
update();
