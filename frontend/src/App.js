import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// axios.defaults.baseURL = 'http://localhost:3001'; 

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodoId, setEditTodoId] = useState(null); 
  const [editTodoText, setEditTodoText] = useState(''); 

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await axios.post('/api/todos', { text: newTodo });
      console.log('Todo added:', response.data);
      setNewTodo('');
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const updateTodo = async (id, newText) => {
    try {
      await axios.put(`/api/todos/${id}`, { text: newText });
      fetchTodos();
      setEditTodoId(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleEditMode = (id, text) => {
    setEditTodoId(id);
    setEditTodoText(text);
  };

  return (
    <div className="App">
      <h1>To-Do App</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new to-do"
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {editTodoId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editTodoText}
                  onChange={(e) => setEditTodoText(e.target.value)}
                />
                <button onClick={() => updateTodo(todo._id, editTodoText)}>Update</button>
              </>
            ) : (
              <>
                {todo.text}
                <button onClick={() => toggleEditMode(todo._id, todo.text)}>Edit</button>
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
