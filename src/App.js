import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import ContactComponent from './components/ContactComponent';
import './App.css';

class App extends Component {
  state = {
    isAuthenticated: false,
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.setState({ isAuthenticated: true });
    }
  }

  handleLogin = () => {
    this.setState({ isAuthenticated: true });
  };

  handleLogout = () => {
    localStorage.removeItem('token');
    this.setState({ isAuthenticated: false });
  };

  render() {
    return (
      <Router>
        <div className="App">
          <nav>
            <h1>Contact Management System</h1>
            {this.state.isAuthenticated ? (
              <button onClick={this.handleLogout}>Logout</button>
            ) : (
              <div>
                <a href="/login">Login</a>
                <a href="/register">Register</a>
              </div>
            )}
          </nav>
          <div className="main-content">
            <Routes>
              <Route
                path="/login"
                element={
                  this.state.isAuthenticated ? (
                    <Navigate to="/contacts" />
                  ) : (
                    <LoginComponent onLogin={this.handleLogin} />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  this.state.isAuthenticated ? (
                    <Navigate to="/contacts" />
                  ) : (
                    <RegisterComponent />
                  )
                }
              />
              <Route
                path="/contacts"
                element={
                  this.state.isAuthenticated ? (
                    <ContactComponent />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;