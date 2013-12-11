(function(exports) {

    function parseLabelTime(timestamp) {
        // This is a horrible idea.
        var parsed = timestamp.split('.', 2);
        var secs = parsed[0], msecs = parsed[1];
        return parseInt(secs, 10) * 1000 + parseInt(msecs.slice(0, 3), 10);
    }

    function parseLabels(lines) {
        var labels = [];

        lines.forEach(function(line) {
            line = line.trim();

            if (!line)
                return;

            if (line.startsWith('#'))
                return;

            var parsed = line.match(/(.*?)\s+(.*?)\s+(.*)/);
            var start = parseLabelTime(parsed[1]);
            var stop = parseLabelTime(parsed[2]);
            var message = parsed[3];
            labels.push({ start: start, stop: stop, message: message });
        });

        return labels;
    }

    function srtTimecode(msecs) {
        var ms = Math.floor(msecs % 1000);
        var value = msecs / 1000;

        var s = Math.floor(value % 60);
        value = value / 60;

        var m = Math.floor(value % 60);
        var h = Math.floor(value / 60);

        function pad(n, z) {
            n = '' + n;
            while (n.length < z)
                n = '0' + n;
            return n;
        }

        return (pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ',' + pad(ms, 3));
    }

    function formatSrtChunk(label, i) {
        var lines = [];

        lines.push('');
        lines.push(i + 1);
        lines.push(srtTimecode(label.start) + ' --> ' + srtTimecode(label.stop));
        lines.push(label.message);

        return lines.join('\n');
    }

    function labelsToSrt(labels) {
        var lines = labels.split('\n');
        var srt = parseLabels(lines).map(formatSrtChunk).join('\n');
        return srt;
    }

    exports.labelsToSrt = labelsToSrt;

})(window);
