from flask import Flask, Blueprint, render_template, jsonify
from config import Config
import os

# table bp
table_bp = Blueprint('table_bp', __name__,
                    template_folder='templates',
                    static_folder='static', static_url_path='assets')


dirname = os.path.dirname(__file__)


# routes
@table_bp.route('/', defaults={'path': ''})
@table_bp.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")


@table_bp.route('/tests')
def tests():


    return jsonify({'status': 'converted'})


@table_bp.route('/test/container')
def test_container():
    pass



# flask server
app = Flask(__name__)
app.config.from_object(Config)

app.register_blueprint(table_bp, url_prefix='')


if __name__ == "__main__":
    # app.config['SERVER_NAME'] = 'devvv.com:8080'
    # app.run()
    app.run(host='0.0.0.0', port=8080, debug=True)
    # app.run(host='0.0.0.0', port=8080, debug=True)
