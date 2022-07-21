import datetime
import os
import random

from flask import Flask, render_template, redirect, make_response, jsonify, abort, request
import logging

from data import db_session
from data.article import Articles
from data.users import User
from data.artist import Artist

from form.loginform import LoginForm
from form.registerform import RegisterForm
from form.articleform import ArticleForm
from form.artistform import ArtistForm
from form.userform import UserForm

from flask_login import login_user, LoginManager, current_user, login_required, logout_user


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


# /////////////////
# ГЛАВНАЯ СТРАНИЦА
# /////////////////
@app.route('/', methods=['GET'])
def index():
    session = db_session.create_session()
    articles = session.query(Articles).all()
    # Обозначаем списки случайной статьи и последнего выпуска, это нужно для того,
    # чтобы сайт не выбрасывал ошибку в случае отсутствия статей в базе данных
    article_random = None
    article_past = None
    if articles:
        article_random = random.choice(articles)
        article_past = articles[-1]

    q = request.args.get('q')
    if q:
        articles = session.query(Articles).filter(Articles.title.like(f'%{q}%')).all()
    else:
        articles = articles[:4]
    return render_template('main.html', title='Art.',
                           article_random=article_random, article_past=article_past, articles=articles)


# ////////////////
# СТРАНИЦА О НАС
# ///////////////
@app.route('/about/', methods=['GET'])
def about():
    return render_template('about.html', title='О нас')


# ///////////////////////////////
# СТРАНИЦА ПОИСКА ПО ХУДОЖНИКАМ
# //////////////////////////////
@app.route('/search/artist/', methods=['GET'])
def search_artist():
    session = db_session.create_session()
    q = request.args.get('q')
    if q:
        artists = session.query(Artist).filter(Artist.name.like(f'%{q}%') |
                                               Artist.preview.like(f'%{q}%')).all()
    else:
        artists = session.query(Artist).all()
    return render_template('search_artist.html', title='Художники', artists=artists)


# ///////////////////
# СТРАНИЦА ХУДОЖНИКА
# ///////////////////
@app.route('/artist/<int:artist_id>/', methods=['GET'])
def artist(artist_id):
    session = db_session.create_session()
    author = session.query(Artist).filter(Artist.id == artist_id).first()  # Забираем все данные по уникальному id
    article_past = session.query(Articles).filter(Articles.artist_id == artist_id).order_by(Articles.id.desc()).first()

    return render_template('artist.html', title='Художник', author=author, article_past=article_past)


# ////////////////////////////
# СТРАНИЦА ПОИСКА ПО СТАТЬЯМ
# ////////////////////////////
@app.route('/search/article/', methods=['GET'])
def search_article():
    session = db_session.create_session()
    q = request.args.get('q')
    if q:
        articles = session.query(Articles).filter(Articles.title.like(f'%{q}%') |
                                                  Articles.text.like(f'%{q}%')).all()
    else:
        articles = session.query(Articles).all()
    return render_template('search_article.html', title='Статьи', articles=articles)


# /////////////////
# СТРАНИЦА СТАТЬИ
# /////////////////
@app.route('/article/<int:article_id>', methods=['GET'])
def article(article_id):
    session = db_session.create_session()
    article = session.query(Articles).filter(Articles.id == article_id).first()  # Забираем все данные по уникальному id
    artist = session.query(Artist).filter(Artist.id == article.artist_id).first()
    return render_template('article.html', title='Статья', article=article, artist=artist)


# ///////////////////////////////////////////////
# ВХОД И РЕГИСТРАЦИЯ НА СТРАНИЦУ АДМИНИСТРАТОРА
# //////////////////////////////////////////////
@app.route('/admin/', methods=['GET', "POST"])
def login():
    session = db_session.create_session()
    user = session.query(User).first()
    if user is None:  # Если в базе данных нет 1 пользователя, то необходимо предложить зарегистрироваться
        form = RegisterForm()
        if form.validate_on_submit():
            if form.password.data != form.password_again.data:
                # Если пользователь ввел разные пароли, то мы сообщаем ему об этом
                return render_template('register.html', title='Регистрация',
                                       form=form,
                                       message="Пароли не совпадают")
            session = db_session.create_session()
            if session.query(User).filter(User.email == form.email.data).first():
                # Если пользователь ввел почту, а она уже есть а базе данных, то мы также сообщаем об этом.
                # Почта должна быть уникальной, как и id
                return render_template('register.html', title='Регистрация',
                                       form=form,
                                       message="Такой пользователь уже есть")
            # Записываем значения а базу данных
            user = User(
                login=form.login.data,
                name=form.name.data,
                email=form.email.data,
                hashed_password=form.password.data,
            )

            user.set_password(form.password.data)
            session.add(user)
            session.commit()

            login_user(user, remember=form.password.data)
            res = make_response(redirect("/admin/panel"))
            # В куки записываем articles, чтобы в следующий раз, когда мы открываем страницу, нам были видны статьи
            # Еще есть пользователи и художники
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
                # В куки записываем articles, чтобы в следующий раз, когда мы открываем страницу, нам были видны статьи
                # Еще есть пользователи и художники
                res = make_response(redirect("/admin/panel"))
                res.set_cookie("active_button_menu", "articles", max_age=60*60*24*15, path='/')
                return res
            # В случае неправильно введенного логина или паролямы оповещаем об этом пользователя
            return render_template('login.html',
                                   message="Неправильный логин или пароль",
                                   form=form)
        return render_template('login.html', title='Авторизация', form=form)


# //////////////////////////////////
# ВЫХОД ИЗ СТРАНИЦЫ АДМИНИСТРАТОРА
# //////////////////////////////////
@app.route('/logout/')
@login_required
def logout():
    logout_user()
    return redirect("/")  # После выхода из админки нас перекидывает на главную страницу сайта


# /////////////////////////
# СТРАНИЦА АДМИНИСТРАТОРА
# /////////////////////////
@app.route('/admin/panel/', methods=['GET'])
def admin_panel():
    # По умолчанию делаем все списки None
    users = None
    authors = None
    articles = None
    # Если пользователь попал на эту страницу не зарегистрированный / авторизированный,
    # то мы перекидываем его на страницу регистрации и авторизации
    if not current_user.is_authenticated:
        return redirect("/admin")

    session = db_session.create_session()
    cookie = request.cookies.get('active_button_menu')  # Забираем куки для поиска по q
    q = request.args.get('q')

    if q:
        # Проверяем куки и достаем запросы из базы данных
        if cookie == "articles":
            articles = session.query(Articles).filter(Articles.title.like(f'%{q}%')).all()
            users = session.query(User).all()
            authors = session.query(Artist).all()
        elif cookie == "users":
            users = session.query(User).filter(User.name.like(f'%{q}%') |
                                               User.email.like(f'%{q}%') |
                                               User.login.like(f'%{q}%')).all()
            authors = session.query(Artist).all()
            articles = session.query(Articles).all()
        elif cookie == "autors":
            authors = session.query(Artist).filter(Artist.name.like(f'%{q}%')).all()
            users = session.query(User).all()
            articles = session.query(Articles).all()
    else:
        # Забираем все необходимые данные для админки
        users = session.query(User).all()
        authors = session.query(Artist).order_by(Artist.name).all()
        articles = session.query(Articles).order_by(Articles.id.desc()).all()

    return render_template('admin_panel.html', title='Панель администратора', users=users,
                           authors=authors, articles=articles)


# /////////////////////////////////
# СТРАНИЦА СОЗДАНИЯ НОВОЙ СТАТЬИ
# /////////////////////////////////
@app.route('/admin/article/new/', methods=['GET', 'POST'])
@login_required
def new_article():
    session = db_session.create_session()
    return new_edit_article(Articles(), session)


# ////////////////////////////////
# СТРАНИЦА РЕДАКТИРОВАНИЯ СТАТЬИ
# ////////////////////////////////
@app.route('/admin/article/<int:article_id>/', methods=['GET', 'POST'])
@login_required
def edit_article(article_id):
    session = db_session.create_session()
    article = session.query(Articles).filter(Articles.id == article_id).first()  # Забираем все данные по уникальному id
    if article:
        return new_edit_article(article, session)
    else:
        abort(404)


# Функция взятия и записывания данных статьи
def new_edit_article(article, session):
    form = ArticleForm()
    artists = session.query(Artist).all()
    if request.method == "GET":
        if article.title:
            # Забираем все значения из полей статьи
            form.title.data = article.title
            form.preview.data = article.preview
            form.main_image.data = article.main_image
            form.text.data = article.text

            form.attach_image.data = article.attach_image
            form.artist.data = article.artist.name
        else:
            form.main_image.data = "new_pic.jpg"
    else:
        if form.validate_on_submit():
            # Если все поля прошли валидацию и пользователь нажал кнопку "Опубликовать",
            # то мы записываем их значения в базу данных
            article.title = form.title.data.strip()
            article.preview = form.preview.data.strip()
            article.text = form.text.data.strip()
            # Главное изображение статьи
            if article.main_image is None:
                # При отсутствии изображения заменяем на начальное изображение - new_pic.jpg
                article.main_image = "new_pic.jpg"

            if form.main_image.data != article.main_image:
                # Если админ вставил изображение не равное предыдущему,
                # то мы изменяем имя файла и сохраняем в static/media/image/
                file_name = str(current_user.id) + "_" + str(int(datetime.datetime.now().replace().timestamp() * 1000))\
                            + str(random.randint(0, 9)) + "." + form.main_image.data.filename.split('.')[-1]
                # Имя фото делаем уникальным, чтобы при других сохранениях у нас не перезаписались изображения

                if article.main_image != "new_pic.jpg":
                    # Удаляем предыдущее изображение, только при условии, что оно не равно new_pic.jpg
                    try:
                        os.remove(os.path.join('static/media/image/', article.main_image))
                    except:
                        pass

                # Записываем в базу данных и сохраняем
                article.main_image = file_name
                form.main_image.data.save(os.path.join('static/media/image/', file_name))

            # Запись очереди фотографий
            attach_image = []
            if form.attach_image.data != "":  # Проверка на наличие названий
                # (Примечание: Название файлов записаны через пробел)
                attach_image = form.attach_image.data.split(" ")

            # Сохраняем новые картинки
            for file in request.files:
                if file != "main_image":
                    request.files[file].save(os.path.join('static/media/image/', file))

            # Удаляем удаленные из формы картинки
            if article.attach_image is not None and article.attach_image != "":
                for file in article.attach_image.split(" "):
                    if not (file in attach_image):
                        try:
                            os.remove(os.path.join('static/media/image/', file))
                        except:
                            pass

            article.attach_image = " ".join(attach_image)
            artist = session.query(Artist).filter(Artist.name == form.artist.data).first()
            article.artist_id = artist.id
            session.add(article)
            session.commit()

            return redirect('/admin/panel')

    return render_template('ad_ed_article.html', title='Редактирование статей', form=form,
                           artists=artists, id_article=article.id)


# /////////////////
# УДАЛЕНИЕ СТАТЬИ
# ////////////////
@app.route('/admin/article/del/<int:id_article>/', methods=['GET'])
@login_required
def delete_article(id_article):
    if current_user.is_authenticated:
        session = db_session.create_session()
        article = session.query(Articles).filter(Articles.id == id_article).first()
        # Если статья по таком id существует, то удаляем
        if article:
            image = article.main_image
            if image != "new_pic.jpg":  # Изображение не должно быть равно new_pic.jpg,
                # т.к. изображение по умолчанию не должно удалиться,
                # иначе нам не чего будет вставлять при отсутствии выбранного изображения
                try:
                    os.remove(os.path.abspath(os.curdir + '/static/media/image/' + image))
                except:
                    pass
            if article.attach_image != "":  # list_attach_image может быть равен пустой строке
                list_attach_image = article.attach_image.split()
                for img in list_attach_image:  # Удаляем все изображения из очереди
                    if img != "new_pic.jpg":
                        try:
                            os.remove(os.path.abspath(os.curdir + '/static/media/image/' + img))
                        except:
                            pass

            session.delete(article)
            session.commit()

        else:
            # Иначе выбрасываем ошибку
            abort(404)
        return redirect('/admin/panel')
    return redirect('/')


# //////////////////////////////////
# СТРАНИЦА СОЗДАНИЯ НОВОГО ХУДОЖНИКА
# //////////////////////////////////
@app.route('/admin/artist/new/', methods=['GET', 'POST'])
@login_required
def new_artist():
    session = db_session.create_session()
    return new_edit_artist(Artist(), session)


# //////////////////////////////////
# СТРАНИЦА РЕДАКТИРОВАНИЯ ХУДОЖНИКА
# //////////////////////////////////
@app.route('/admin/artist/<int:artist_id>/', methods=['GET', 'POST'])
@login_required
def edit_artist(artist_id):
    session = db_session.create_session()
    artist = session.query(Artist).filter(Artist.id == artist_id).first()  # Забираем все данные по уникальному id
    if article:
        return new_edit_artist(artist, session)
    else:
        abort(404)


# Функция взятия и записывания данных художника
def new_edit_artist(artist, session):
    form = ArtistForm()

    if request.method == "GET":
        if artist.name:
            # Забираем все значения из полей статьи
            form.name.data = artist.name
            form.preview.data = artist.preview
            form.main_image.data = artist.main_image
            form.thesis.data = artist.thesis
            form.text_biography.data = artist.text_biography
            form.text_5_facts.data = artist.text_5_facts
            form.attach_image.data = artist.attach_image
            form.artist_image.data = artist.artist_image
        else:
            form.artist_image.data = "new_pic.jpg"
            form.main_image.data = "new_pic.jpg"
    else:
        if form.validate_on_submit():
            # Если все поля прошли валидацию и пользователь нажал кнопку "Опубликовать",
            # то мы записываем их значения в базу данных
            artist.name = form.name.data.strip()
            artist.preview = form.preview.data.strip()

            # Главное изображение страницы художника
            if artist.main_image is None:
                # При отсутствии изображения заменяем на начальное изображение - new_pic.jpg
                artist.main_image = "new_pic.jpg"
            if form.main_image.data != artist.main_image:
                # Если админ вставил изображение не равное предыдущему,
                # то мы изменяем имя файла и сохраняем в static/media/image/
                file_name = str(current_user.id) + "_" + str(int(datetime.datetime.now().replace().timestamp() * 1000))\
                            + str(random.randint(0, 9)) + "." + form.main_image.data.filename.split('.')[-1]
                # Имя фото делаем уникальным, чтобы при других сохранениях у нас не перезаписались изображения

                if artist.main_image != "new_pic.jpg":
                    # Удаляем предыдущее изображение, только при условии, что оно не равно new_pic.jpg
                    try:
                        os.remove(os.path.join('static/media/image/', artist.main_image))
                    except:
                        pass

                # Записываем в базу данных и сохраняем
                artist.main_image = file_name
                form.main_image.data.save(os.path.join('static/media/image/', file_name))

            # Портрет художника
            if artist.artist_image is None:
                # При отсутствии изображения заменяем на начальное изображение - new_pic.jpg
                artist.artist_image = "new_pic.jpg"
            if form.artist_image.data != artist.artist_image:
                # Если админ вставил изображение не равное предыдущему,
                # то мы изменяем имя файла и сохраняем в static/media/image/
                file_name = str(current_user.id) + "_" + str(int(datetime.datetime.now().replace().timestamp() * 1000)) \
                            + str(random.randint(0, 9)) + "." + form.artist_image.data.filename.split('.')[-1]
                # Имя фото делаем уникальным, чтобы при других сохранениях у нас не перезаписались изображения

                if artist.artist_image != "new_pic.jpg":
                    # Удаляем предыдущее изображение, только при условии, что оно не равно new_pic.jpg
                    try:
                        os.remove(os.path.join('static/media/image/', artist.artist_image))
                    except:
                        pass

                # Записываем в базу данных и сохраняем
                artist.artist_image = file_name
                form.artist_image.data.save(os.path.join('static/media/image/', file_name))

            # Запись очереди фотографий
            attach_image = []
            if form.attach_image.data != "":  # Проверка на наличие названий
                # (Примечание: Название файлов записаны через пробел)
                attach_image = form.attach_image.data.split(" ")

            # Сохраняем новые картинки
            for file in request.files:
                if file != "main_image":
                    request.files[file].save(os.path.join('static/media/image/', file))

            # Удаляем удаленные из формы картинки
            if artist.attach_image is not None and artist.attach_image != "":
                for file in artist.attach_image.split(" "):
                    if not (file in attach_image):
                        os.remove(os.path.join('static/media/image/', file))

            artist.attach_image = " ".join(attach_image)
            # Записываем все остальные поля
            artist.thesis = form.thesis.data
            artist.text_biography = form.text_biography.data
            artist.text_5_facts = form.text_5_facts.data
            session.add(artist)
            session.commit()

            return redirect('/admin/panel')

    return render_template('ad_ed_artist.html', title='Редактирование страницы хуожника',
                           form=form, id_artist=artist.id)


# ////////////////////
# УДАЛЕНИЕ ХУДОЖНИКА
# ///////////////////
@app.route('/admin/artist/del/<int:id_artist>/', methods=['GET'])
@login_required
def delete_artist(id_artist):
    if current_user.is_authenticated:
        session = db_session.create_session()
        artist = session.query(Artist).filter(Artist.id == id_artist).first()

        # Если статья по таком id существует, то удаляем
        if artist:
            image = artist.main_image
            if image != "new_pic.jpg":  # Изображение не должно быть равно new_pic.jpg,
                # т.к. изображение по умолчанию не должно удалиться,
                # иначе нам не чего будет вставлять при отсутствии выбранного изображения
                try:
                    os.remove(os.path.abspath(os.curdir + '/static/media/image/' + image))
                except:
                    pass
            if artist.attach_image != "":  # list_attach_image может быть равен пустой строке
                list_attach_image = artist.attach_image.split()
                for img in list_attach_image:  # Удаляем все изображения из очереди
                    if img != "new_pic.jpg":
                        try:
                            os.remove(os.path.abspath(os.curdir + '/static/media/image/' + img))
                        except:
                            pass

            session.delete(artist)
            session.commit()
        else:
            # Иначе выбрасываем ошибку
            abort(404)
        return redirect('/admin/panel')
    return redirect('/')


# /////////////////////////////////////
# СТРАНИЦА РЕДАКТИРОВАНИЯ ПОЛЬЗОВАТЕЛЯ
# /////////////////////////////////////
@app.route('/admin/user/<int:user_id>/', methods=['GET', 'POST'])
@login_required
def edit_user(user_id):
    form = UserForm()
    session = db_session.create_session()
    user = session.query(User).filter(User.id == user_id).first()  # Забираем все данные по уникальному id

    if user:
        if request.method == "GET":
            # Забираем все значения из полей статьи
            form.login.data = user.login
            form.name.data = user.name
            form.email.data = user.email
        else:
            if form.validate_on_submit():
                # Если все поля прошли валидацию и пользователь нажал кнопку "Опубликовать",
                # то мы записываем их значения в базу данных
                user.login = form.login.data
                user.name = form.name.data
                user.email = form.email.data
                if form.password.data != "" and (not user.check_password(form.password.data)):
                    user.set_password(form.password.data)
                session.commit()

                return redirect('/admin/panel')
    else:
        abort(404)
    return render_template('ad_ed_user.html', title='Редактирование пользователя',
                           form=form, id_user=user.id)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
