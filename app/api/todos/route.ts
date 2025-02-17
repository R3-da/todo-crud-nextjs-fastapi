import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "database", "database.json");

// Helper functions
const readData = (): { todos: { id: number; title: string }[] } => {
  if (!fs.existsSync(DATA_FILE)) return { todos: [] };
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
};

const writeData = (data: { todos: { id: number; title: string }[] }) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
};

// **GET: Fetch all todos**
export async function GET() {
  const data = readData();
  return NextResponse.json(data.todos);
}

// **POST: Add a new todo**
export async function POST(req: NextRequest) {
  const { title } = await req.json();
  if (!title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const data = readData();
  const newTodo = { id: data.todos.length + 1, title };
  data.todos.push(newTodo);
  writeData(data);

  return NextResponse.json(newTodo);
}

// **DELETE: Remove a todo by ID**
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
  
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }
  
    const data = readData();
    const todoIndex = data.todos.findIndex(todo => todo.id === Number(id));
  
    if (todoIndex === -1) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
  
    data.todos.splice(todoIndex, 1);
    writeData(data);
  
    return NextResponse.json({ message: "Todo deleted successfully" });
  }