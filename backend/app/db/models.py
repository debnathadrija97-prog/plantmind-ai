from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from .session import Base

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True)
    filename = Column(String)
    doc_type = Column(String)
    raw_text = Column(Text)
    uploaded_at = Column(DateTime, server_default=func.now())

class Entity(Base):
    __tablename__ = "entities"
    id = Column(Integer, primary_key=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    entity_type = Column(String)
    entity_value = Column(String)
    page_number = Column(Integer)

class Chunk(Base):
    __tablename__ = "chunks"
    id = Column(Integer, primary_key=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    chunk_text = Column(Text)
    page_number = Column(Integer)
    embedding = Column(Vector(384))