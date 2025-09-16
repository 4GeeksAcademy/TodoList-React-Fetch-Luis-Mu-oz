import React, { useState, useEffect } from "react";

const Home = () => {
  const username = "luis11prog"
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

 useEffect(() => {
   
    fetch(`https://playground.4geeks.com/todo/users/${username}`)
      .then((res) => {
        if (res.status === 404 || res.status === 400) {
          return fetch(`https://playground.4geeks.com/todo/users/${username}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }).then(() => fetch(`https://playground.4geeks.com/todo/users/${username}`));
        }
        return res;
      })
      .then((resp) => resp.json())
      .then((data) => setTodos(data.todos || []))
      .catch((err) => console.error("Error cargando todos:", err));
  }, []);

  
  const addTodo = (e) => {
    e.preventDefault(); 
    if (newTodo.trim() === "") return;

    const todo = { label: newTodo, is_done: false };

    fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
      method: "POST",
      body: JSON.stringify(todo),
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setTodos([...todos, data]);
        setNewTodo(""); // Limpia el input
      })
      .catch((err) => console.error("Error creando todo:", err));
  };

 
  const removeTodo = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE",
    })
      .then((resp) => {
        if (resp.ok) {
          setTodos(todos.filter((todo) => todo.id !== id));
        }
      })
      .catch((err) => console.error("Error borrando todo:", err));
  };

  return (
    <div className="app-tareas">
      <div className="todo-container">
        <h1 className="title">
          📝¡HAZ LAS TAREAS!
        </h1>
        <form onSubmit={addTodo}>
          <input
            type="text"
            placeholder="Añade tus tareas"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="todo-input"
          />
        </form>

        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="empty">No hay tareas, añadir.👌</li>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                {todo.label}
                <button
                  className="delete-btn"
                  onClick={() => removeTodo(todo.id)}
                >
                  X
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="footer">
          {todos.length} {todos.length === 0 ? "tarea pendiente😁" : "tareas pendientes😞"}
        </div>
      </div>
    </div>
  );
};

export default Home;