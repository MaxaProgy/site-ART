import datetime
import random
from flask import Flask, render_template, redirect, make_response, jsonify, abort, request
import logging
from data import db_session
from data.article import Articles
from data.users import User
from form.loginform import LoginForm
from form.registerform import RegisterForm
from form.articleform import ArticleForm
from flask_login import login_user, LoginManager, current_user, login_required, logout_user
from data.artist import Artist

logging.basicConfig(level=logging.ERROR)
app = Flask(__name__)
login_manager = LoginManager()
login_manager.init_app(app)
app.config['SECRET_KEY'] = 'bfhdjwiskoldjEFE4GUJFTYGGG5G5G65H6G565F3222JGTHGRFDJSKE;ROJELAGTRH4TF'
db_session.global_init("db/art_point_db.sqlite")

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@login_manager.user_loader
def load_user(user_id):
    session = db_session.create_session()
    return session.query(User).get(user_id)

@app.route('/', methods=['GET'])
def index():
    session = db_session.create_session()
    articles = session.query(Articles).all()
    article_random = None
    article_past = None
    if articles:
        article_random = random.choice(articles)
        article_past = articles[0]
    return render_template('main.html', title='Art.',
                           article_random=article_random, article_past=article_past)


@app.route('/admin', methods=['GET', "POST"])
def login():
    session = db_session.create_session()
    user = session.query(User).first()
    if user is None:
        form = RegisterForm()
        if form.validate_on_submit():
            if form.password.data != form.password_again.data:
                return render_template('register.html', title='Регистрация',
                                       form=form,
                                       message="Пароли не совпадают")
            session = db_session.create_session()
            if session.query(User).filter(User.email == form.email.data).first():
                return render_template('register.html', title='Регистрация',
                                       form=form,
                                       message="Такой пользователь уже есть")
            user = User(
                login=form.login.data,
                name=form.name.data,
                email=form.email.data,
                hashed_password=form.password.data,
            )

            user.set_password(form.password.data)
            session.add(user)
            session.commit()
            res = make_response(redirect("/admin/panel"))
            res.set_cookie("active_button_menu", "articles", max_age=60*60*24*15, path='/')
            return res
        return render_template('register.html', title='Регистрация', form=form)
    else:
        form = LoginForm()
        if form.validate_on_submit():
            session = db_session.create_session()
            user = session.query(User).filter(User.login == form.login.data).first()

            if user and user.check_password(form.password.data):
                login_user(user, remember=form.password.data)
                res = make_response(redirect("/admin/panel"))
                res.set_cookie("active_button_menu", "articles", max_age=60*60*24*15, path='/')
                return res
            return render_template('login.html',
                                   message="Неправильный логин или пароль",
                                   form=form)
        return render_template('login.html', title='Авторизация', form=form)

@app.route('/admin/panel', methods=['GET'])
def admin_panel():
    if not current_user.is_authenticated:
        return redirect("/admin")

    session = db_session.create_session()
    users = session.query(User).all()
    autors = session.query(Artist).all()
    articles = session.query(Articles).all()
    return render_template('admin_panel.html', title='Панель администратора', users=users, autors=autors, articles=articles)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/")


@app.route('/search/artist', methods=['GET'])
def search_artist():
    session = db_session.create_session()
    q = request.args.get('q')
    if q:
        artists = session.query(Artist).filter(Artist.name.like(f'%{q}%')).all()
    else:
        artists = session.query(Artist).all()
    return render_template('search_artist.html', title='Художники', artists=artists)

@app.route('/admin/article/new', methods=['GET', 'POST'])
@login_required
def new_article():
    form = ArticleForm()
    if form.validate_on_submit():
        session = db_session.create_session()
        article = Articles()
        article.title = form.title.data
        article.preview = form.preview.data
        article.main_image = form.main_image.data
        article.text = form.text.data
        article.image_1 = form.image_1.data
        article.image_2 = form.image_2.data
        article.video_1 = form.video_1.data
        article.video_2 = form.video_2.data
        session.commit()

        return redirect('/admin/panel')

    return render_template('ad_ed_article.html', title='Редактирование статей', form=form)

@app.route('/admin/article/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_article(id):
    form = ArticleForm()
    session = db_session.create_session()
    article = session.query(Articles).filter(Articles.id == id).first()

    if article:
        if request.method == "GET":
            form.title.data = article.title
            form.preview.data = article.preview
            form.main_image.data = article.main_image
            form.text.data = article.text
            form.image_1.data = article.image_1
            form.image_2.data = article.image_2
            form.video_1.data = article.video_1
            form.video_2.data = article.video_2
        else:
            if form.validate_on_submit():
                article.title = form.title.data
                article.preview = form.preview.data
                article.main_image = form.main_image.data
                article.text = form.text.data
                article.image_1 = form.image_1.data
                article.image_2 = form.image_2.data
                article.video_1 = form.video_1.data
                article.video_2 = form.video_2.data
                session.commit()

                return redirect('/admin/panel')
    else:
        abort(404)
    return render_template('ad_ed_article.html', title='Редактирование статей', form=form)

@app.route('/search/article', methods=['GET'])
def search_article():
    session = db_session.create_session()
    q = request.args.get('q')
    if q:
        articles = session.query(Articles).filter(Articles.title.like(f'%{q}%') | Articles.text.like(f'%{q}%')).all()
    else:
        articles = session.query(Articles).all()
    return render_template('search_article.html', title='Художники', articles=articles)


@app.route('/article/<int:article_id>', methods=['GET'])
def article(article_id):
    session = db_session.create_session()
    article = session.query(Articles).filter(Articles.id == article_id).first()
    return render_template('article.html', title='Статья', article=article)


@app.route('/artist/<int:artist_id>', methods=['GET'])
def artist(artist_id):
    session = db_session.create_session()
    artist = session.query(Artist).filter(Artist.id == artist_id).first()
    return render_template('artist.html', title='Художник', artist=artist)


"""session = db_session.create_session()
artist = Articles(
    title = "sdfgbsdf", preview = "sdfgsdfg", main_image = "ghsdfgasa", text = "hjkl.hjk,", image_1 = "xfgxd",
    image_2 = "xsdghdf", video_1 = "zxcfgbvsdf", video_2 = "xgvbghwsdf",
    create_date = datetime.datetime.now(),
    artist_id = 1)
session.add(artist)
session.commit()"""

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
