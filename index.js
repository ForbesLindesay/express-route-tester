'use strict'

var debounce = require('debounce')

var pathRegexp
var versions = {
  '0.1.7': require('./versions/0.1.7'),
  '1.7.0': require('./versions/1.7.0'),
  '2.0.0': require('./versions/2.0.0')
}

var _ = document.querySelector.bind(document)

function escape (str) {
  str = '' + str
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;') // eslint-disable-line no-useless-escape
}
function hide (selector) {
  var elements = document.querySelectorAll(selector)
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = 'none'
  }
}
function show (selector) {
  var elements = document.querySelectorAll(selector)
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = null
  }
}

_('#inputStrict').addEventListener('change', updateOptions, false)
_('#inputSensitive').addEventListener('change', updateOptions, false)
_('#inputEnd').addEventListener('change', updateOptions, false)

_('#inputVersion').addEventListener('change', setVersion, false)
_('#inputRoute').addEventListener('input', debounce(update, 100), false)
_('#inputPath').addEventListener('input', debounce(updatePath, 100), false)

var opts = {
  strict: false,
  sensitive: false,
  end: true
}
function updateOptions (e) {
  switch (e.target.id) {
    case 'inputStrict':
      opts.strict = e.target.checked
      break
    case 'inputSensitive':
      opts.sensitive = e.target.checked
      break
    case 'inputEnd':
      opts.end = e.target.checked
      break
  }
  update()
}

function setVersion () {
  pathRegexp = versions[_('#inputVersion').value] || pathRegexp
  update()
}

var keys, regexp
function update () {
  keys = []
  try {
    regexp = pathRegexp(_('#inputRoute').value, keys, opts)
  } catch (e) {
    show('.is-error')
    hide('.is-not-match')
    hide('.is-match')
    _('#keys-results-display').innerHTML = '<pre><code>' + e.message + '</code></pre>'
    return
  }
  _('#keys-results-display').innerHTML = ''
  hide('.is-error')
  _('#regexp-display').textContent = regexp.toString()
  if (keys.length) {
    _('#keys-display').innerHTML = '<ol>' + keys.map(function wrap (key) {
      return '<li>' + escape(key.name) + (key.optional ? ' (optional)' : '') + '</li>'
    }).join('') + '</ol>'
  } else {
    _('#keys-display').innerHTML = 'There are no keys captured by this route'
  }
  updatePath()
}
function updatePath () {
  var path = _('#inputPath').value
  if (regexp.test(path)) {
    hide('.is-not-match')
    show('.is-match')
    var result = regexp.exec(path)
    _('#keys-results-display').innerHTML = '<dl class="dl-horizontal">' + keys.map(function (key, i) {
      return '<dt>' + escape(key.name) + '</dt><dd>' +
      (result[i + 1] ? escape(result[i + 1]) : '&nbsp;') + '</dd>'
    }).join('') + '</dl>'
  } else {
    show('.is-not-match')
    hide('.is-match')
  }
}
setVersion()
