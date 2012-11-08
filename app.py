
import os.path

from flask import Flask, make_response, request, render_template
from func import labels2srt
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload/", methods=["POST"])
def upload():
    f = request.files['file']
    srt = labels2srt(f.stream)
    f.close()

    response = make_response(srt)
    filename, ext = os.path.splitext(f.filename)
    filename = filename + '.srt'

    response.headers['Content-Disposition'] = 'attachment; filename=%s' % (filename,)
    response.headers['Content-Type'] = 'text/plain'

    return response

if __name__ == '__main__':
    app.run(debug=True)
