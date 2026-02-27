import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State management
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // API Endpoints
  const API_URL = 'http://localhost:5000/api/tasks';
  const AUTH_URL = 'http://localhost:5000/api/auth';

  // Axios configuration with Bearer Token
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // 1. Fetch all tasks for the logged-in user
  const fetchTasks = async () => {
    if (!token) return;
    try {
      const response = await axios.get(API_URL, config);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 401) handleLogout();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  // 2. User Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${AUTH_URL}/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUsername('');
      setPassword('');
    } catch (err) {
      alert("Login failed! Please check your credentials.");
    }
  };

  // 3. User Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setTasks([]);
  };

  // 4. Create a new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!taskTitle) return;
    try {
      await axios.post(API_URL, { title: taskTitle }, config);
      setTaskTitle('');
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // 5. Toggle completion status
  const toggleTask = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, {}, config);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // 6. Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container">
      {!token ? (
        // Login View
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <form onSubmit={handleLogin} className="auth-form">
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            <button type="submit" className="login-btn">Sign In</button>
          </form>
          <p className="auth-footer">Try logging in with your registered account.</p>
          <p className="auth-signature">Developed by Sualp</p>
        </div>
      ) : (
        // Main App View
        <div className="app-shell">
          <div className="header">
            <h1>My Habits</h1>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
          
          <form onSubmit={addTask} className="task-form">
            <input 
              type="text" 
              value={taskTitle} 
              onChange={(e) => setTaskTitle(e.target.value)} 
              placeholder="What is your new habit?" 
              required
            />
            <button type="submit">Add</button>
          </form>

          <div className="task-list">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <div key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
                  <div className="task-info" onClick={() => toggleTask(task.id)}>
                    <span className="checkbox">{task.isCompleted ? '✔' : ''}</span>
                    <span className="task-text">{task.title}</span>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="delete-btn">Delete</button>
                </div>
              ))
            ) : (
              <p className="empty-msg">No habits added yet. Start now!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;