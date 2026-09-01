import os
from flask import Flask, Response, send_file

app = Flask(__name__)

@app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'OPTIONS'])
@app.route('/<path:path>', methods=['GET', 'POST', 'OPTIONS'])
def catch_all(path):
    candidates = [
        os.path.join(os.path.dirname(__file__), '..', 'index.html'),
        os.path.join(os.path.dirname(__file__), 'index.html'),
        'index.html'
    ]
    for c in candidates:
        if os.path.exists(c):
            with open(c, 'r', encoding='utf-8') as f:
                return Response(f.read(), mimetype='text/html')
    return Response("<h1>ThanhHoa Land AI</h1>", mimetype='text/html')
