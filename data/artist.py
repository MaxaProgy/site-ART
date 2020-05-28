import sqlalchemy
from sqlalchemy import orm
from sqlalchemy_serializer import SerializerMixin
from .db_session import SqlAlchemyBase


class Artist(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'artist'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String)
    main_image = sqlalchemy.Column(sqlalchemy.String)

    thesis = sqlalchemy.Column(sqlalchemy.Text)

    text_biography = sqlalchemy.Column(sqlalchemy.Text)
    artist_image = sqlalchemy.Column(sqlalchemy.String)

    image_1 = sqlalchemy.Column(sqlalchemy.String)
    image_2 = sqlalchemy.Column(sqlalchemy.String)

    text_5_facts = sqlalchemy.Column(sqlalchemy.Text)

    video_1 = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    video_2 = sqlalchemy.Column(sqlalchemy.String, nullable=True)

    instagram = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    site = sqlalchemy.Column(sqlalchemy.String, nullable=True)


    articles = orm.relation("Articles", back_populates='artist')
