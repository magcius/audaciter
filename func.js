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

    function sortMessages(labels) {
        var times = {};
        times[0] = [];
        labels.forEach(function(label) {
            if (!times[label.start])
                times[label.start] = [];
            times[label.start].push({ op: 'add', message: label.message });

            if (!times[label.stop])
                times[label.stop] = [];
            times[label.stop].push({ op: 'remove', message: label.message });
        });

        var activeMessages = {};
        var timeline = [];
        var sortedTimes = Object.keys(times).map(function(S) {
            return parseInt(S, 10);
        }).sort(function(a, b) {
            return a - b;
        });
        sortedTimes.forEach(function(time) {
            var ops = times[time];
            ops.forEach(function(op) {
                if (op.op === 'add')
                    activeMessages[op.message] = 1;
                if (op.op === 'remove')
                    delete activeMessages[op.message];
            });

            timeline.push({ time: time, messages: Object.keys(activeMessages) });
        });

        return timeline;
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

    function formatChunk(chunkNum, start, stop, messages) {
        var lines = [];

        lines.push('');
        lines.push(chunkNum);
        lines.push(srtTimecode(start) + '-->' + srtTimecode(stop));
        lines.push.apply(lines, messages);

        return lines.join('\n');
    }

    function makeSrt(timeline) {
        var chunks = [];
        var chunkNum = 0;
        for (var i = 0; i < timeline.length; i++) {
            var messages = timeline[i].messages;
            if (!messages.length)
                continue;

            var start = timeline[i].time;
            var stop = timeline[i+1].time;

            chunks.push(formatChunk(chunkNum++, start, stop, messages));
        }

        return chunks.join('\n');
    }

    function labelsToSrt(labels) {
        var lines = labels.split('\n');

        var messages = parseLabels(lines);
        var timeline = sortMessages(messages);
        var srt = makeSrt(timeline);
        return srt;
    }

    exports.labelsToSrt = labelsToSrt;

})(window);
