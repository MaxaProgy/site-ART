import os
import random
from flask import Flask, render_template
import logging

from data import db_session
from data.article import Articles

logging.basicConfig(level=logging.INFO)
app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)


@app.route('/', methods=['GET'])
def index():
    session = db_session.create_session()
    articles = session.query(Articles).all()
    article_random = random.sample(articles, len(articles))[0]
    article_past = session.query(Articles).filter(Articles.create_date).first()
    return render_template('main.html', title='Главная страница',
                           article_random=article_random, article_past=article_past)


db_session.global_init("db/art_point_db.sqlite")
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
