from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField


class UserForm(FlaskForm):
    login = StringField("Логин пользователя")
    name = StringField("Имя пользователя")
    email = StringField("Почта")
    password = StringField("Пароль")
    submit = SubmitField('Опубликовать')
