$(function () {
    var pathRegexp = require('path-to-regexp');
    var t;
    $('#inputRoute, #inputPath').keyup(function () {
        clearTimeout(t);
        t = setTimeout(update, 200);
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
});