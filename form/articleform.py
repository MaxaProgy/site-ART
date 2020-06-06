from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField


class ArticleForm(FlaskForm):
    artist = StringField("Автор статьи")
    title = StringField("Заголовок статьи")
    preview = StringField("Краткое описание статьи")
    main_image = StringField("Главная картинка статьи")
    text = TextAreaField("Текст статьи")
    image_1 = StringField("Картинка 1")
    image_2 = StringField("Картинка 2")
    video_1 = StringField("Видео 1")
    video_2 = StringField("Видео 2")
    attach_image = StringField("Прикрепленные картинки")
    submit = SubmitField('Опубликовать')
