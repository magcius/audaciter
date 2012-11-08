
from func import parse_labels, sort_messages, make_srt, srt_timecode

labels_text = """
0.673379        2.554195        dildoes
2.983764        4.063492        but why
5.038730        8.115374        why are they
10.135510       11.192018       boyd
2.043356        3.332063        dildones
5.804989        7.128526        iono
8.777143        9.392472        whee
"""

parsed_labels = [
    (673, 2554, "dildoes"),
    (2983, 4063, "but why"),
    (5038, 8115, "why are they"),
    (10135, 11192, "boyd"),
    (2043, 3332, "dildones"),
    (5804, 7128, "iono"),
    (8777, 9392, "whee"),
]

sorted_messages = [
    (0, []),
    (673, ["dildoes"]),
    (2043, ["dildoes", "dildones"]),
    (2554, ["dildones"]),
    (2983, ["dildones", "but why"]),
    (3332, ["but why"]),
    (4063, []),
    (5038, ["why are they"]),
    (5804, ["why are they", "iono"]),
    (7128, ["why are they"]),
    (8115, []),
    (8777, ["whee"]),
    (9392, []),
    (10135, ["boyd"]),
    (11192, [])
]

srt_text = """
1
00:00:00,673 --> 00:00:02,043
dildoes
 
2
00:00:02,043 --> 00:00:02,554
dildoes
dildones
 
3
00:00:02,554 --> 00:00:02,983
dildones
 
4
00:00:02,983 --> 00:00:03,332
dildones
but why
 
5
00:00:03,332 --> 00:00:04,063
but why
 
6
00:00:05,038 --> 00:00:05,804
why are they
 
7
00:00:05,804 --> 00:00:07,128
why are they
iono
 
8
00:00:07,128 --> 00:00:08,115
why are they
 
9
00:00:08,777 --> 00:00:09,392
whee
 
10
00:00:10,135 --> 00:00:11,192
boyd
"""

def test_parse_labels():
    out = list(parse_labels(labels_text.splitlines()))
    assert out == parsed_labels

def test_sorted_messages():
    out = list(sort_messages(parsed_labels))
    assert out == sorted_messages

def test_srt_timecode():
    assert srt_timecode(12345) == "00:00:12,345"

def test_make_srt():
    out = make_srt(sorted_messages)
    assert out == srt_text
