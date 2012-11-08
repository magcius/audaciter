#!/usr/bin/env python

def parse_label_time(timestamp):
    # This is a horrible idea.
    secs, msecs = timestamp.split('.', 1)
    return int(secs) * 1000 + int(msecs[:3])

def parse_labels(labels):
    for line in labels:
        line = line.strip()
        if not line:
            continue

        if line.startswith('#'):
            continue

        start, stop, message = line.split(None, 2)
        start = parse_label_time(start)
        stop = parse_label_time(stop)
        yield start, stop, message

def sort_messages(timeline):
    times = { 0: [] }
    for label in timeline:
        start, stop, message = label
        times.setdefault(start, []).append(('add', label))
        times.setdefault(stop, []).append(('remove', label))

    active_labels = []
    for time, operations in sorted(times.iteritems()):
        for operation in operations:
            op, label = operation
            if op == 'add':
                active_labels.append(label)
            elif op == 'remove':
                active_labels.remove(label)

        yield time, [message for (start, stop, message) in active_labels]

def srt_timecode(msecs):
    value, ms = divmod(msecs, 1000)
    value, s = divmod(value, 60)
    h, m = divmod(value, 60)
    return '%02d:%02d:%02d,%03d' % (h, m, s, ms)

def make_srt(sorted_messages):
    srt_chunks = []
    i = 1
    sorted_messages = list(sorted_messages)
    for idx, (time, messages) in enumerate(sorted_messages):
        if not messages:
            continue

        start = time
        stop = sorted_messages[idx+1][0]

        srt_chunks.append("""
%d
%s --> %s
%s
""" % (i, srt_timecode(start), srt_timecode(stop), '\n'.join(messages)))
        i += 1

    return ' '.join(srt_chunks)

def labels2srt(labels):
    parsed_labels = parse_labels(labels)
    sorted_messages = sort_messages(parsed_labels)
    srt = make_srt(sorted_messages)
    return srt
