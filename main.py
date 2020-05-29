import os
import random
from flask import Flask, render_template, redirect
import logging

from data import db_session
from data.article import Articles
from data.users import User
from form.loginform import LoginForm
from flask_login import login_user

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

@app.route('/admin', methods=['GET', "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        session = db_session.create_session()
        user = session.query(User).filter(User.login == form.login.data).first()

        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data)
            return redirect("/")
        return render_template('login.html',
                               message="Неправильный логин или пароль",
                               form=form)
    return render_template('login.html', title='Авторизация', form=form)

db_session.global_init("db/art_point_db.sqlite")
session = db_session.create_session()
user = session.query(User).first()
if user is None:
    user = User(login="admin", name="admin", email="admin@admin.ru", hashed_password="1111")
    user.set_password("1111")
    session.add(user)
    session.commit()



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
