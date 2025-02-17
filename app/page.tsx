"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="fixed top-8 left-0 right-0 z-10 w-full max-w-5xl mx-auto flex items-center justify-between font-mono text-sm lg:flex">
        <p className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing FastApi API&nbsp;
          <Link href="/api/py/helloFastApi">
            <code className="font-mono font-bold">api/index.py</code>
          </Link>
        </p>
        <p className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing Next.js API&nbsp;
          <Link href="/api/helloNextJs">
            <code className="font-mono font-bold">app/api/helloNextJs</code>
          </Link>
        </p>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-md mt-24">
        <h1 className="text-4xl font-bold mb-8">Todo Apps</h1>
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
            className="p-2 bg-green-500 text-white rounded"
          >
            Refresh
          </button>
        </div>
        <ul className="mt-4 w-full max-h-64 overflow-y-auto">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center p-2 border-b border-gray-300"
            >
              {todo.title}
              <button
                onClick={() => removeTodo(todo.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
