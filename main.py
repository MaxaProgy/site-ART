import os

from flask import Flask, request, render_template, redirect, abort, make_response, jsonify
import logging

from package.data import db_session
from package.data.article import Article
from package.data.artist import Artist
from package.data.comment import Comment
from package.data.users import User

logging.basicConfig(level=logging.INFO)
app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)


@app.route('/', methods=['GET'])
def index():
    return render_template('main.html', title='Главная страница')


db_session.global_init("db/art_point_db.sqlite")
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5055)
