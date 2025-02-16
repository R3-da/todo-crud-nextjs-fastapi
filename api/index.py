import os
import subprocess
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session

DATABASE_URL = "sqlite:///./database.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)

class Timer(Base):
    __tablename__ = "timers"
    id = Column(Integer, primary_key=True, index=True)
    duration = Column(Integer)
    todo_id = Column(Integer, ForeignKey("todos.id"))

    todo = relationship("Todo", back_populates="timers")

Todo.timers = relationship("Timer", back_populates="todo")

def run_migrations():
    if subprocess.run(["which", "alembic"], capture_output=True).returncode == 0:
        subprocess.run(["alembic", "upgrade", "head"])
    else:
        print("Alembic is not installed. Skipping migrations.")

def init_db():
    if not os.path.exists("./database.db"):
        Base.metadata.create_all(bind=engine)
        run_migrations()
    db = SessionLocal()
    try:
        # Check and seed only if needed
        if db.query(Todo).count() == 0:
            seed_db(db)
    finally:
        db.close()

def seed_db(db: Session):
    # Add initial data to the database
    initial_todos = [
        {"title": "First Todo"},
        {"title": "Second Todo"}
    ]
    for todo_data in initial_todos:
        db_todo = Todo(**todo_data)
        db.add(db_todo)
    db.commit()

    # Add initial timers data
    initial_timers = [
        {"duration": 30, "todo_id": db.query(Todo).filter(Todo.title == "First Todo").first().id},
        {"duration": 45, "todo_id": db.query(Todo).filter(Todo.title == "Second Todo").first().id}
    ]
    for timer_data in initial_timers:
        db_timer = Timer(**timer_data)
        db.add(db_timer)
    db.commit()

init_db()

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}

@app.post("/api/py/todos/")
def create_todo(title: str, db: Session = Depends(get_db)):
    db_todo = Todo(title=title)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.get("/api/py/todos/")
def read_todos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    todos = db.query(Todo).offset(skip).limit(limit).all()
    return todos

@app.post("/api/py/timers/")
def create_timer(duration: int, todo_id: int, db: Session = Depends(get_db)):
    db_timer = Timer(duration=duration, todo_id=todo_id)
    db.add(db_timer)
    db.commit()
    db.refresh(db_timer)
    return db_timer

@app.get("/api/py/timers/")
def read_timers(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    timers = db.query(Timer).offset(skip).limit(limit).all()
    return timers