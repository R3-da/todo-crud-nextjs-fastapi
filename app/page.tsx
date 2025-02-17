"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { FaTrash, FaSyncAlt } from "react-icons/fa";

export default function Home() {
  const [todos, setTodos] = useState<{ id: number; title: string }[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get("/api/py/todos/");
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      const response = await axios.post("/api/py/todos/", { title: newTodo.trim() });
      if (response.status === 200) {
        fetchTodos();
        setNewTodo("");
      }
    }
  };

  const removeTodo = async (id: number) => {
    const response = await axios.delete(`/api/py/todos/${id}`);
    if (response.status === 200) {
      fetchTodos();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 bg-gradient-to-t from-gray-900 via-gray-900 to-black">
      <div className="fixed top-8 left-0 right-0 z-10 w-full max-w-5xl mx-auto flex items-center justify-center font-mono text-sm lg:flex gap-4">
        <p className="flex w-full justify-center bg-gradient-to-b pb-6 pt-8 backdrop-blur-2xl dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing FastApi API&nbsp;
          <Link href="/api/py/helloFastApi">
            <code className="font-mono font-bold">api/index.py</code>
          </Link>
        </p>
        <p className="flex w-full justify-center bg-gradient-to-b pb-6 pt-8 backdrop-blur-2xl dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing Next.js API&nbsp;
          <Link href="/api/helloNextJs">
            <code className="font-mono font-bold">app/api/helloNextJs</code>
          </Link>
        </p>
      </div>

      <div className="flex flex-col items-center w-full max-w-md mt-10 mb-8">
        <h1 className="text-4xl font-bold mb-8">Todo App</h1>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
          placeholder="Add a new todo"
        />
        <div className="flex w-full space-x-2">
          <button
            onClick={addTodo}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Add Todo
          </button>
          <button
            onClick={fetchTodos}
            className="w-16 h-12 bg-green-500 text-white rounded flex items-center justify-center"
          >
            <FaSyncAlt />
          </button>
        </div>
      </div>
      <div className="w-full max-w-md">
        <ul className="mt-4 w-full h-96 overflow-y-auto bg-gray-100 rounded p-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center p-2 border-b border-gray-300 text-black"
            >
              {todo.title}
              <button
                onClick={() => removeTodo(todo.id)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
