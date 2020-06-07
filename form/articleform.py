from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField


class ArticleForm(FlaskForm):
    main_image = StringField("Главная картинка статьи")

    artist = StringField("Автор статьи")
    title = StringField("Заголовок статьи")
    preview = StringField("Краткое описание статьи")
    text = TextAreaField("Текст статьи")

    attach_image = StringField("Прикрепленные картинки")

    submit = SubmitField('Опубликовать')
