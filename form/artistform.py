from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField


class ArtistForm(FlaskForm):
    main_image = StringField("Главная картинка страницы художника")

    name = StringField("Имя художника")
    preview = StringField("Краткое описание деятельности художника")
    thesis = TextAreaField("Вводное слово о художнике")
    text_biography = TextAreaField("Текст биографии")
    text_5_facts = TextAreaField("Высказывания")

    artist_image = StringField("Портрет художника")
    attach_image = StringField("Прикрепленные картинки")

    submit = SubmitField('Опубликовать')
