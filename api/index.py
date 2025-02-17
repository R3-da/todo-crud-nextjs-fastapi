import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DATA_FILE = "./database/database.json"

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def read_data():
    if not os.path.exists(DATA_FILE):
        return {"todos": [], "timers": []}
    with open(DATA_FILE, "r") as file:
        return json.load(file)

def write_data(data):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)

class TodoItem(BaseModel):
    title: str

@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}

@app.post("/api/py/todos/")
def create_todo(todo: TodoItem):
    data = read_data()
    new_todo = {"id": len(data["todos"]) + 1, "title": todo.title}
    data["todos"].append(new_todo)
    write_data(data)
    return new_todo

@app.get("/api/py/todos/")
def read_todos(skip: int = 0, limit: int = 10):
    data = read_data()
    return data["todos"][skip:skip + limit]

@app.delete("/api/py/todos/{todo_id}")
def delete_todo(todo_id: int):
    data = read_data()
    todo_index = next((index for (index, d) in enumerate(data["todos"]) if d["id"] == todo_id), None)
    if todo_index is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    data["todos"].pop(todo_index)
    write_data(data)
    return {"message": "Todo deleted successfully"}

@app.post("/api/py/timers/")
def create_timer(duration: int, todo_id: int):
    data = read_data()
    if not any(todo["id"] == todo_id for todo in data["todos"]):
        raise HTTPException(status_code=404, detail="Todo not found")
    new_timer = {"id": len(data["timers"]) + 1, "duration": duration, "todo_id": todo_id}
    data["timers"].append(new_timer)
    write_data(data)
    return new_timer

@app.get("/api/py/timers/")
def read_timers(skip: int = 0, limit: int = 10):
    data = read_data()
    return data["timers"][skip:skip + limit]