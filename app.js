$(function () {
    var t;
    $('#inputRoute, #inputPath').keyup(function () {
        clearTimeout(t);
        t = setTimeout(update, 500);
    });
    function update() {
        var keys = [];
        var regexp = pathRegexp($('#inputRoute').val(), keys);
        $('#regexp-display').html(regexp.toString());
        if (keys.length) {
            $('#keys-display').html('<ol>' + keys.map(function wrap(key) {
                return '<li>' + key.name + (key.optional?' (optional)':'') + '</li>';
            }).join('') + '</ol>');
        } else {
            $('#keys-display').html('There are no keys captured by this route');
        }

        var path = $('#inputPath').val();
        var isMatch = regexp.test(path);
        if (isMatch) {
            $('.is-not-match').hide();
            $('.is-match').show();
            var result = regexp.exec(path);
            $('#keys-results-display').html('<dl class="dl-horizontal">' + keys.map(function (key, i) {
                return '<dt>' + key.name + '</dt><dd>' + 
                result[i + 1] + '</dd>';
            }).join('') + '</dl>');
        } else {
            $('.is-not-match').show();
            $('.is-match').hide();
        }
    }
    update();

    /**
     * Normalize the given path string,
     * returning a regular expression.
     *
     * An empty array should be passed,
     * which will contain the placeholder
     * key names. For example "/user/:id" will
     * then contain ["id"].
     *
     * @param  {String} path
     * @param  {Array} keys
     * @param  {Boolean} sensitive
     * @param  {Boolean} strict
     * @return {String}
     * @api private
     */
    function pathRegexp(path, keys, sensitive, strict) {
          path = path
            .concat(strict ? '' : '/?')
            .replace(/\/\(/g, '(?:/')
            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star){
              keys.push({ name: key, optional: !! optional });
              slash = slash || '';
              return ''
                + (optional ? '' : slash)
                + '(?:'
                + (optional ? slash : '')
                + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
                + (optional || '')
                + (star ? '(/*)?' : '');
            })
            .replace(/([\/.])/g, '\\$1')
            .replace(/\*/g, '(.*)');
          return new RegExp('^' + path + '$', sensitive ? '' : 'i');
    }
});