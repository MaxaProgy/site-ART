from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField


class ArtistForm(FlaskForm):
    name = StringField("Имя художника")
    preview = StringField("Краткое описание деятельности художника")
    main_image = StringField("Главная картинка страницы художника")
    thesis = TextAreaField("Вводное слово о художнике")
    text_biography = TextAreaField("Текст биографии")
    artist_image = StringField("Портрет художника")
    text_5_facts = TextAreaField("Высказывания")
    instagram = StringField("Ссылка на инстаграмм художника")
    site = StringField("Ссылка на сайт художника")
    video_1 = StringField("Видео 1")
    video_2 = StringField("Видео 2")
    attach_image = StringField("Прикрепленные картинки")
    submit = SubmitField('Опубликовать')
